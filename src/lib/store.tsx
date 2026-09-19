"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Category, NotificationItem, User } from "./types";
import { seedNotifications } from "./data";

const KEY = "cswa-store-v1";

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
  notifications: seedNotifications,
};

type Store = StoreState & {
  ready: boolean;
  signup: (name: string, email: string, password: string, interests: Category[]) => void;
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

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoreState;
        setState({
          ...defaultState,
          ...parsed,
          notifications: parsed.notifications?.length
            ? parsed.notifications
            : seedNotifications,
        });
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const signup = useCallback(
    (name: string, email: string, _password: string, interests: Category[]) => {
      const user: User = {
        id: crypto.randomUUID(),
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111111&color=fff`,
        interests,
      };
      setState((s) => ({ ...s, user }));
    },
    []
  );

  const login = useCallback((email: string, _password: string) => {
    let ok = false;
    setState((s) => {
      if (s.user && s.user.email.toLowerCase() === email.toLowerCase()) {
        ok = true;
        return s;
      }
      if (!s.user) {
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
      }
      return s;
    });
    return ok;
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, user: null }));
  }, []);

  const updateInterests = useCallback((interests: Category[]) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, interests } } : s));
  }, []);

  const toggleLike = useCallback((adId: string) => {
    setState((s) => ({
      ...s,
      liked: s.liked.includes(adId) ? s.liked.filter((id) => id !== adId) : [...s.liked, adId],
    }));
  }, []);

  const toggleSave = useCallback((adId: string) => {
    setState((s) => ({
      ...s,
      saved: s.saved.includes(adId) ? s.saved.filter((id) => id !== adId) : [...s.saved, adId],
    }));
  }, []);

  const toggleFollow = useCallback((brandId: string) => {
    setState((s) => ({
      ...s,
      followed: s.followed.includes(brandId)
        ? s.followed.filter((id) => id !== brandId)
        : [...s.followed, brandId],
    }));
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      ready,
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
    }),
    [state, ready, signup, login, logout, updateInterests, toggleLike, toggleSave, toggleFollow]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
