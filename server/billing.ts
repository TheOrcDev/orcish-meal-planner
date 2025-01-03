import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { purchases } from "@/db/schema";

export async function getBilling() {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not found");
    }

    const allPurchases = await db.query.purchases.findMany({
      where: eq(purchases.email, user.emailAddresses[0].emailAddress!),
    });
    return allPurchases;
  } catch (e) {
    throw e;
  }
}
