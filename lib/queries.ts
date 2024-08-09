import db from "@/db/drizzle";
import { purchases, tokenSpends } from "@/db/schema";
import { count, eq, sum } from "drizzle-orm";

const FREE_TOKENS = 5;

export const getTotalTokens = async (email: string): Promise<number> => {
    try {
        const [tokens] = await db.
            select({ value: sum(purchases.amount) }).
            from(purchases).
            where(eq(purchases.email, email));

        if (!tokens.value) {
            tokens.value = "0"
        }

        const [tokensSpend] = await db.select({ count: count() }).
            from(tokenSpends).
            where(eq(tokenSpends.email, email));

        return +tokens.value - tokensSpend.count + FREE_TOKENS;
    } catch (e) {
        throw (e);
    }

}
