"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Stepper, { Step } from "@/components/Stepper";
import { CATEGORIES, type Category } from "@/lib/types";
import { useStore } from "@/lib/store";

export default function SignupPage() {
  const { signup, user } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState<Category[]>([]);
  if (user) return <p className="text-sm">Already signed in as {user.name}. <Link href="/profile" className="underline">Profile</Link></p>;
  return (
    <div className="mx-auto max-w-md">
      <p className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-white/40">Create your seat</p>
      <Stepper onFinalStepCompleted={() => {
        if (!name.trim() || !email.trim()) return;
        signup(name.trim(), email.trim(), password, interests);
        router.push("/");
      }}>
        <Step>
          <h2 className="text-xl font-semibold">Who are you?</h2>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mt-4 w-full rounded-xl border border-black/10 px-3 py-2" />
        </Step>
        <Step>
          <h2 className="text-xl font-semibold">How do we reach you?</h2>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mt-3 w-full rounded-xl border border-black/10 px-3 py-2" />
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mt-3 w-full rounded-xl border border-black/10 px-3 py-2" />
        </Step>
        <Step>
          <h2 className="text-xl font-semibold">What do you watch?</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c !== "Other").map((c) => (
              <button key={c} type="button" onClick={() => setInterests((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c])} className={`rounded-full px-3 py-1.5 text-xs ${interests.includes(c) ? "bg-neutral-900 text-white" : "border border-black/15"}`}>{c}</button>
            ))}
          </div>
        </Step>
      </Stepper>
      <p className="mt-4 text-center text-sm text-white/50">Already have an account? <Link href="/login" className="underline">Log in</Link></p>
    </div>
  );
}
