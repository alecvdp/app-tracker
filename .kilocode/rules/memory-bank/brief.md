# Project Brief: App Tracker

## Purpose

A personal app and subscription tracking web app. Users can enter apps with properties that detail pricing type (free/paid), subscription plan, next due date, platforms, and usage status.

## Target Users

- Individual users managing their app subscriptions
- Users tracking which apps they actively use, are watching, or have sunset

## Core Use Case

Users track their apps through a web interface:
1. Add apps with name, pricing type, subscription plan, due dates, and platforms
2. Manage app status (using, not using, watching, sunset)
3. Filter and search through their app list
4. Edit or delete existing apps

## Key Requirements

### Must Have

- Modern Next.js 16 setup with App Router
- TypeScript for type safety
- Tailwind CSS 4 for styling
- ESLint for code quality
- Bun as package manager
- SQLite database for persistence
- CRUD operations for apps
- Status tracking: using, not using, watching, sunset
- Platform tracking: iOS, Android, Web, macOS, Windows, Linux
- Subscription plan tracking with due date reminders
- Search and filter functionality

### Nice to Have

- Export/import functionality
- Dashboard with subscription cost summary
- Notification system for due dates
- Multi-user authentication

## Success Metrics

- Clean, zero-error TypeScript setup
- Passing lint and type checks
- Full CRUD functionality with responsive UI

## Constraints

- Framework: Next.js 16 + React 19 + Tailwind CSS 4
- Database: Drizzle ORM + SQLite
- Package manager: Bun
