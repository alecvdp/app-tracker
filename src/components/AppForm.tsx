"use client";

import { useState, useEffect } from "react";
import {
  App,
  AppStatus,
  PricingType,
  ALL_PLATFORMS,
  STATUS_CONFIG,
  SUBSCRIPTION_PLANS,
} from "@/lib/types";

interface AppFormProps {
  app?: App | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AppForm({ app, onClose, onSaved }: AppFormProps) {
  const [name, setName] = useState(app?.name || "");
  const [pricingType, setPricingType] = useState<PricingType>(
    app?.pricingType || "free"
  );
  const [subscriptionPlan, setSubscriptionPlan] = useState(
    app?.subscriptionPlan || ""
  );
  const [nextDueDate, setNextDueDate] = useState(app?.nextDueDate || "");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    app?.platforms ? app.platforms.split(",") : []
  );
  const [status, setStatus] = useState<AppStatus>(app?.status || "using");
  const [notes, setNotes] = useState(app?.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function togglePlatform(platform: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("App name is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        pricingType,
        subscriptionPlan: pricingType === "paid" ? subscriptionPlan : null,
        nextDueDate: pricingType === "paid" && nextDueDate ? nextDueDate : null,
        platforms: selectedPlatforms.join(","),
        status,
        notes: notes.trim() || null,
      };

      const url = app ? `/api/apps/${app.id}` : "/api/apps";
      const method = app ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save app");
      }

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save app");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              {app ? "Edit App" : "Add New App"}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
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

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                App Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Netflix, Spotify"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Pricing
              </label>
              <div className="flex gap-3">
                {(["free", "paid"] as PricingType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPricingType(type)}
                    className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      pricingType === type
                        ? type === "free"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {type === "free" ? "Free" : "Paid"}
                  </button>
                ))}
              </div>
            </div>

            {pricingType === "paid" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                    Subscription Plan
                  </label>
                  <select
                    value={subscriptionPlan}
                    onChange={(e) => setSubscriptionPlan(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {SUBSCRIPTION_PLANS.map((plan) => (
                      <option key={plan.value} value={plan.value}>
                        {plan.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_PLATFORMS.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      selectedPlatforms.includes(platform)
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(STATUS_CONFIG) as AppStatus[]).map((s) => {
                  const config = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        status === s
                          ? `${config.bg} ${config.color} border-current/20`
                          : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Optional notes about this app..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {saving ? "Saving..." : app ? "Update App" : "Add App"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
