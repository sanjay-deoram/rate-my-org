"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="border-outline-variant/30 text-on-surface-variant hover:text-foreground hover:border-primary flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50"
    >
      <LogOut size={14} />
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
