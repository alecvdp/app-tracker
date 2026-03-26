# System Patterns: App Tracker

## Architecture Overview

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Home page (server component, fetches apps)
│   ├── globals.css         # Tailwind imports + global styles
│   ├── favicon.ico         # Site icon
│   └── api/                # API routes
│       └── apps/
│           ├── route.ts         # GET (list) / POST (create)
│           └── [id]/
│               └── route.ts     # GET / PUT / DELETE by ID
├── components/             # React components
│   ├── AppListClient.tsx   # Main list with filtering (client)
│   ├── AppCard.tsx         # App display card (client)
│   └── AppForm.tsx         # Add/edit modal form (client)
├── db/                     # Database layer
│   ├── schema.ts           # Drizzle schema (apps table)
│   ├── index.ts            # Database client
│   ├── migrate.ts          # Migration runner
│   └── migrations/         # Generated SQL migrations
└── lib/                    # Utilities
    └── types.ts            # Shared types, constants, configs
```

## Key Design Patterns

### 1. App Router Pattern

Uses Next.js App Router with file-based routing:
```
src/app/
├── page.tsx           # Route: / (main dashboard)
└── api/
    └── apps/
        ├── route.ts       # API: /api/apps
        └── [id]/
            └── route.ts   # API: /api/apps/:id
```

### 2. Server/Client Component Split

- `page.tsx` is a **Server Component** that fetches initial data from the database
- `AppListClient.tsx` is a **Client Component** that manages state and interactivity
- `AppCard.tsx` and `AppForm.tsx` are **Client Components** for UI interactions

### 3. API Route Pattern

All API routes follow RESTful conventions:
- `GET /api/apps` - List all apps (ordered by updated_at desc)
- `POST /api/apps` - Create a new app
- `GET /api/apps/:id` - Get a single app
- `PUT /api/apps/:id` - Update an app
- `DELETE /api/apps/:id` - Delete an app

### 4. Database Pattern

- Drizzle ORM with SQLite via `@kilocode/app-builder-db`
- Schema defined in `src/db/schema.ts`
- Migrations auto-generated with `drizzle-kit`
- Database operations in Server Components and API routes only

## Styling Conventions

### Tailwind CSS Usage
- Dark theme with neutral palette (neutral-950, neutral-900, neutral-800, etc.)
- Status-specific colors: emerald (using/watching), blue (paid), amber (due soon), red (overdue/sunset)
- Utility classes directly on elements
- Responsive: `sm:`, `md:`, `lg:`, `xl:`

### Component Styling Pattern
```tsx
// Status badge with dynamic colors
<span className={`${statusConfig.bg} ${statusConfig.color}`}>
  {statusConfig.label}
</span>

// Card with hover effect
<div className="bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors">
```

## File Naming Conventions

- Components: PascalCase (`AppCard.tsx`, `AppForm.tsx`)
- Utilities: camelCase (`types.ts`)
- Pages/Routes: lowercase (`page.tsx`, `layout.tsx`, `route.ts`)
- Directories: kebab-case (`api/apps/[id]`)

## State Management

- `useState` for local component state (form fields, filters, search)
- Server Components for initial data fetching (database)
- Client-side fetching for CRUD operations via `fetch('/api/apps')`
