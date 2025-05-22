import { generateRandomString, symmetricEncrypt } from "better-auth/crypto";

import { auth } from "@/lib/auth"; // import your auth instance

function getCSVData(csv: string) {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0]?.split(',').map(header => header.trim()) || [];
    const jsonData = lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
        }, {} as Record<string, string>);
    });

    return jsonData as Array<{
        id: string;
        first_name: string;
        last_name: string;
        username: string;
        primary_email_address: string;
        primary_phone_number: string;
        verified_email_addresses: string;
        unverified_email_addresses: string;
        verified_phone_numbers: string;
        unverified_phone_numbers: string;
        totp_secret: string;
        password_digest: string;
        password_hasher: string;
    }>;
}

const exportedUserCSV = await Bun.file("exported_users.csv").text(); // this is the file you downloaded from Clerk

async function getClerkUsers(totalUsers: number) {
    const clerkUsers: {
        id: string;
        first_name: string;
        last_name: string;
        username: string;
        image_url: string;
        password_enabled: boolean;
        two_factor_enabled: boolean;
        totp_enabled: boolean;
        backup_code_enabled: boolean;
        banned: boolean;
        locked: boolean;
        lockout_expires_in_seconds: number;
        created_at: number;
        updated_at: number;
        external_accounts: {
            id: string;
            provider: string;
            identification_id: string;
            provider_user_id: string;
            approved_scopes: string;
            email_address: string;
            first_name: string;
            last_name: string;
            image_url: string;
            created_at: number;
            updated_at: number;
        }[]
    }[] = [];
    for (let i = 0; i < totalUsers; i += 500) {
        const response = await fetch(`https://api.clerk.com/v1/users?offset=${i}&limit=${500}`, {
            headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        const clerkUsersData = await response.json();
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        clerkUsers.push(...clerkUsersData as any);
    }
    return clerkUsers;
}


export async function generateBackupCodes(
    secret: string,
) {
    const key = secret;
    const backupCodes = Array.from({ length: 10 })
        .fill(null)
        .map(() => generateRandomString(10, "a-z", "0-9", "A-Z"))
        .map((code) => `${code.slice(0, 5)}-${code.slice(5)}`);
    const encCodes = await symmetricEncrypt({
        data: JSON.stringify(backupCodes),
        key: key,
    });
    return encCodes
}

// Helper function to safely convert timestamp to Date
function safeDateConversion(timestamp?: number): Date {
    if (!timestamp) return new Date();

    // Convert seconds to milliseconds
    const date = new Date(timestamp * 1000);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.warn(`Invalid timestamp: ${timestamp}, falling back to current date`);
        return new Date();
    }

    // Check for unreasonable dates (before 2000 or after 2100)
    const year = date.getFullYear();
    if (year < 2000 || year > 2100) {
        console.warn(`Suspicious date year: ${year}, falling back to current date`);
        return new Date();
    }

    return date;
}

async function migrateFromClerk() {
    const jsonData = getCSVData(exportedUserCSV);
    const clerkUsers = await getClerkUsers(jsonData.length);
    const ctx = await auth.$context
    const isAdminEnabled = ctx.options?.plugins?.find(plugin => plugin.id === "admin");
    const isTwoFactorEnabled = ctx.options?.plugins?.find(plugin => plugin.id === "two-factor");
    const isUsernameEnabled = ctx.options?.plugins?.find(plugin => plugin.id === "username");
    const isPhoneNumberEnabled = ctx.options?.plugins?.find(plugin => plugin.id === "phone-number");
    for (const user of jsonData) {
        const { id, first_name, last_name, username, primary_email_address, primary_phone_number, verified_email_addresses, unverified_email_addresses, verified_phone_numbers, unverified_phone_numbers, totp_secret, password_digest, password_hasher } = user;
        const clerkUser = clerkUsers.find(clerkUser => clerkUser?.id === id);

        // create user
        const createdUser = await ctx.adapter.create<{
            id: string;
        }>({
            model: "user",
            data: {
                id,
                email: primary_email_address,
                emailVerified: verified_email_addresses.length > 0,
                name: `${first_name} ${last_name}`,
                image: clerkUser?.image_url,
                createdAt: safeDateConversion(clerkUser?.created_at),
                updatedAt: safeDateConversion(clerkUser?.updated_at),
                // # Two Factor (if you enabled two factor plugin)
                ...(isTwoFactorEnabled ? {
                    twoFactorEnabled: clerkUser?.two_factor_enabled
                } : {}),
                // # Admin (if you enabled admin plugin)
                ...(isAdminEnabled ? {
                    banned: clerkUser?.banned,
                    banExpiresAt: clerkUser?.lockout_expires_in_seconds,
                    role: "user"
                } : {}),
                // # Username (if you enabled username plugin)
                ...(isUsernameEnabled ? {
                    username: username,
                } : {}),
                // # Phone Number (if you enabled phone number plugin)  
                ...(isPhoneNumberEnabled ? {
                    phoneNumber: primary_phone_number,
                    phoneNumberVerified: verified_phone_numbers.length > 0,
                } : {}),
            },
            forceAllowId: true
        }).catch(async e => {
            return await ctx.adapter.findOne<{
                id: string;
            }>({
                model: "user",
                where: [{
                    field: "id",
                    value: id
                }]
            })
        })
        // create external account
        const externalAccounts = clerkUser?.external_accounts;
        if (externalAccounts) {
            for (const externalAccount of externalAccounts) {
                const { id, provider, identification_id, provider_user_id, approved_scopes, email_address, first_name, last_name, image_url, created_at, updated_at } = externalAccount;
                if (externalAccount.provider === "credential") {
                    await ctx.adapter.create({
                        model: "account",
                        data: {
                            id,
                            providerId: provider,
                            accountId: externalAccount.provider_user_id,
                            scope: approved_scopes,
                            userId: createdUser?.id,
                            createdAt: safeDateConversion(created_at),
                            updatedAt: safeDateConversion(updated_at),
                            password: password_digest,
                        }
                    })
                } else {
                    await ctx.adapter.create({
                        model: "account",
                        data: {
                            id,
                            providerId: provider.replace("oauth_", ""),
                            accountId: externalAccount.provider_user_id,
                            scope: approved_scopes,
                            userId: createdUser?.id,
                            createdAt: safeDateConversion(created_at),
                            updatedAt: safeDateConversion(updated_at),
                        },
                        forceAllowId: true
                    })
                }
            }
        }

        //two factor
        if (isTwoFactorEnabled) {
            await ctx.adapter.create({
                model: "twoFactor",
                data: {
                    userId: createdUser?.id,
                    secret: totp_secret,
                    backupCodes: await generateBackupCodes(totp_secret)
                }
            })
        }
    }
}

migrateFromClerk()
    .then(() => {
        console.log('Migration completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });