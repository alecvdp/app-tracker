import { NextResponse } from "next/server";
import { db } from "@/db";
import { apps } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const app = await db
      .select()
      .from(apps)
      .where(eq(apps.id, parseInt(id)));

    if (app.length === 0) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json(app[0]);
  } catch (error) {
    console.error("Failed to fetch app:", error);
    return NextResponse.json(
      { error: "Failed to fetch app" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const [updatedApp] = await db
      .update(apps)
      .set({
        name,
        pricingType,
        subscriptionPlan: subscriptionPlan || null,
        nextDueDate: nextDueDate || null,
        platforms: Array.isArray(platforms) ? platforms.join(",") : platforms || "",
        status,
        notes: notes || null,
        updatedAt: now,
      })
      .where(eq(apps.id, parseInt(id)))
      .returning();

    if (!updatedApp) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json(updatedApp);
  } catch (error) {
    console.error("Failed to update app:", error);
    return NextResponse.json(
      { error: "Failed to update app" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deletedApp] = await db
      .delete(apps)
      .where(eq(apps.id, parseInt(id)))
      .returning();

    if (!deletedApp) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "App deleted successfully" });
  } catch (error) {
    console.error("Failed to delete app:", error);
    return NextResponse.json(
      { error: "Failed to delete app" },
      { status: 500 }
    );
  }
}
