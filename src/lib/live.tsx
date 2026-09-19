"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Advertisement, Brand, Category } from "./types";
import { listPublishedAds, listRemoteBrands } from "./catalog";
import { BOARD_ID, pullBoard } from "./adminBoard";

type Live = { ads: Advertisement[]; brands: Brand[]; loaded: boolean };
const Ctx = createContext<Live>({ ads: [], brands: [], loaded: false });

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const [remoteAds, setRemoteAds] = useState<Advertisement[]>([]);
  const [remoteBrands, setRemoteBrands] = useState<Brand[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    Promise.all([listPublishedAds(), listRemoteBrands(), pullBoard()])
      .then(([rows, brandRows, board]) => {
        const banned = new Set(board.bannedBrandIds);
        const brands = brandRows
          .filter((b: { id: string; twitter?: string }) => b.id !== BOARD_ID && b.twitter !== "cswa-banned" && !banned.has(b.id))
          .map((b: { id: string; name: string; handle: string; logo: string; description: string; website: string; followers: number; twitter?: string }) => ({
            id: b.id, name: b.name, slug: b.handle, logo: b.logo || "", description: b.description || "",
            website: b.website || "", followers: b.followers || 0, verified: b.twitter === "cswa-verified",
          }));
        const brandIds = new Set(brands.map((b: Brand) => b.id));
        setRemoteBrands(brands);
        setRemoteAds(rows.filter((r) => !banned.has(r.brand_id) && brandIds.has(r.brand_id)).map((r) => ({
          id: r.id, brandId: r.brand_id, brandName: r.brand_name, title: r.title, description: r.description,
          category: r.category as Category, thumbnail: r.media, media: r.media, likes: r.likes, views: r.views,
          createdAt: r.created_at, cta: r.cta, destinationUrl: r.destination_url,
        })));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);
  const value = useMemo<Live>(() => ({ ads: remoteAds, brands: remoteBrands, loaded }), [remoteAds, remoteBrands, loaded]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useLive() { return useContext(Ctx); }
