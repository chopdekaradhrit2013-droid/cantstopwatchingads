"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
export default function LogoutPage() {
  const { logout } = useStore();
  const router = useRouter();
  useEffect(() => {
    logout();
    router.replace("/login");
  }, [logout, router]);
  return <p className="text-sm">Signing out…</p>;
}
