import { create } from "zustand";
import { authAxiosInstance } from "../utils/axiosInstance";

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  phone?: string;
  vnd: number;
}

interface UserStore {
  user: User | null;
  isFetching: boolean;
  hasFetchedUser: boolean;
  setUser: (user: User | null) => void;
  checkUser: () => Promise<User | null>;
  updateUserFromBackend: (userId: number) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isFetching: false,
  hasFetchedUser: false,

  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    } else {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      set({ user: null, hasFetchedUser: false });
    }
  },

  checkUser: async () => {
    const sessionUser = sessionStorage.getItem("user");
    const localUser = localStorage.getItem("user");

    if (sessionUser || localUser) {
      const rawUser = sessionUser || localUser;
      try {
        const parsed: User = JSON.parse(rawUser!);
        const res = await authAxiosInstance.get(`/auth/me`);
        const me = res.data;
        set({ user: { ...parsed, ...me }, hasFetchedUser: true });
        return parsed;
      } catch (e) {
        set({ user: null, hasFetchedUser: true });
        return null;
      }
    } else {
      try {
        const res = await authAxiosInstance.get(`/auth/me`);
        if (res.status !== 200) throw new Error("Not logged in");
        const me = res.data;
        set({ user: me, hasFetchedUser: true });
        localStorage.setItem("user", JSON.stringify(me));
        return me;
      } catch {
        set({ user: null, hasFetchedUser: true });
        return null;
      }
    }
  },
  updateUserFromBackend: async (userId: number) => {
    const { isFetching, hasFetchedUser } = get();
    if (isFetching || hasFetchedUser) return;

    set({ isFetching: true });

    try {
      const res = await authAxiosInstance.get(`/account/user/${userId}`);
      if (res.status !== 200) throw new Error("Fetch failed");

      const data = res.data;
      set({ user: data });
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      set({ user: null });
    } finally {
      set({ isFetching: false, hasFetchedUser: true });
    }
  },
}));
