import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Shield, Bell, Building } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account information</p>
      </div>

      <div className="rounded border border-border bg-card shadow-card p-5">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
            {user?.name?.charAt(0) ?? "U"}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="badge-primary mt-1 inline-block">{user?.role}</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Full Name", value: user?.name ?? "" },
            { label: "Email Address", value: user?.email ?? "" },
            { label: "Role", value: user?.role ?? "" },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">{label}</label>
              <input defaultValue={value} readOnly
                className="h-9 w-full rounded border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          ))}

          <div className="pt-3">
            <button className="h-8 px-4 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
