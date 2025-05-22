"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Resend } from "resend";
import Stripe from "stripe";

import { BoughtTokens } from "@/components/emails/bought-tokens";
import { Tokens } from "@/components/shared/types";
import db from "@/db/drizzle";
import { purchases, tokenSpends } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getTotalTokens } from "@/lib/queries";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

const priceMap = {
  [Tokens.TEN]: 1,
  [Tokens.FIFTY]: 3.5,
  [Tokens.HUNDRED]: 6,
};

const getTokenByPrice = (price: number) => {
  for (const [key, value] of Object.entries(priceMap)) {
    if (value === price) {
      return key;
    }
  }
  return Tokens.TEN;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getTokens() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    const totalUserTokens = await getTotalTokens(
      session?.user?.email!
    );

    return totalUserTokens;
  } catch (e) {
    throw e;
  }
}

export async function getClientSecret(tokens: Tokens) {
  const price = priceMap[tokens];

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(price) * 100,
      currency: "USD",
    });

    return paymentIntent.client_secret;
  } catch (e) {
    throw e;
  }
}

export async function getPaymentIntent(
  paymentIntentString: string,
  paymentIntentSecret: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentString
    );

    if (paymentIntent.status !== "succeeded") {
      return;
    }

    const [existingRecord] = await db
      .select()
      .from(purchases)
      .where(eq(purchases.paymentIntentSecret, paymentIntentSecret));

    // Already Saved
    if (existingRecord) {
      return existingRecord.amount;
    }

    const amountOfTokens = getTokenByPrice(paymentIntent.amount / 100);

    await db.insert(purchases).values({
      email: session?.user?.email!,
      paymentIntent: paymentIntentString,
      paymentIntentSecret,
      amount: +amountOfTokens,
    });

    const { error } = await resend.emails.send({
      from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: [session?.user?.email!],
      subject: "Your Meal Planning Starts Here",
      react: BoughtTokens({ tokens: amountOfTokens }),
    });

    if (error) {
      throw error;
    }

    return +amountOfTokens;
  } catch (e) {
    console.log(e);
  }
}

export async function spendTokens(
  amount: number,
  email: string,
  action: string
) {
  try {
    await db.insert(tokenSpends).values({
      amount: amount,
      email: email,
      action: action,
    });
  } catch (e) {
    throw e;
  }
}
