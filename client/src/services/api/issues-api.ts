import issuesData from '@/data/json/issues.json';
import { IssueItem } from '@/features/issues/TenantIssuesScreen';

export const issuesApi = {
  async fetchIssues(): Promise<IssueItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(issuesData as IssueItem[]);
      }, 50);
    });
  },

  async addIssue(newIssue: IssueItem): Promise<IssueItem> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newIssue);
      }, 50);
    });
  },

  async updateIssueStatus(id: string, status: IssueItem['status']): Promise<{ id: string; status: IssueItem['status'] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, status });
      }, 50);
    });
  },
};
