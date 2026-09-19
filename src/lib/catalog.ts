export type RemoteAd = {
  id: string;
  brand_id: string;
  brand_name: string;
  title: string;
  description: string;
  media: string;
  category: string;
  style: string;
  status: string;
  created_at: string;
  views: number;
  likes: number;
  saves: number;
};

function cfg() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

export function hasBackend() {
  return Boolean(cfg());
}

export async function listPublishedAds() {
  const c = cfg();
  if (!c) return [];
  const res = await fetch(`${c.url}/rest/v1/advertisements?status=eq.published&order=created_at.desc`, {
    headers: { apikey: c.key, Authorization: `Bearer ${c.key}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return (await res.json()) as RemoteAd[];
}

export async function listBrands() {
  const c = cfg();
  if (!c) return [];
  const res = await fetch(`${c.url}/rest/v1/brands?order=followers.desc`, {
    headers: { apikey: c.key, Authorization: `Bearer ${c.key}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}
