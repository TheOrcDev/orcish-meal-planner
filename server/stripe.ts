import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_API_VERSION = "2024-12-18.acacia";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: STRIPE_API_VERSION,
});

export async function createPaymentIntent(amount: number) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "USD",
    });

    return new NextResponse(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function getInvoice(paymentIntentId: string) {
  try {
    const invoice = await stripe.invoices.retrieve(paymentIntentId);
    return invoice;
  } catch (error) {
    throw new Error("Failed to get invoice");
  }
}
