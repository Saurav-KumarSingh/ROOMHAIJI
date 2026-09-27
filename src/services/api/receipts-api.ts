import receiptsData from '@/data/json/receipts.json';
import { ReceiptItem } from '@/features/receipts/ReceiptDetailModal';

export const receiptsApi = {
  async fetchReceipts(): Promise<ReceiptItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(receiptsData as ReceiptItem[]);
      }, 50);
    });
  },

  async addReceipt(receipt: ReceiptItem): Promise<ReceiptItem> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(receipt);
      }, 50);
    });
  },
};
