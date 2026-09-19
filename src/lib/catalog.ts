const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iugagfjbmdvemuljjeml.supabase.co";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Z2FnZmpibWR2ZW11bGpqZW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MDQ5MTQsImV4cCI6MjEwNTM4MDkxNH0.UlQaaFvZAU8TqjfqBJF0fbcOB6DpsncrPtDvbV6C7Os";

export type RemoteAd = {
  id: string;
  brand_id: string;
  brand_name: string;
  title: string;
  description: string;
  media: string;
  category: string;
  status: string;
  created_at: string;
  views: number;
  likes: number;
  saves: number;
  cta: string;
  destination_url: string;
};

async function rest(path: string, init?: RequestInit) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text ? JSON.parse(text) : [];
}

export async function listPublishedAds() {
  try {
    return (await rest("advertisements?status=eq.published&order=created_at.desc")) as RemoteAd[];
  } catch {
    return [];
  }
}

export async function listRemoteBrands() {
  try {
    return await rest("brands?order=followers.desc");
  } catch {
    return [];
  }
}

export async function listAllAds() {
  try {
    return (await rest("advertisements?order=created_at.desc")) as RemoteAd[];
  } catch {
    return [];
  }
}

export function deleteRemoteAd(id: string) {
  return rest(`advertisements?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function upsertBrand(row: Record<string, unknown>) {
  return rest("brands?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(row),
  });
}
