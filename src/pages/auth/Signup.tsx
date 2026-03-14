import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError(""); setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">SF</div>
          <span className="font-semibold text-foreground">StockFlow</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Create account</h1>
          <p className="text-sm text-muted-foreground">Get started with StockFlow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", type: "text", value: name, set: setName, placeholder: "Alex Morgan" },
            { label: "Work Email", type: "email", value: email, set: setEmail, placeholder: "alex@company.com" },
            { label: "Password", type: "password", value: password, set: setPassword, placeholder: "8+ characters" },
          ].map(({ label, type, value, set, placeholder }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
              <input
                type={type} value={value} onChange={(e) => set(e.target.value)}
                placeholder={placeholder} required
                className="h-9 w-full rounded border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          ))}

          {error && <p className="text-sm text-danger bg-danger-bg border border-danger/20 rounded px-3 py-2">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="flex h-9 w-full items-center justify-center gap-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
