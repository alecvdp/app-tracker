"use client";

import { useState, useMemo } from "react";
import { App, AppStatus, STATUS_CONFIG, CATEGORY_OPTIONS } from "@/lib/types";
import AppCard from "./AppCard";
import AppForm from "./AppForm";
import ThemeSwitcher from "./ThemeSwitcher";
import Dashboard from "./Dashboard";
import ExportMenu from "./ExportMenu";
import TodoistSettings from "./TodoistSettings";

interface AppListClientProps {
  initialApps: App[];
}

export default function AppListClient({ initialApps }: AppListClientProps) {
  const [apps, setApps] = useState<App[]>(initialApps);
  const [filter, setFilter] = useState<AppStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showTodoist, setShowTodoist] = useState(false);

  // Get all unique tags from apps
  const allTags = useMemo(
    () =>
      Array.from(
        new Set(
          apps.flatMap((app) =>
            app.tags ? app.tags.split(",").filter(Boolean) : []
          )
        )
      ).sort(),
    [apps]
  );

  const filteredApps = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return apps.filter((app) => {
      const matchesFilter = filter === "all" || app.status === filter;
      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "none" && !app.category) ||
        app.category === categoryFilter;
      const matchesTag =
        !tagFilter ||
        (app.tags &&
          app.tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .includes(tagFilter.toLowerCase()));
      const matchesSearch =
        !search ||
        app.name.toLowerCase().includes(lowerSearch) ||
        (app.notes?.toLowerCase().includes(lowerSearch) ?? false) ||
        (app.category?.toLowerCase().includes(lowerSearch) ?? false);
      return matchesFilter && matchesCategory && matchesTag && matchesSearch;
    });
  }, [apps, filter, categoryFilter, tagFilter, search]);

  const statusCounts = useMemo(
    () =>
      apps.reduce(
        (acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        },
        {} as Record<AppStatus, number>
      ),
    [apps]
  );

  const categoryCounts = useMemo(
    () =>
      apps.reduce(
        (acc, app) => {
          const cat = app.category || "none";
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    [apps]
  );

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
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">App Tracker</h1>
            <p className="text-neutral-400 mt-1">
              Track your apps and subscriptions
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              title="Toggle Dashboard"
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
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <ExportMenu apps={apps} />
            <button
              onClick={() => setShowTodoist(true)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              title="Todoist Integration"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="hidden sm:inline">Reminders</span>
            </button>
            <ThemeSwitcher />
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
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
              <span className="hidden sm:inline">Add App</span>
            </button>
          </div>
        </div>

        {/* Dashboard */}
        {showDashboard && <Dashboard apps={apps} />}

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-sm">
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

        {/* Filters */}
        <div className="space-y-3 mb-6">
          {/* Status Filters */}
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

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                categoryFilter === "all"
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              All Categories
            </button>
            {CATEGORY_OPTIONS.map((cat) => {
              const count = categoryCounts[cat.value] || 0;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    categoryFilter === cat.value
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
            {(categoryCounts["none"] || 0) > 0 && (
              <button
                onClick={() => setCategoryFilter("none")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  categoryFilter === "none"
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                Uncategorized ({categoryCounts["none"]})
              </button>
            )}
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-neutral-500 mr-1">Tags:</span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tagFilter === tag ? "" : tag)}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                    tagFilter === tag
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  #{tag}
                </button>
              ))}
              {tagFilter && (
                <button
                  onClick={() => setTagFilter("")}
                  className="px-2 py-1 rounded text-xs text-neutral-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        {(filter !== "all" || categoryFilter !== "all" || tagFilter || search) && (
          <p className="text-sm text-neutral-500 mb-4">
            Showing {filteredApps.length} of {apps.length} apps
          </p>
        )}

        {/* App Grid */}
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
                : "No apps match your filters."}
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

        {showTodoist && (
          <TodoistSettings
            onClose={() => setShowTodoist(false)}
            onSave={() => setShowTodoist(false)}
          />
        )}
      </div>
    </div>
  );
}
