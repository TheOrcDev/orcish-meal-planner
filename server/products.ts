
import db from "@/db/drizzle";
import { products } from "@/db/schema";

export const getProducts = async () => {
    try {
        return await db.select().from(products);
    } catch (e) {
        console.log(e);
    }
}

export const getPolarProducts = async () => {
    try {
        const polarProducts = await getProducts();

        const products = polarProducts?.map((product) => {
            return {
                productId: product.polarProductId,
                slug: product.slug,
            }
        })

        return products;
    } catch (e) {
        console.log(e);
    }
}
