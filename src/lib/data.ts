import type { Advertisement, Brand, NotificationItem } from "./types";

export const brands: Brand[] = [];
export const advertisements: Advertisement[] = [];
export const seedNotifications: NotificationItem[] = [];

export function getBrand(id: string) {
  return brands.find((b) => b.id === id || b.slug === id);
}
export function getAd(id: string) {
  return advertisements.find((a) => a.id === id);
}
export function adsByBrand(brandId: string) {
  return advertisements.filter((a) => a.brandId === brandId);
}
export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
