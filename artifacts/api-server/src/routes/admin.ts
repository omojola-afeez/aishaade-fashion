import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, and, lte, sql } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "basmallah2024";
const JWT_SECRET = process.env.JWT_SECRET || "basmallah_secret_key_2024";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

const validTokens = new Set<string>();

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  if (!validTokens.has(token)) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  next();
}

router.post("/admin/login", (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = generateToken();
  validTokens.add(token);
  res.json({ token, message: "Login successful" });
});

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  },
});

router.post("/admin/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No image uploaded" });
    return;
  }
  const url = `/api/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

router.get("/admin/products", authMiddleware, async (req, res) => {
  try {
    const products = await db
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
      .orderBy(sql`${productsTable.createdAt} DESC`);

    res.json(products.map((p) => ({ ...p, price: parseFloat(p.price), createdAt: p.createdAt?.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to list admin products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/products", authMiddleware, async (req, res) => {
  try {
    const {
      name, description, price, categoryId, gender, ageGroup,
      sizes, colors, material, imageUrls, stockQuantity,
      lowStockThreshold, isAvailable, isFeatured, badge,
    } = req.body;

    const [product] = await db
      .insert(productsTable)
      .values({
        name,
        description,
        price: price.toString(),
        categoryId,
        gender: gender || "unisex",
        ageGroup: ageGroup || "all",
        sizes: sizes || [],
        colors: colors || [],
        material,
        imageUrls: imageUrls || [],
        stockQuantity: stockQuantity ?? 0,
        lowStockThreshold: lowStockThreshold ?? 5,
        isAvailable: isAvailable ?? true,
        isFeatured: isFeatured ?? false,
        badge: badge || null,
      })
      .returning();

    res.status(201).json({ ...product, price: parseFloat(product.price), createdAt: product.createdAt?.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/products/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const updates: any = { ...req.body };
    if (updates.price !== undefined) updates.price = updates.price.toString();

    const [product] = await db
      .update(productsTable)
      .set(updates)
      .where(eq(productsTable.id, id))
      .returning();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ ...product, price: parseFloat(product.price), createdAt: product.createdAt?.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/products/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/inventory/alerts", authMiddleware, async (req, res) => {
  try {
    const products = await db
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
      .where(
        sql`${productsTable.stockQuantity} <= ${productsTable.lowStockThreshold}`
      );

    res.json(products.map((p) => ({ ...p, price: parseFloat(p.price), createdAt: p.createdAt?.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to get inventory alerts");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
