export type Category =
  | "Fashion" | "Sports" | "Food" | "Technology" | "Beauty"
  | "Gaming" | "Automotive" | "Travel" | "Entertainment" | "Other";
export const CATEGORIES: Category[] = ["Fashion","Sports","Food","Technology","Beauty","Gaming","Automotive","Travel","Entertainment","Other"];
export type Brand = {
  id: string; name: string; slug: string; logo: string; description: string;
  website: string; followers: number; verified?: boolean;
};
export type Advertisement = {
  id: string; brandId: string; brandName?: string; title: string; description: string;
  category: Category; thumbnail: string; media: string; likes: number; views: number;
  createdAt: string; cta?: string; destinationUrl?: string;
};
export type User = { id: string; name: string; email: string; avatar: string; interests: Category[]; admin?: boolean };
export type NotificationItem = { id: string; brandId: string; message: string; createdAt: string; read: boolean };
