# 🗄️ Database Maintenance Guide

Use these commands to manage your database depending on your environment (Dev vs. Production).

## 🛡️ Safe Commands (Production Friendly)
Use these when you want to update the schema or seed data **without** deleting existing user data.

| Command | Description | When to use |
| :--- | :--- | :--- |
| `pnpm prisma db push` | Syncs your `schema.prisma` with the DB. | After adding new models or fields. |
| `pnpm db:seed` | Runs all `seed-*.ts` files. | To add new AI models, personas, or portfolio items. (Uses `upsert` so it's safe). |
| `pnpm db:embeddings` | Generates vector embeddings for your site content. | After updating blog posts, portfolio projects, or site text. |
| `npx prisma studio` | Opens a GUI to view/edit your data. | When you want to manually verify or edit rows. |

---

## ⚠️ Destructive Commands (Dev Only)
**WARNING:** These will delete all existing data in your database.

| Command | Description |
| :--- | :--- |
| `pnpm db:reset` | Wipes the DB, pushes the schema, and runs all seeds + embeddings from scratch. |
| `npx prisma db push --force-reset` | Drops all tables and recreates them based on the current schema. |

---

## 🛠️ Maintenance Workflow
If you've just added a new feature like the SaaS Dashboard:
1. `pnpm prisma db push` (Sync the new tables)
2. `pnpm db:seed` (Add the test/initial data)
3. `pnpm db:embeddings` (Ensure search/RAG is updated)
