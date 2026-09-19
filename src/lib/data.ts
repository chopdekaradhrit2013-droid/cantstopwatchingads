import type { Advertisement, Brand, Category, NotificationItem } from "./types";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const brands: Brand[] = [
  { id: "nike", name: "Nike", slug: "nike", logo: img("photo-1542291026-7eec264c27ff", 200), description: "Just Do It. Sport, culture, and movement for everyone.", website: "https://www.nike.com", followers: 128400 },
  { id: "adidas", name: "Adidas", slug: "adidas", logo: img("photo-1511556532299-8f662fc26c06", 200), description: "Impossible is nothing. Football, running, and street style.", website: "https://www.adidas.com", followers: 97200 },
  { id: "apple", name: "Apple", slug: "apple", logo: img("photo-1611186871348-b1ce696e52c9", 200), description: "Think different. Hardware, software, and services.", website: "https://www.apple.com", followers: 210500 },
  { id: "lush", name: "Lush", slug: "lush", logo: img("photo-1556228578-0d85b1a4d571", 200), description: "Fresh handmade cosmetics with a conscience.", website: "https://www.lush.com", followers: 34100 },
  { id: "sony", name: "Sony PlayStation", slug: "sony", logo: img("photo-1606144042614-b2417e99c4e3", 200), description: "Play Has No Limits.", website: "https://www.playstation.com", followers: 156800 },
  { id: "tesla", name: "Tesla", slug: "tesla", logo: img("photo-1560958089-b8a1929cea89", 200), description: "Accelerating the world’s transition to sustainable energy.", website: "https://www.tesla.com", followers: 188200 },
  { id: "airbnb", name: "Airbnb", slug: "airbnb", logo: img("photo-1501785888041-af3ef285b470", 200), description: "Belong anywhere. Homes and experiences around the world.", website: "https://www.airbnb.com", followers: 76400 },
  { id: "netflix", name: "Netflix", slug: "netflix", logo: img("photo-1574375927938-d5a98e8ffe85", 200), description: "Stories that move you. Films and series worldwide.", website: "https://www.netflix.com", followers: 240100 },
];

const rows: [string, string, string, string, Category, string, number, number, string][] = [
  ["ad-01", "nike", "Move Like You Mean It", "Everyday athletes who treat the street as their stadium.", "Sports", "photo-1552674605-db6ffd4facb5", 4821, 128400, "2026-09-12T09:00:00.000Z"],
  ["ad-02", "nike", "Night Run Club", "City lights and late miles after dark.", "Sports", "photo-1476480862126-209bfaa8edc8", 3102, 87400, "2026-09-08T18:30:00.000Z"],
  ["ad-03", "adidas", "Football Collection ’26", "Kits and boots built for the beautiful game.", "Sports", "photo-1579952363873-27f3bade9f55", 6240, 201300, "2026-09-15T11:00:00.000Z"],
  ["ad-04", "adidas", "Three Stripes, One Path", "A quiet film about craft.", "Fashion", "photo-1460353581641-37baddab0fa2", 2188, 54300, "2026-08-29T08:00:00.000Z"],
  ["ad-05", "apple", "Shot on iPhone — Rain City", "A short film after midnight rain.", "Technology", "photo-1511707171634-5f897ff02aa9", 9102, 412000, "2026-09-14T16:00:00.000Z"],
  ["ad-06", "apple", "Studio in Your Pocket", "Pro workflows in one hand.", "Technology", "photo-1491933382434-500287f9b54b", 5401, 198700, "2026-09-01T12:00:00.000Z"],
  ["ad-07", "lush", "Fresh Counter, Open Hands", "Scent, color, and care without plastic.", "Beauty", "photo-1596462502278-27bfdc403348", 1876, 42100, "2026-09-10T10:00:00.000Z"],
  ["ad-08", "lush", "Bath Bomb Weather", "When the sky is grey, the water should not be.", "Beauty", "photo-1571781926291-c477ebfd024b", 1433, 31800, "2026-08-22T09:30:00.000Z"],
  ["ad-09", "sony", "Worlds You Can Hold", "Worlds built to be shared and replayed.", "Gaming", "photo-1493711662062-fa541adb3fc8", 7720, 305400, "2026-09-16T20:00:00.000Z"],
  ["ad-10", "sony", "Controller, Campfire, Friends", "The living room as a gathering place.", "Gaming", "photo-1606144042614-b2417e99c4e3", 3988, 112200, "2026-09-03T15:00:00.000Z"],
  ["ad-11", "tesla", "Quiet Road, Open Sky", "A night drive with only wind and lights.", "Automotive", "photo-1560958089-b8a1929cea89", 6504, 276500, "2026-09-11T07:00:00.000Z"],
  ["ad-12", "tesla", "Charge Anywhere", "Nights that no longer end at the last pump.", "Automotive", "photo-1617704548623-340376564e68", 2890, 98100, "2026-08-18T13:00:00.000Z"],
  ["ad-13", "airbnb", "A Kitchen in Lisbon", "Wake up in someone else’s favorite neighborhood.", "Travel", "photo-1502672260266-1c1ef2d93688", 4210, 134800, "2026-09-13T08:45:00.000Z"],
  ["ad-14", "airbnb", "Cabin After Rain", "Steam on the windows, forest on the doorstep.", "Travel", "photo-1441974231531-c6227db76b6e", 3666, 89000, "2026-09-05T06:20:00.000Z"],
  ["ad-15", "netflix", "This Weekend Only Feels Longer", "Stories that steal Sunday evenings.", "Entertainment", "photo-1489599849927-2ee91cede3ba", 8801, 390200, "2026-09-17T19:00:00.000Z"],
  ["ad-16", "netflix", "Table for One, Screen for Many", "Food, family, and a series that waits.", "Food", "photo-1414235077428-338989a2e8c0", 2540, 67200, "2026-08-30T17:10:00.000Z"],
  ["ad-17", "nike", "Studio Hours", "Training looks different when the room is yours.", "Fashion", "photo-1517836357463-d25dfeac3438", 1994, 50300, "2026-08-14T11:15:00.000Z"],
];

export const advertisements: Advertisement[] = rows.map(([id, brandId, title, description, category, photo, likes, views, createdAt]) => ({
  id, brandId, title, description, category, likes, views, createdAt,
  thumbnail: img(photo, 1200),
  media: img(photo, 1600),
}));

export const seedNotifications: NotificationItem[] = [
  { id: "n1", brandId: "nike", message: "Nike just released a new advertisement.", createdAt: "2026-09-17T09:12:00.000Z", read: false },
  { id: "n2", brandId: "adidas", message: "Adidas uploaded a new football collection ad.", createdAt: "2026-09-15T11:05:00.000Z", read: false },
  { id: "n3", brandId: "netflix", message: "A brand you follow just dropped a new ad.", createdAt: "2026-09-17T19:02:00.000Z", read: true },
  { id: "n4", brandId: "sony", message: "Sony PlayStation published Worlds You Can Hold.", createdAt: "2026-09-16T20:04:00.000Z", read: false },
];

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
