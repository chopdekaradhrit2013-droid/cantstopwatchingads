"use client";
import { useEffect } from "react";
export default function LogoutPage() {
  useEffect(() => {
    try {
      const KEY = "cswa-store-v4";
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        localStorage.setItem(KEY, JSON.stringify({ ...p, user: null }));
      } else {
        localStorage.setItem(KEY, JSON.stringify({ user: null, liked: [], saved: [], followed: [], notifications: [] }));
      }
    } catch {}
    window.location.replace("/login");
  }, []);
  return <p className="text-sm">Signing out…</p>;
}
