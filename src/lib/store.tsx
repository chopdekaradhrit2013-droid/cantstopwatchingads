"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Category, NotificationItem, User } from "./types";
import { isAdminEmail, isAdminLogin } from "./admin";

const KEY = "cswa-store-v4";

type StoreState = {
  user: User | null;
  liked: string[];
  saved: string[];
  followed: string[];
  notifications: NotificationItem[];
};

const defaultState: StoreState = {
  user: null,
  liked: [],
  saved: [],
  followed: [],
  notifications: [],
};

type Store = StoreState & {
  ready: boolean;
  isAdmin: boolean;
  signup: (name: string, email: string, password: string, interests: Category[]) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateInterests: (interests: Category[]) => void;
  toggleLike: (adId: string) => void;
  toggleSave: (adId: string) => void;
  toggleFollow: (brandId: string) => void;
  isLiked: (adId: string) => boolean;
  isSaved: (adId: string) => boolean;
  isFollowed: (brandId: string) => boolean;
};

const Ctx = createContext<Store | null>(null);

function adminUser(): User {
  return {
    id: "admin-cswa",
    name: "Admin",
    email: "chopdekaradhrit2013@gmail.com",
    avatar: "https://ui-avatars.com/api/?name=Admin&background=111111&color=fff",
    interests: [],
    admin: true,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...defaultState, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const signup = useCallback((name: string, email: string, password: string, interests: Category[]) => {
    if (isAdminEmail(email)) {
      if (!isAdminLogin(email, password)) return false;
      setState((s) => ({ ...s, user: adminUser() }));
      return true;
    }
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111111&color=fff`,
      interests,
    };
    setState((s) => ({ ...s, user }));
    return true;
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (isAdminEmail(email)) {
      if (!isAdminLogin(email, password)) return false;
      setState((s) => ({ ...s, user: adminUser() }));
      return true;
    }
    let ok = false;
    setState((s) => {
      if (s.user && s.user.email.toLowerCase() === email.toLowerCase()) {
        ok = true;
        return s;
      }
      ok = true;
      return {
        ...s,
        user: {
          id: crypto.randomUUID(),
          name: email.split("@")[0],
          email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=111111&color=fff`,
          interests: [],
        },
      };
    });
    return ok;
  }, []);

  const logout = useCallback(() => setState((s) => ({ ...s, user: null })), []);
  const updateInterests = useCallback((interests: Category[]) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, interests } } : s));
  }, []);
  const toggleLike = useCallback((adId: string) => {
    setState((s) => ({ ...s, liked: s.liked.includes(adId) ? s.liked.filter((id) => id !== adId) : [...s.liked, adId] }));
  }, []);
  const toggleSave = useCallback((adId: string) => {
    setState((s) => ({ ...s, saved: s.saved.includes(adId) ? s.saved.filter((id) => id !== adId) : [...s.saved, adId] }));
  }, []);
  const toggleFollow = useCallback((brandId: string) => {
    setState((s) => ({
      ...s,
      followed: s.followed.includes(brandId) ? s.followed.filter((id) => id !== brandId) : [...s.followed, brandId],
    }));
  }, []);

  const isAdmin = !!state.user?.admin || isAdminEmail(state.user?.email);
  const value = useMemo<Store>(() => ({
    ...state,
    ready,
    isAdmin,
    signup,
    login,
    logout,
    updateInterests,
    toggleLike,
    toggleSave,
    toggleFollow,
    isLiked: (id) => state.liked.includes(id),
    isSaved: (id) => state.saved.includes(id),
    isFollowed: (id) => state.followed.includes(id),
  }), [state, ready, isAdmin, signup, login, logout, updateInterests, toggleLike, toggleSave, toggleFollow]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
