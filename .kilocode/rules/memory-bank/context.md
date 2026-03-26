# Active Context: App Tracker

## Current State

**App Status**: App Tracker feature complete

The application is a personal app and subscription tracking web app. Users can manage their apps with properties for pricing, subscription plans, due dates, platforms, and usage status.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Database setup with Drizzle + SQLite
- [x] App Tracker feature (apps table, CRUD API, full UI)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page (server component, fetches apps) | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/app/api/apps/route.ts` | API: list/create apps | ✅ Ready |
| `src/app/api/apps/[id]/route.ts` | API: get/update/delete app | ✅ Ready |
| `src/components/AppListClient.tsx` | Main list with filtering | ✅ Ready |
| `src/components/AppCard.tsx` | App display card | ✅ Ready |
| `src/components/AppForm.tsx` | Add/edit modal form | ✅ Ready |
| `src/lib/types.ts` | Shared types and constants | ✅ Ready |
| `src/db/schema.ts` | Database schema (apps table) | ✅ Ready |
| `src/db/index.ts` | Database client | ✅ Ready |
| `src/db/migrate.ts` | Migration runner | ✅ Ready |
| `drizzle.config.ts` | Drizzle configuration | ✅ Ready |

## Data Model

### Apps Table

| Column | Type | Description |
|--------|------|-------------|
| id | integer (PK) | Auto-increment ID |
| name | text (required) | App name |
| pricingType | text (enum) | "free" or "paid" |
| subscriptionPlan | text (nullable) | "monthly", "yearly", "one-time" |
| nextDueDate | text (nullable) | ISO date string |
| platforms | text | Comma-separated platform list |
| status | text (enum) | "using", "not_using", "watching", "sunset" |
| notes | text (nullable) | Free-form notes |
| createdAt | integer (timestamp) | Creation timestamp |
| updatedAt | integer (timestamp) | Last update timestamp |

## Current Focus

App Tracker is complete. Potential next improvements:

1. User authentication for multi-user support
2. Export/import functionality
3. Dashboard with subscription cost summary
4. Notification/reminder system for due dates

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-26 | Added App Tracker with Drizzle + SQLite, CRUD API, full UI |
