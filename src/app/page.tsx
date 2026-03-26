import { db } from "@/db";
import { apps } from "@/db/schema";
import { desc } from "drizzle-orm";
import { App } from "@/lib/types";
import AppListClient from "@/components/AppListClient";

export default async function Home() {
  let initialApps: App[] = [];
  try {
    const rows = await db.select().from(apps).orderBy(desc(apps.updatedAt));
    initialApps = rows as App[];
  } catch {
    initialApps = [];
  }

  return <AppListClient initialApps={initialApps} />;
}
