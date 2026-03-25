import { db, categoriesTable } from "@workspace/db";

async function seedGadgets() {
  console.log("Inserting gadget categories...");
  await db
    .insert(categoriesTable)
    .values([
      { name: "Phones & Accessories", slug: "phones", description: "Mobile phones and accessories", gender: "unisex", section: "gadgets" },
      { name: "Laptops & Computers", slug: "laptops", description: "Laptops, desktops and peripherals", gender: "unisex", section: "gadgets" },
      { name: "Smart Watches", slug: "smart-watches", description: "Smart watches and wearables", gender: "unisex", section: "gadgets" },
      { name: "Audio & Earphones", slug: "audio", description: "Headphones, earphones and speakers", gender: "unisex", section: "gadgets" },
      { name: "Power Banks & Chargers", slug: "power-banks", description: "Power banks, chargers and cables", gender: "unisex", section: "gadgets" },
      { name: "Gadget Accessories", slug: "gadget-accessories", description: "Cases, screen guards and accessories", gender: "unisex", section: "gadgets" },
    ])
    .onConflictDoUpdate({ target: categoriesTable.slug, set: { section: "gadgets" } });

  const all = await db.select().from(categoriesTable);
  console.log("All categories:", JSON.stringify(all.map(c => ({ id: c.id, name: c.name, section: c.section })), null, 2));
  console.log("Done!");
  process.exit(0);
}

seedGadgets().catch(e => { console.error(e); process.exit(1); });
