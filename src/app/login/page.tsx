"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Stepper, { Step } from "@/components/Stepper";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { login, user } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (user) return <p className="text-sm">Signed in as {user.name}. <Link href="/" className="underline">Home</Link></p>;
  return (
    <div className="mx-auto max-w-md">
      <p className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-white/40">Welcome back</p>
      <Stepper onFinalStepCompleted={() => {
        const ok = login(email.trim(), password);
        if (!ok) { setError("No matching account. Sign up first."); return; }
        router.push("/");
      }}>
        <Step>
          <h2 className="text-xl font-semibold">Your email</h2>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="mt-4 w-full rounded-xl border border-black/10 px-3 py-2" />
        </Step>
        <Step>
          <h2 className="text-xl font-semibold">Password</h2>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-4 w-full rounded-xl border border-black/10 px-3 py-2" />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </Step>
      </Stepper>
      <p className="mt-4 text-center text-sm text-white/50">New here? <Link href="/signup" className="underline">Create an account</Link></p>
    </div>
  );
}
