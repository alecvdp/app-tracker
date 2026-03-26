"use client";

import { App, STATUS_CONFIG } from "@/lib/types";

interface AppCardProps {
  app: App;
  onEdit: (app: App) => void;
  onDelete: (id: number) => void;
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const due = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AppCard({ app, onEdit, onDelete }: AppCardProps) {
  const statusConfig = STATUS_CONFIG[app.status];
  const platforms = app.platforms ? app.platforms.split(",") : [];
  const dueDays = daysUntil(app.nextDueDate);

  function handleDelete() {
    if (window.confirm(`Delete "${app.name}"? This cannot be undone.`)) {
      onDelete(app.id);
    }
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{app.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${statusConfig.bg} ${statusConfig.color}`}
            >
              {statusConfig.label}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                app.pricingType === "free"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-400"
              }`}
            >
              {app.pricingType === "free" ? "Free" : "Paid"}
            </span>
            {app.subscriptionPlan && (
              <span className="text-xs text-neutral-500 capitalize">
                {app.subscriptionPlan}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(app)}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title="Edit"
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
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete"
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
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {platforms.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {platforms.map((platform) => (
            <span
              key={platform}
              className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400"
            >
              {platform}
            </span>
          ))}
        </div>
      )}

      {app.nextDueDate && (
        <div className="flex items-center gap-2 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-500"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span
            className={`${
              dueDays !== null && dueDays < 0
                ? "text-red-400"
                : dueDays !== null && dueDays <= 7
                ? "text-amber-400"
                : "text-neutral-400"
            }`}
          >
            {formatDate(app.nextDueDate)}
            {dueDays !== null && (
              <span className="ml-1.5 text-xs">
                (
                {dueDays < 0
                  ? `${Math.abs(dueDays)}d overdue`
                  : dueDays === 0
                  ? "today"
                  : `in ${dueDays}d`}
                )
              </span>
            )}
          </span>
        </div>
      )}

      {app.notes && (
        <p className="mt-3 text-sm text-neutral-500 line-clamp-2">{app.notes}</p>
      )}
    </div>
  );
}
