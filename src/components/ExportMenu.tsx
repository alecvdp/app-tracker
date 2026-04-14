"use client";

import { useState } from "react";
import { App } from "@/lib/types";

interface ExportMenuProps {
  apps: App[];
}

function exportToCSV(apps: App[]): string {
  const headers = [
    "Name",
    "Pricing Type",
    "Subscription Plan",
    "Monthly Cost",
    "Yearly Cost",
    "Next Due Date",
    "Platforms",
    "Category",
    "Tags",
    "Release Date",
    "Status",
    "Notes",
  ];

  const rows = apps.map((app) => [
    app.name,
    app.pricingType,
    app.subscriptionPlan || "",
    app.monthlyCost?.toString() || "",
    app.yearlyCost?.toString() || "",
    app.nextDueDate || "",
    app.platforms,
    app.category || "",
    app.tags,
    app.releaseDate || "",
    app.status,
    (app.notes || "").replace(/"/g, '""'),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell}"`).join(",")
    ),
  ].join("\n");

  return csvContent;
}

function exportToMarkdown(apps: App[]): string {
  const grouped = apps.reduce(
    (acc, app) => {
      const status = app.status || "using";
      if (!acc[status]) acc[status] = [];
      acc[status].push(app);
      return acc;
    },
    {} as Record<string, App[]>
  );

  const statusLabels: Record<string, string> = {
    using: "Currently Using",
    not_using: "Not Using",
    watching: "Watching",
    sunset: "Sunset",
  };

  let md = "# App Tracker\n\n";
  md += `*Exported on ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}*\n\n`;
  md += `**Total Apps:** ${apps.length}\n\n`;

  // Summary
  const paidApps = apps.filter((a) => a.pricingType === "paid");
  const monthlyTotal = paidApps.reduce((sum, app) => {
    if (app.monthlyCost) return sum + app.monthlyCost;
    if (app.yearlyCost) return sum + app.yearlyCost / 12;
    return sum;
  }, 0);

  md += `**Monthly Cost:** $${monthlyTotal.toFixed(2)}\n\n`;
  md += "---\n\n";

  // Grouped by status
  for (const [status, statusApps] of Object.entries(grouped)) {
    md += `## ${statusLabels[status] || status} (${statusApps.length})\n\n`;

    for (const app of statusApps) {
      md += `### ${app.name}\n\n`;

      const details: string[] = [];
      details.push(`- **Pricing:** ${app.pricingType}`);
      if (app.pricingType === "paid") {
        if (app.subscriptionPlan) details.push(`- **Plan:** ${app.subscriptionPlan}`);
        if (app.monthlyCost) details.push(`- **Monthly:** $${app.monthlyCost.toFixed(2)}`);
        if (app.yearlyCost) details.push(`- **Yearly:** $${app.yearlyCost.toFixed(2)}`);
        if (app.nextDueDate) details.push(`- **Due:** ${app.nextDueDate}`);
      }
      if (app.category) details.push(`- **Category:** ${app.category}`);
      if (app.platforms) details.push(`- **Platforms:** ${app.platforms}`);
      if (app.tags) details.push(`- **Tags:** ${app.tags}`);
      if (app.releaseDate) details.push(`- **Releases:** ${app.releaseDate}`);
      if (app.notes) details.push(`- **Notes:** ${app.notes}`);

      md += details.join("\n") + "\n\n";
    }
  }

  return md;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ExportMenu({ apps }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  function handleExportCSV() {
    const csv = exportToCSV(apps);
    const filename = `app-tracker-${new Date().toISOString().split("T")[0]}.csv`;
    downloadFile(csv, filename, "text/csv");
    setIsOpen(false);
  }

  function handleExportMarkdown() {
    const md = exportToMarkdown(apps);
    const filename = `app-tracker-${new Date().toISOString().split("T")[0]}.md`;
    downloadFile(md, filename, "text/markdown");
    setIsOpen(false);
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError("");
    setImportSuccess("");

    try {
      const text = await file.text();
      const lines = text.split("\n").filter((l) => l.trim());
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

      // Validate headers
      const requiredHeaders = ["Name", "Pricing Type"];
      const hasRequired = requiredHeaders.every((h) =>
        headers.some((header) => header.toLowerCase().includes(h.toLowerCase()))
      );

      if (!hasRequired) {
        setImportError("Invalid CSV format. Missing required headers.");
        setImporting(false);
        return;
      }

      const importedApps: Partial<App>[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < headers.length) continue;

        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });

        if (!row["Name"]) {
          errors.push(`Row ${i + 1}: Missing app name`);
          continue;
        }

        importedApps.push({
          name: row["Name"],
          pricingType: (row["Pricing Type"] || "free").toLowerCase() as "free" | "paid",
          subscriptionPlan: row["Subscription Plan"] || null,
          monthlyCost: row["Monthly Cost"] ? parseFloat(row["Monthly Cost"]) : null,
          yearlyCost: row["Yearly Cost"] ? parseFloat(row["Yearly Cost"]) : null,
          nextDueDate: row["Next Due Date"] || null,
          platforms: row["Platforms"] || "",
          category: row["Category"] || null,
          tags: row["Tags"] || "",
          releaseDate: row["Release Date"] || null,
          status: (row["Status"] || "using") as App["status"],
          notes: row["Notes"] || null,
        });
      }

      if (errors.length > 0) {
        setImportError(`Imported with warnings:\n${errors.slice(0, 3).join("\n")}${errors.length > 3 ? "\n..." : ""}`);
      }

      // Send to API
      let successCount = 0;
      for (const app of importedApps) {
        try {
          const res = await fetch("/api/apps", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(app),
          });
          if (res.ok) successCount++;
        } catch {
          // Skip failed imports
        }
      }

      setImportSuccess(`Successfully imported ${successCount} of ${importedApps.length} apps`);

      // Refresh page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      setImportError("Failed to parse CSV file");
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0;i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

export { exportToCSV, exportToMarkdown };
