"use server";

import { Resend } from "resend";

import { BoughtTokens } from "@/components/emails/bought-tokens";
import { Tokens } from "@/components/shared/types";
import db from "@/db/drizzle";
import { purchases, tokenSpends } from "@/db/schema";
import { getTotalTokens } from "@/lib/queries";

import { getUserSession } from "./users";

const priceMap = {
  [Tokens.TEN]: 1,
  [Tokens.FIFTY]: 3.5,
  [Tokens.HUNDRED]: 6,
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getTokens() {
  const session = await getUserSession();

  try {
    const totalUserTokens = await getTotalTokens(
      session?.user?.email
    );

    return totalUserTokens;
  } catch (e) {
    throw e;
  }
}

export async function insertPurchase(
  tokens: Tokens
) {
  try {
    const session = await getUserSession();

    await db.insert(purchases).values({
      userId: session?.user?.id,
      amount: priceMap[tokens],
    });

    const { error } = await resend.emails.send({
      from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: [session?.user?.email],
      subject: "Your Meal Planning Starts Here",
      react: BoughtTokens({ tokens }),
    });

    if (error) {
      throw error;
    }

    return priceMap[tokens];
  } catch (e) {
    console.log(e);
  }
}

export async function spendTokens(
  amount: number,
  action: string
) {
  try {
    const session = await getUserSession();

    await db.insert(tokenSpends).values({
      userId: session?.user?.id,
      action: action,
      amount: amount,
    });
  } catch (e) {
    throw e;
  }
}
