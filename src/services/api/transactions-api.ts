import transactionsData from '@/data/json/transactions.json';
import { LandlordTransaction } from '@/features/landlord/LandlordPaymentsScreen';

export const transactionsApi = {
  async fetchTransactions(): Promise<LandlordTransaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(transactionsData as LandlordTransaction[]);
      }, 50);
    });
  },

  async addTransaction(transaction: LandlordTransaction): Promise<LandlordTransaction> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(transaction);
      }, 50);
    });
  },
};
