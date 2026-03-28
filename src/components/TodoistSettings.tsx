"use client";

import { useState, useEffect } from "react";
import { App } from "@/lib/types";

const STORAGE_KEY = "app-tracker-todoist-token";

interface TodoistSettingsProps {
  onClose: () => void;
  onSave: () => void;
}

export default function TodoistSettings({ onClose, onSave }: TodoistSettingsProps) {
  const [apiToken, setApiToken] = useState("");
  const [savedToken, setSavedToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedToken(stored);
      setConnected(true);
    }
  }, []);

  async function handleConnect() {
    if (!apiToken.trim()) {
      setError("Please enter your Todoist API token");
      return;
    }

    setConnecting(true);
    setError("");

    try {
      const res = await fetch("https://api.todoist.com/rest/v2/projects", {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Invalid API token");
      }

      localStorage.setItem(STORAGE_KEY, apiToken);
      setSavedToken(apiToken);
      setConnected(true);
      setApiToken("");
      onSave();
    } catch {
      setError("Failed to connect. Please check your API token.");
    } finally {
      setConnecting(false);
    }
  }

  function handleDisconnect() {
    localStorage.removeItem(STORAGE_KEY);
    setSavedToken("");
    setConnected(false);
    onSave();
  }

  async function handleSync(apps: App[]) {
    if (!savedToken) return;

    setSyncing(true);
    setSyncResult("");

    const upcomingApps = apps.filter(
      (app) =>
        app.nextDueDate &&
        app.pricingType === "paid" &&
        new Date(app.nextDueDate) >= new Date()
    );

    try {
      const dueDate = upcomingApps[0]?.nextDueDate;
      if (!dueDate) {
        setSyncResult("No upcoming renewals to sync");
        return;
      }

      // Create a task in Todoist
      const taskNames = upcomingApps
        .slice(0, 5)
        .map((app) => `${app.name} renewal`)
        .join(", ");

      const res = await fetch("https://api.todoist.com/rest/v2/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${savedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `Subscription Renewals: ${taskNames}`,
          due_date: dueDate,
          priority: 4,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      setSyncResult(`Created reminder for ${upcomingApps.length} upcoming renewal(s)`);
    } catch {
      setSyncResult("Failed to sync with Todoist");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="rounded-xl w-full max-w-md mx-4 overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
          border: "1px solid",
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Todoist Integration
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded hover:opacity-70 transition-opacity"
              style={{ color: "var(--text-muted)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {!connected ? (
            <>
              <div>
                <p
                  className="text-sm mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Connect your Todoist account to create reminders for upcoming
                  subscription renewals.
                </p>
                <p
                  className="text-xs mb-4"
                  style={{ color: "var(--text-faint)" }}
                >
                  Get your API token from{" "}
                  <a
                    href="https://app.todoist.com/app/settings/integrations/developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "var(--accent-tertiary)" }}
                  >
                    Todoist Settings
                  </a>
                </p>
              </div>

              {error && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgba(230, 69, 83, 0.1)",
                    color: "#E64553",
                  }}
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  API Token
                </label>
                <input
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  placeholder="Enter your Todoist API token"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                {connecting ? "Connecting..." : "Connect to Todoist"}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                <div
className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--accent-secondary)" }}
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
                    style={{ color: "var(--bg-primary)" }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Connected to Todoist
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {savedToken.slice(0, 8)}...
                  </p>
                </div>
              </div>

              {syncResult && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgba(64, 160, 43, 0.1)",
                    color: "var(--accent-secondary)",
                  }}
                >
                  {syncResult}
                </div>
              )}

              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Create reminders for upcoming subscription renewals in your
                Todoist task list.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSync([])}
                  disabled={syncing}
                  className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--accent-secondary)",
                    color: "var(--bg-primary)",
                  }}
                >
                  {syncing ? "Syncing..." : "Create Reminders"}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="py-2.5 px-4 rounded-lg font-medium text-sm transition-colors border"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                >
                  Disconnect
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Export the sync function for use in the main app
export async function syncWithTodoist(apps: App[]): Promise<{ success: boolean; message: string }> {
  const apiToken = localStorage.getItem(STORAGE_KEY);
  if (!apiToken) {
    return { success: false, message: "Todoist not connected" };
  }

  const upcomingApps = apps
    .filter(
      (app) =>
        app.nextDueDate &&
        app.pricingType === "paid" &&
        new Date(app.nextDueDate) >= new Date()
    )
    .sort((a, b) => {
      return (
        new Date(a.nextDueDate!).getTime() -
        new Date(b.nextDueDate!).getTime()
      );
    });

  if (upcomingApps.length === 0) {
    return { success: true, message: "No upcoming renewals" };
  }

  try {
    const taskNames = upcomingApps
      .slice(0, 5)
      .map((app) => `${app.name}${app.monthlyCost ? ` ($${app.monthlyCost}/mo)` : app.yearlyCost ? ` ($${app.yearlyCost}/yr)` : ""}`)
      .join(", ");

    const res = await fetch("https://api.todoist.com/rest/v2/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `Subscription Renewals: ${taskNames}`,
        due_date: upcomingApps[0].nextDueDate,
        priority: 4,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create task");
    }

    return {
      success: true,
      message: `Created reminder for ${upcomingApps.length} upcoming renewal(s)`,
    };
  } catch {
    return { success: false, message: "Failed to sync with Todoist" };
  }
}
