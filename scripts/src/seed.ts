import { db, categoriesTable, productsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding categories...");

  const categories = await db
    .insert(categoriesTable)
    .values([
      { name: "Abaya", slug: "abaya", description: "Elegant abayas for women", gender: "women" },
      { name: "Jalabia", slug: "jalabia", description: "Traditional jalabias for men", gender: "men" },
      { name: "Caps & Hats", slug: "caps", description: "Caps and hats for all", gender: "unisex" },
      { name: "Kids Wear", slug: "kids-wear", description: "Clothing for children", gender: "kids" },
      { name: "Materials & Fabrics", slug: "materials", description: "Ready-made fabric materials", gender: "unisex" },
      { name: "Kaftan", slug: "kaftan", description: "Kaftans for men and women", gender: "unisex" },
      { name: "Hijab & Accessories", slug: "hijab", description: "Hijabs and accessories", gender: "women" },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`Inserted ${categories.length} categories`);

  const catMap: Record<string, number> = {};
  const allCats = await db.select().from(categoriesTable);
  for (const c of allCats) catMap[c.slug] = c.id;

  console.log("Seeding products...");

  const products = await db
    .insert(productsTable)
    .values([
      {
        name: "Black Chiffon Abaya",
        description: "Luxurious black chiffon abaya with intricate gold embroidery on the sleeves and hem. Perfect for formal occasions and everyday elegance.",
        price: "18500",
        categoryId: catMap["abaya"],
        gender: "women",
        ageGroup: "adults",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy Blue"],
        material: "Chiffon",
        imageUrls: [],
        stockQuantity: 25,
        lowStockThreshold: 5,
        isAvailable: true,
        isFeatured: true,
        badge: "hot",
      },
      {
        name: "Embroidered White Jalabia",
        description: "Classic white jalabia with beautiful hand-embroidered neckline. Ideal for Eid, Jumuah and special gatherings.",
        price: "12000",
        categoryId: catMap["jalabia"],
        gender: "men",
        ageGroup: "adults",
        sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
        colors: ["White", "Off-White", "Cream"],
        material: "Cotton blend",
        imageUrls: [],
        stockQuantity: 30,
        lowStockThreshold: 5,
        isAvailable: true,
        isFeatured: true,
        badge: "new",
      },
      {
        name: "Prayer Cap Set",
        description: "High-quality kufi cap in pure white cotton. Lightweight and comfortable for daily prayers. Available in multiple sizes.",
        price: "2500",
        categoryId: catMap["caps"],
        gender: "men",
        ageGroup: "adults",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Cream", "Beige"],
        material: "Cotton",
        imageUrls: [],
        stockQuantity: 60,
        lowStockThreshold: 10,
        isAvailable: true,
        isFeatured: false,
        badge: null,
      },
      {
        name: "Kids Abaya Set",
        description: "Adorable abaya set for little girls. Comes with matching hijab. Soft fabric that's gentle on children's skin.",
        price: "8500",
        categoryId: catMap["kids-wear"],
        gender: "kids",
        ageGroup: "kids",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        colors: ["Pink", "Lilac", "Mint Green", "Black"],
        material: "Soft jersey",
        imageUrls: [],
        stockQuantity: 4,
        lowStockThreshold: 5,
        isAvailable: true,
        isFeatured: true,
        badge: "new",
      },
      {
        name: "Ankara Kaftan",
        description: "Vibrant Ankara kaftan with African print. Perfect for celebrations, outings, and casual wear. Fully lined for comfort.",
        price: "15000",
        categoryId: catMap["kaftan"],
        gender: "unisex",
        ageGroup: "adults",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Multi-color", "Blue & Gold", "Red & Black"],
        material: "Ankara fabric",
        imageUrls: [],
        stockQuantity: 18,
        lowStockThreshold: 5,
        isAvailable: true,
        isFeatured: true,
        badge: "hot",
      },
      {
        name: "Premium Hijab Collection",
        description: "Set of 3 premium quality hijabs in neutral shades. Made from breathable material that stays in place all day.",
        price: "5500",
        categoryId: catMap["hijab"],
        gender: "women",
        ageGroup: "adults",
        sizes: ["One Size"],
        colors: ["Black + Grey + Navy", "Beige + Cream + Brown", "Pink + Purple + Blue"],
        material: "Jersey",
        imageUrls: [],
        stockQuantity: 3,
        lowStockThreshold: 5,
        isAvailable: true,
        isFeatured: false,
        badge: "sale",
      },
      {
        name: "Lace Fabric (Per Yard)",
        description: "Beautiful imported lace fabric. Ideal for sewing abayas, evening dresses, and formal wear. Sold per yard.",
        price: "3000",
        categoryId: catMap["materials"],
        gender: "unisex",
        ageGroup: "all",
        sizes: ["Per yard"],
        colors: ["White", "Black", "Gold", "Silver", "Red"],
        material: "Imported lace",
        imageUrls: [],
        stockQuantity: 100,
        lowStockThreshold: 10,
        isAvailable: true,
        isFeatured: false,
        badge: null,
      },
      {
        name: "Boys Jalabia",
        description: "Smart and comfortable jalabia for boys. Perfect for Eid, mosque visits, and family occasions.",
        price: "6500",
        categoryId: catMap["kids-wear"],
        gender: "kids",
        ageGroup: "kids",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
        colors: ["White", "Sky Blue", "Light Grey"],
        material: "Cotton",
        imageUrls: [],
        stockQuantity: 2,
        lowStockThreshold: 5,
        isAvailable: true,
        isFeatured: false,
        badge: "new",
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`Inserted ${products.length} products`);
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
