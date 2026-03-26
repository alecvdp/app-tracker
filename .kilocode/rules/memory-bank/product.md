# Product Context: App Tracker

## Why This App Exists

Managing multiple app subscriptions can be overwhelming. Users subscribe to apps across different platforms (iOS, Android, Web, etc.) and lose track of what they're paying for, when renewals are due, and which apps they still actively use. This app provides a centralized place to track all apps and their subscription details.

## Problems It Solves

1. **Subscription Overload**: Track which apps are free vs. paid and their subscription plans
2. **Due Date Tracking**: Know when subscriptions renew to avoid surprise charges
3. **Platform Awareness**: See which platforms each app is available on
4. **Usage Clarity**: Categorize apps by status (using, not using, watching, sunset)
5. **Organization**: Search and filter through apps quickly

## How It Works (User Flow)

1. User opens the App Tracker dashboard
2. User sees a grid of all their tracked apps with status badges
3. User can filter by status (All, Using, Not Using, Watching, Sunset)
4. User can search by app name or notes
5. User clicks "Add App" to open the form modal
6. User fills in: name, pricing type, subscription plan, due date, platforms, status, notes
7. App appears in the grid with appropriate badges and due date indicators
8. User can edit or delete apps from the card

## Key User Experience Goals

- **Dark Theme**: Comfortable viewing with dark neutral palette
- **At-a-Glance**: Status badges and due date indicators visible on cards
- **Quick Entry**: Modal form for fast app additions
- **Flexible Filtering**: Combine search with status filters
- **Due Date Alerts**: Visual indicators for overdue and upcoming renewals

## Data Model

### App Properties

| Property | Type | Description |
|----------|------|-------------|
| name | text | App name |
| pricingType | enum | "free" or "paid" |
| subscriptionPlan | text (optional) | "monthly", "yearly", "one-time" |
| nextDueDate | date (optional) | Next renewal date |
| platforms | text | Comma-separated platform list |
| status | enum | "using", "not_using", "watching", "sunset" |
| notes | text (optional) | Additional notes |
