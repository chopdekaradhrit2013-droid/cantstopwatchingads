"use client";
import Link from "next/link";
import { createContext, useCallback, useContext, useState } from "react";
import { useStore } from "@/lib/store";

const Ctx = createContext<(action?: string) => boolean>(() => true);

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("continue");
  const guard = useCallback((next = "continue") => {
    if (user) return true;
    setAction(next);
    setOpen(true);
    return false;
  }, [user]);
  return (
    <Ctx.Provider value={guard}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/35 backdrop-blur-md" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl border border-white/40 bg-white/25 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-700">Account needed</p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-950">Sign in to {action}</h2>
            <p className="mt-2 text-sm text-neutral-700">Create an account or log in to like, save, and follow brands.</p>
            <div className="mt-6 flex flex-col gap-2">
              <Link href="/login" className="rounded-full bg-neutral-950/90 px-4 py-2.5 text-sm text-white backdrop-blur">Log in</Link>
              <Link href="/signup" className="rounded-full border border-white/50 bg-white/40 px-4 py-2.5 text-sm text-neutral-950 backdrop-blur">Sign up</Link>
              <button type="button" onClick={() => setOpen(false)} className="pt-1 text-sm text-neutral-600">Not now</button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useAuthGate() {
  return useContext(Ctx);
}
