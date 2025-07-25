import { create } from "zustand";
import axios from "axios";

interface ContractStore {
  contractList: ContractResponse[];
  selectedContract: ContractResponse | null;
  loading: boolean;
  error: string | null;

  clearSelectedContract: () => void;
  getContracts: () => Promise<void>;
  getContractByUserId: (userId: number) => Promise<void>;
  createContract: (kontrak: ContractResponse) => Promise<void>;
  updateContract: (userId: number, kontrak: ContractResponse) => Promise<void>;
}

const url = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useContractStore = create<ContractStore>((set, get) => ({
  contractList: [],
  selectedContract: null,
  loading: false,
  error: null,
  clearSelectedContract: () => set({ selectedContract: null }),

  getContracts: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${url}/kontrak`);
      set({ contractList: res.data, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  getContractByUserId: async (userId: number) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${url}/kontrak/${userId}`);
      set({ selectedContract: res.data, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  createContract: async (kontrak) => {
    try {
      await axios.post(`${url}/kontrak`, kontrak);
      await get().getContracts();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateContract: async (userId, kontrak) => {
    try {
      await axios.put(`${url}/kontrak/${userId}`, kontrak);
      await get().getContracts();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
}));
