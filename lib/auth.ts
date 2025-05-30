import { checkout, polar } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

import ForgotPasswordEmail from "@/components/emails/forgot-password";
import db from "@/db/drizzle";
import { schema } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    // Use 'sandbox' if you're using the Polar Sandbox environment
    // Remember that access tokens, products, etc. are completely separated between environments.
    // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
    server: 'sandbox'
});

export const auth = betterAuth({
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            await resend.emails.send({
                from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: [user.email],
                subject: "Reset your password",
                react: ForgotPasswordEmail({ resetLink: url, username: user.name }),
            });
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "59639467-9595-49bf-b2a1-1c5cb79fef35", // ID of Product from Polar Dashboard
                            slug: "100-tokens" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        }
                    ],
                    successUrl: "/success?checkout_id={CHECKOUT_ID}",
                    authenticatedUsersOnly: true
                }),
            ],
        }),
        nextCookies()]
});
