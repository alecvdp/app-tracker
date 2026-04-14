import { NextResponse } from "next/server";
import { db } from "@/db";
import { apps } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allApps = await db.select().from(apps).orderBy(desc(apps.updatedAt));
    return NextResponse.json(allApps);
  } catch (error) {
    console.error("Failed to fetch apps:", error);
    return NextResponse.json(
      { error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      pricingType,
      subscriptionPlan,
      nextDueDate,
      platforms,
      status,
      notes,
    } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "App name is required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const [newApp] = await db
      .insert(apps)
      .values({
        name,
        pricingType: pricingType || "free",
        subscriptionPlan: subscriptionPlan || null,
        nextDueDate: nextDueDate || null,
        platforms: Array.isArray(platforms) ? platforms.join(",") : platforms || "",
        status: status || "using",
        notes: notes || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newApp, { status: 201 });
  } catch (error) {
    console.error("Failed to create app:", error);
    return NextResponse.json(
      { error: "Failed to create app" },
      { status: 500 }
    );
  }
}
