import { create } from "zustand";
import axios from "axios";

interface UsersStore {
  userList: User[] | null;
  userData: User | null;
  loading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
  create: (user: User) => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  update: (id: string, user: User) => Promise<void>;
}

const url = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useUsersStore = create<UsersStore>((set, get) => ({
  userList: [],
  userData: null,
  loading: false,
  error: null,

  getUsers: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${url}/users`);
      set({ userList: res.data, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || error.message,
      });
    }
  },

  create: async (user: User) => {
    try {
      const res = await axios.post(`${url}/users`, user);

      return res.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      throw new Error(message);
    }
  },

  getUserById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${url}/users/${id}`);
      set({ userData: response.data, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  update: async (id: string, user: User) => {
    try {
      const res = await axios.put(`${url}/users/${id}`, user);
      return res.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  },
}));
