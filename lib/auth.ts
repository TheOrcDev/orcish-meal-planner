import { checkout, polar, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

import ForgotPasswordEmail from "@/components/emails/forgot-password";
import db from "@/db/drizzle";
import { schema } from "@/db/schema";
import { insertPurchase } from "@/server/tokens";

const resend = new Resend(process.env.RESEND_API_KEY);

const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
});

const products = [
    { productId: "0b4b4595-507e-4a6e-82ad-ba6e45b33524", slug: "10-tokens" },
    { productId: "6f5eb95a-0291-465d-a5d3-073f78736a2c", slug: "50-tokens" },
    { productId: "7a89d286-80eb-4cf1-a23c-43e2d452195a", slug: "100-tokens" }
]

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
                    products,
                    successUrl: "/payment/success",
                    authenticatedUsersOnly: true,
                }),
                webhooks({
                    secret: process.env.POLAR_WEBHOOK_SECRET!,
                    onOrderPaid: async (payload) => {
                        if (payload.data.paid) {
                            insertPurchase(payload.data.product.id, payload.data.customer.externalId as string)
                        }
                    }
                })
            ],
        }),
        nextCookies()]
});
