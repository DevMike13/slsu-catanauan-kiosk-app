import { create } from 'zustand';
import { loginUser } from '../database/auth';

export const useAuthStore = create((set) => ({
  user: null,

  login: async (username, email, password) => {
    const user = await loginUser(username, email, password);
    set({ user });
  },

  logout: () => set({ user: null }),
}));
