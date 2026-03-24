import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, and, ilike, or } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  try {
    const { category, search, inStock } = req.query;

    let query = db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        categorySlug: categoriesTable.slug,
        gender: productsTable.gender,
        ageGroup: productsTable.ageGroup,
        sizes: productsTable.sizes,
        colors: productsTable.colors,
        material: productsTable.material,
        imageUrls: productsTable.imageUrls,
        stockQuantity: productsTable.stockQuantity,
        lowStockThreshold: productsTable.lowStockThreshold,
        isAvailable: productsTable.isAvailable,
        isFeatured: productsTable.isFeatured,
        badge: productsTable.badge,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id));

    const conditions = [eq(productsTable.isAvailable, true)];

    if (category && category !== "all") {
      conditions.push(or(
        eq(categoriesTable.slug, category as string),
        eq(productsTable.gender, category as string)
      )!);
    }

    if (search) {
      conditions.push(
        or(
          ilike(productsTable.name, `%${search}%`),
          ilike(productsTable.description, `%${search}%`)
        )!
      );
    }

    if (inStock === "true") {
      conditions.push(eq(productsTable.stockQuantity, 0));
    }

    const products = await query.where(and(...conditions));

    res.json(products.map(formatProduct));
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const [product] = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        categorySlug: categoriesTable.slug,
        gender: productsTable.gender,
        ageGroup: productsTable.ageGroup,
        sizes: productsTable.sizes,
        colors: productsTable.colors,
        material: productsTable.material,
        imageUrls: productsTable.imageUrls,
        stockQuantity: productsTable.stockQuantity,
        lowStockThreshold: productsTable.lowStockThreshold,
        isAvailable: productsTable.isAvailable,
        isFeatured: productsTable.isFeatured,
        badge: productsTable.badge,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(formatProduct(product));
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatProduct(p: any) {
  return {
    ...p,
    price: parseFloat(p.price),
    createdAt: p.createdAt?.toISOString(),
  };
}

export default router;
