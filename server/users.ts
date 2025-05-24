"use server";


import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import db from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

import { userSchema } from "./schemas";

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("User not found");
    }

    return session;
}

export const signIn = async (_: unknown, formData: FormData): Promise<{
    errors: Record<string, string[]>;
    values: Record<string, string>;
    redirect?: string;
}> => {
    const formValues = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    try {
        const signInResult = await auth.api.signInEmail({
            body: {
                email: formValues.email,
                password: formValues.password,
            },

        })

        return {
            errors: {},
            values: {
                text: "Successfully signed in.",
            },
            redirect: "/dashboard/meal-planner",
        }
    } catch (e: unknown) {
        const error = e as Error;
        return {
            errors: { message: [error.message || 'An unknown error occurred'] },
            values: {},
        }
    }
}

export const signUp = async (_: unknown, formData: FormData): Promise<{
    errors: Record<string, string[]>;
    values: Record<string, string>;
    redirect?: string;
}> => {
    const formValues = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
    }

    try {
        const signUpResult = await auth.api.signUpEmail({
            body: {
                email: formValues.email,
                password: formValues.password,
                name: formValues.name,
            }
        })

        return {
            errors: {},
            values: {
                text: "Successfully signed up.",
            },
            redirect: "/dashboard/meal-planner",
        }
    } catch (e) {
        const error = e as Error;
        return {
            errors: { message: [error.message || 'An unknown error occurred'] },
            values: {},
        }
    }
}

export const getUserProfile = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("User not found");
    }

    const [userProfile] = await db.select().from(user).where(eq(user.id, session?.user?.id));

    return userProfile;
}

export const updateProfile = async (data: z.infer<typeof userSchema>) => {
    const session = await getUserSession();

    try {
        await db.update(user).set(data).where(eq(user.id, session?.user?.id));

        return {
            values: {
                text: "Successfully updated profile.",
            },
            redirect: "/dashboard/meal-planner",
        }
    } catch (e) {
        const error = e as Error;
        return {
            errors: { message: [error.message || 'An unknown error occurred'] },
        }
    }
}

