import { create } from "zustand";
import type { User } from "./types";
import { getUser, updateUserStorage } from "./storage";

interface UserState {
  user: User | null;
  loading: boolean;

  fetchUser: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    set({ loading: true });
    const user = getUser();
    set({ user, loading: false });
  },

  updateUser: async (user) => {
    updateUserStorage(user);
    set({ user });
  },
}));

export { useUserStore };
