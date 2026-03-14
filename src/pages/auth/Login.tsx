import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@stockflow.com");
  const [password, setPassword] = useState("password");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-sidebar p-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">SF</div>
          <span className="text-sidebar-foreground font-semibold">StockFlow</span>
        </div>
        <div>
          <blockquote className="text-sidebar-foreground/80 text-lg leading-relaxed mb-4">
            "StockFlow replaced three spreadsheets and a whiteboard. Our team has real-time visibility across all warehouses."
          </blockquote>
          <p className="text-sidebar-muted text-sm">— Operations Manager, Apex Steel Co.</p>
        </div>
        <div className="space-y-2">
          {["Real-time inventory tracking", "Multi-warehouse support", "Automated stock alerts"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-1">Sign in</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access StockFlow</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="h-9 w-full rounded border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="h-9 w-full rounded border border-border bg-background px-3 pr-9 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-danger bg-danger-bg border border-danger/20 rounded px-3 py-2">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="flex h-9 w-full items-center justify-center gap-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Create one</Link>
          </p>

          <div className="mt-8 rounded border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <p className="font-medium mb-0.5">Demo credentials</p>
            <p>Email: admin@stockflow.com</p>
            <p>Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
