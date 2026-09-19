"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { advertisements, brands } from "./data";
import type { Advertisement, Brand, Category } from "./types";
import { listPublishedAds, listRemoteBrands } from "./catalog";

type Live = { ads: Advertisement[]; brands: Brand[] };
const Ctx = createContext<Live>({ ads: advertisements, brands });

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const [remoteAds, setRemoteAds] = useState<Advertisement[]>([]);
  const [remoteBrands, setRemoteBrands] = useState<Brand[]>([]);
  useEffect(() => {
    listPublishedAds().then((rows) => {
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
    }).catch(() => {});
    listRemoteBrands().then((rows) => {
      setRemoteBrands(rows.map((b: { id: string; name: string; handle: string; logo: string; description: string; website: string; followers: number }) => ({
        id: b.id, name: b.name, slug: b.handle, logo: b.logo, description: b.description, website: b.website, followers: b.followers,
      })));
    }).catch(() => {});
  }, []);
  const value = useMemo<Live>(() => {
    const adIds = new Set(remoteAds.map((a) => a.id));
    const brandIds = new Set(remoteBrands.map((b) => b.id));
    return {
      ads: [...remoteAds, ...advertisements.filter((a) => !adIds.has(a.id))],
      brands: [...remoteBrands, ...brands.filter((b) => !brandIds.has(b.id))],
    };
  }, [remoteAds, remoteBrands]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLive() {
  return useContext(Ctx);
}
