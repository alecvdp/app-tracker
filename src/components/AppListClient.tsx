"use client";

import { useState, useMemo } from "react";
import { App, AppStatus, STATUS_CONFIG } from "@/lib/types";
import AppCard from "./AppCard";
import AppForm from "./AppForm";

interface AppListClientProps {
  initialApps: App[];
}

export default function AppListClient({ initialApps }: AppListClientProps) {
  const [apps, setApps] = useState<App[]>(initialApps);
  const [filter, setFilter] = useState<AppStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);

  const filteredApps = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return apps.filter((app) => {
      const matchesFilter = filter === "all" || app.status === filter;
      const matchesSearch =
        search === "" ||
        app.name.toLowerCase().includes(lowerSearch) ||
        (app.notes?.toLowerCase().includes(lowerSearch) ?? false);
      return matchesFilter && matchesSearch;
    });
  }, [apps, filter, search]);

  const statusCounts = useMemo(() => {
    return apps.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<AppStatus, number>
    );
  }, [apps]);

  async function refreshApps() {
    try {
      const res = await fetch("/api/apps");
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      }
    } catch (err) {
      console.error("Failed to refresh apps:", err);
    }
  }

  function handleEdit(app: App) {
    setEditingApp(app);
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/apps/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApps((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete app:", err);
    }
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingApp(null);
  }

  function handleSaved() {
    handleFormClose();
    refreshApps();
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">App Tracker</h1>
            <p className="text-neutral-400 mt-1">
              Track your apps and subscriptions
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add App
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search apps..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                filter === "all"
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              All ({apps.length})
            </button>
            {(Object.keys(STATUS_CONFIG) as AppStatus[]).map((status) => {
              const config = STATUS_CONFIG[status];
              const count = statusCounts[status] || 0;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    filter === status
                      ? `${config.bg} ${config.color}`
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-neutral-600 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <p className="text-neutral-400 text-sm">
              {apps.length === 0
                ? "No apps yet. Add your first app to get started."
                : "No apps match your filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {showForm && (
          <AppForm
            app={editingApp}
            onClose={handleFormClose}
            onSaved={handleSaved}
          />
        )}
      </div>
    </div>
  );
}
