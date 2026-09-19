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
};

export async function listPublishedAds() {
  const res = await fetch(`${URL}/rest/v1/advertisements?status=eq.published&order=created_at.desc`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return (await res.json()) as RemoteAd[];
}

export async function listRemoteBrands() {
  const res = await fetch(`${URL}/rest/v1/brands?order=followers.desc`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}
