import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import db from "@/db/drizzle";
import { purchases } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getBilling() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("User not found");
    }

    const allPurchases = await db.query.purchases.findMany({
      where: eq(purchases.email, session.user.email!),
    });
    return allPurchases;
  } catch (e) {
    throw e;
  }
}
