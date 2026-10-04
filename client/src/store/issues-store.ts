import { create } from 'zustand';
import issuesData from '@/data/json/issues.json';
import { IssueItem } from '@/features/issues/TenantIssuesScreen';
import { issuesApi } from '@/services/api/issues-api';

interface IssuesState {
  issues: IssueItem[];
  isLoading: boolean;
  loadIssues: () => Promise<void>;
  addIssue: (issue: IssueItem) => Promise<void>;
  updateIssueStatus: (id: string, status: IssueItem['status']) => Promise<void>;
}

export const useIssuesStore = create<IssuesState>((set) => ({
  issues: issuesData as IssueItem[],
  isLoading: false,
  loadIssues: async () => {
    set({ isLoading: true });
    try {
      const data = await issuesApi.fetchIssues();
      set({ issues: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  addIssue: async (newIssue: IssueItem) => {
    set((state) => ({ issues: [newIssue, ...state.issues] }));
    await issuesApi.addIssue(newIssue);
  },
  updateIssueStatus: async (id, status) => {
    set((state) => ({
      issues: state.issues.map((item) =>
        item.id === id ? { ...item, status, dateStr: `${status} ${new Date().getDate()} ${new Date().toLocaleString('default', { month: 'short' })}` } : item
      ),
    }));
    await issuesApi.updateIssueStatus(id, status);
  },
}));
