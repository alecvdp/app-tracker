"use client";

import { useMemo } from "react";
import { App, STATUS_CONFIG, CATEGORY_OPTIONS } from "@/lib/types";

interface DashboardProps {
  apps: App[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysUntil(dateStr: string): number {
  const due = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Dashboard({ apps }: DashboardProps) {
  const stats = useMemo(() => {
    const paidApps = apps.filter((a) => a.pricingType === "paid" && a.status === "using");

    // Calculate monthly cost (convert yearly to monthly equivalent)
    const monthlyTotal = paidApps.reduce((sum, app) => {
      if (app.monthlyCost) {
        return sum + app.monthlyCost;
      }
      if (app.yearlyCost) {
        return sum + app.yearlyCost / 12;
      }
      return sum;
    }, 0);

    // Calculate yearly cost
    const yearlyTotal = paidApps.reduce((sum, app) => {
      if (app.yearlyCost) {
        return sum + app.yearlyCost;
      }
      if (app.monthlyCost) {
        return sum + app.monthlyCost * 12;
      }
      return sum;
    }, 0);

    // Status breakdown
    const statusCounts = apps.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Category breakdown
    const categoryCounts = apps.reduce(
      (acc, app) => {
        const cat = app.category || "uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Upcoming renewals (next 30 days)
    const upcomingRenewals = apps
      .filter(
        (app) =>
          app.nextDueDate &&
          daysUntil(app.nextDueDate) >= 0 &&
          daysUntil(app.nextDueDate) <= 30
      )
      .sort((a, b) => {
        const aDays = a.nextDueDate ? daysUntil(a.nextDueDate) : 999;
        const bDays = b.nextDueDate ? daysUntil(b.nextDueDate) : 999;
        return aDays - bDays;
      });

    // Category spending
    const categorySpending = CATEGORY_OPTIONS.map((cat) => {
      const catApps = paidApps.filter((a) => a.category === cat.value);
      const monthly = catApps.reduce((sum, app) => {
        if (app.monthlyCost) return sum + app.monthlyCost;
        if (app.yearlyCost) return sum + app.yearlyCost / 12;
        return sum;
      }, 0);
      return { ...cat, monthly, count: catApps.length };
    }).filter((c) => c.count > 0);

    return {
      totalApps: apps.length,
      paidApps: paidApps.length,
      freeApps: apps.length - paidApps.length,
      monthlyTotal,
      yearlyTotal,
      statusCounts,
      categoryCounts,
      upcomingRenewals,
      categorySpending,
    };
  }, [apps]);

  return (
    <div className="mb-8 space-y-6">
      {/* Spending Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Spending */}
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Monthly Cost
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--accent-primary)" }}
          >
            {formatCurrency(stats.monthlyTotal)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
            {stats.paidApps} paid apps
          </p>
        </div>

        {/* Yearly Spending */}
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Yearly Cost
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--accent-secondary)" }}
          >
            {formatCurrency(stats.yearlyTotal)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
            {stats.freeApps} free apps
          </p>
        </div>

        {/* Total Apps */}
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Total Apps
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {stats.totalApps}
          </p>
          <div className="flex gap-3 mt-1 text-xs" style={{ color: "var(--text-faint)" }}>
            <span>{stats.statusCounts.using || 0} using</span>
            <span>•</span>
            <span>{stats.statusCounts.watching || 0} watching</span>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Renewals */}
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Upcoming Renewals
          </h3>
          {stats.upcomingRenewals.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              No renewals in the next 30 days
            </p>
          ) : (
            <div className="space-y-3">
              {stats.upcomingRenewals.slice(0, 5).map((app) => {
                const days = app.nextDueDate ? daysUntil(app.nextDueDate) : 0;
                return (
                  <div
                    key={app.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {app.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {app.nextDueDate && formatDate(app.nextDueDate)}
                        {app.subscriptionPlan && ` • ${app.subscriptionPlan}`}
                      </p>
                    </div>
<div className="text-right">
                      <p
                        className="text-sm font-medium"
                        style={{
                          color:
                            days <= 3
                              ? "#E64553"
                              : days <= 7
                              ? "var(--accent-primary)"
                              : "var(--text-primary)",
                        }}
                      >
                        {days === 0
                          ? "Today"
                          : days === 1
                          ? "Tomorrow"
                          : `in ${days} days`}
                      </p>
                      {(app.monthlyCost || app.yearlyCost) && (
                        <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                          {app.monthlyCost
                            ? formatCurrency(app.monthlyCost)
                            : formatCurrency(app.yearlyCost || 0)}
                          {app.monthlyCost ? "/mo" : "/yr"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Spending by Category
          </h3>
          {stats.categorySpending.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              No spending to categorize yet
            </p>
          ) : (
            <div className="space-y-3">
              {stats.categorySpending.map((cat) => (
                <div key={cat.value}>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {cat.label}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {formatCurrency(cat.monthly)}/mo
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--bg-tertiary)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${
                          stats.monthlyTotal > 0
                            ? (cat.monthly / stats.monthlyTotal) * 100
                            : 0
                        }%`,
                        backgroundColor: "var(--accent-tertiary)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div
        className="rounded-xl p-5 border"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Status Overview
        </h3>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(STATUS_CONFIG) as (keyof typeof STATUS_CONFIG)[]).map(
            (status) => {
              const config = STATUS_CONFIG[status];
              const count = stats.statusCounts[status] || 0;
              return (
                <div
                  key={status}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      status === "using"
                        ? "bg-emerald-400"
                        : status === "not_using"
                        ? "bg-neutral-400"
                        : status === "watching"
                        ? "bg-amber-400"
                        : "bg-red-400"
                    }`}
                    style={
                      status === "using"
                        ? { backgroundColor: "var(--accent-secondary)" }
                        : undefined
                    }
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {config.label}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {count}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
