import { create } from 'zustand';
import receiptsData from '@/data/json/receipts.json';
import { ReceiptItem } from '@/features/receipts/ReceiptDetailModal';
import { receiptsApi } from '@/services/api/receipts-api';

interface ReceiptsState {
  receipts: ReceiptItem[];
  isLoading: boolean;
  loadReceipts: () => Promise<void>;
  addReceipt: (receipt: ReceiptItem) => Promise<void>;
}

export const useReceiptsStore = create<ReceiptsState>((set) => ({
  receipts: receiptsData as ReceiptItem[],
  isLoading: false,
  loadReceipts: async () => {
    set({ isLoading: true });
    try {
      const data = await receiptsApi.fetchReceipts();
      set({ receipts: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  addReceipt: async (receipt) => {
    set((state) => ({ receipts: [receipt, ...state.receipts] }));
    await receiptsApi.addReceipt(receipt);
  },
}));
