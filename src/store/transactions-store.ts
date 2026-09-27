import { create } from 'zustand';
import transactionsData from '@/data/json/transactions.json';
import { LandlordTransaction } from '@/features/landlord/LandlordPaymentsScreen';
import { transactionsApi } from '@/services/api/transactions-api';

interface TransactionsState {
  transactions: LandlordTransaction[];
  isLoading: boolean;
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: LandlordTransaction) => Promise<void>;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: transactionsData as LandlordTransaction[],
  isLoading: false,
  loadTransactions: async () => {
    set({ isLoading: true });
    try {
      const data = await transactionsApi.fetchTransactions();
      set({ transactions: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  addTransaction: async (transaction) => {
    set((state) => ({ transactions: [transaction, ...state.transactions] }));
    await transactionsApi.addTransaction(transaction);
  },
}));
