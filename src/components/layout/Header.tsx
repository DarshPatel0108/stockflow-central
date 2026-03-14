import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-border bg-card px-4 gap-4 shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search products, documents…"
          className="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
            <ChevronDown size={12} className="text-muted-foreground hidden sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 w-44 rounded border border-border bg-card shadow-dropdown animate-fade-in">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <User size={13} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-bg transition-colors rounded-b"
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
