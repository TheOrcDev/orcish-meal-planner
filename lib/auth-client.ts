import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    plugins: [polarClient()],
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    redirectURL: "/",
})
