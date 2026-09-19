"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Advertisement, Brand, Category } from "./types";
import { listPublishedAds, listRemoteBrands } from "./catalog";

type Live = { ads: Advertisement[]; brands: Brand[]; loaded: boolean };
const Ctx = createContext<Live>({ ads: [], brands: [], loaded: false });

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const [remoteAds, setRemoteAds] = useState<Advertisement[]>([]);
  const [remoteBrands, setRemoteBrands] = useState<Brand[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    Promise.all([listPublishedAds(), listRemoteBrands()])
      .then(([rows, brandRows]) => {
        setRemoteAds(rows.map((r) => ({
          id: r.id,
          brandId: r.brand_id,
          title: r.title,
          description: r.description,
          category: r.category as Category,
          thumbnail: r.media,
          media: r.media,
          likes: r.likes,
          views: r.views,
          createdAt: r.created_at,
        })));
        setRemoteBrands(brandRows.map((b: { id: string; name: string; handle: string; logo: string; description: string; website: string; followers: number }) => ({
          id: b.id,
          name: b.name,
          slug: b.handle,
          logo: b.logo,
          description: b.description,
          website: b.website,
          followers: b.followers,
        })));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);
  const value = useMemo<Live>(() => ({ ads: remoteAds, brands: remoteBrands, loaded }), [remoteAds, remoteBrands, loaded]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLive() {
  return useContext(Ctx);
}
