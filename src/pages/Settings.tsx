import React from "react";
import { Bell, Globe, Lock, Palette, Database } from "lucide-react";

const sections = [
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Low stock alerts", description: "Notify when stock falls below reorder level", enabled: true },
      { label: "Out of stock alerts", description: "Notify when a product reaches zero stock", enabled: true },
      { label: "Pending document reminders", description: "Remind about open receipts/deliveries", enabled: false },
    ],
  },
  {
    title: "General",
    icon: Globe,
    items: [
      { label: "Currency", description: "USD – US Dollar", enabled: null },
      { label: "Date format", description: "YYYY-MM-DD", enabled: null },
      { label: "Timezone", description: "UTC+0 (London)", enabled: null },
    ],
  },
];

export default function Settings() {
  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure system preferences</p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="rounded border border-border bg-card shadow-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
            <section.icon size={14} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold">{section.title}</h2>
          </div>
          <div className="divide-y divide-border">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                {item.enabled !== null ? (
                  <button
                    className={`relative h-5 w-9 rounded-full transition-colors ${item.enabled ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-card shadow transition-transform ${item.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
