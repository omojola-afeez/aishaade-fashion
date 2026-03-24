# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Basmallah Fashion — a full-stack Islamic & African fashion sales website with admin dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS v4 + Framer Motion
- **Image uploads**: Multer (stored in `uploads/` folder)

## Features

### Public Website
- **Home page**: Hero with background image, stats, category showcase (Men/Women/Kids), featured products
- **Catalog page**: Full product browsing with gender tabs + category filters + search
- **Product detail page**: Image gallery, sizes, colors, material, stock status, WhatsApp order button

### Admin Dashboard (/admin)
- **Password-protected login** (default: `basmallah2024`, set via `ADMIN_PASSWORD` env var)
- **Overview tab**: Stats (total products, available, alerts, categories) + recent products table
- **Products tab**: Full list with edit/delete actions, stock status indicators
- **Add/Edit product tab**: Full product form with image upload, sizes, colors, tags, toggles
- **Inventory alerts tab**: Lists all products at or below their low stock threshold

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/          # Express API server
│   └── basmallah-fashion/   # React + Vite frontend (previewPath: /)
├── lib/
│   ├── api-spec/            # OpenAPI spec + Orval codegen config
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod schemas from OpenAPI
│   └── db/                  # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts          # Database seeder
```

## Database Schema

- `categories`: id, name, slug, description, gender (men/women/kids/unisex)
- `products`: id, name, description, price, categoryId, gender, ageGroup, sizes[], colors[], material, imageUrls[], stockQuantity, lowStockThreshold, isAvailable, isFeatured, badge, createdAt

## API Routes

- `GET /api/categories` — public category list
- `GET /api/products` — public product list (with category/search/inStock filters)
- `GET /api/products/:id` — single product
- `POST /api/admin/login` — login with `{password}`, returns `{token}`
- `GET /api/admin/products` — all products (auth required)
- `POST /api/admin/products` — create product (auth required)
- `PUT /api/admin/products/:id` — update product (auth required)
- `DELETE /api/admin/products/:id` — delete product (auth required)
- `POST /api/admin/upload` — upload image (multipart, auth required)
- `GET /api/admin/inventory/alerts` — low stock products (auth required)
- `GET /api/uploads/:filename` — serve uploaded images

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `ADMIN_PASSWORD` — Admin login password (default: `basmallah2024`)
- `PORT` — Server port (auto-assigned)

## Commands

- `pnpm --filter @workspace/api-server run dev` — run API server
- `pnpm --filter @workspace/basmallah-fashion run dev` — run frontend
- `pnpm --filter @workspace/db run push` — push DB schema
- `pnpm --filter @workspace/scripts run seed` — seed sample data
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client
