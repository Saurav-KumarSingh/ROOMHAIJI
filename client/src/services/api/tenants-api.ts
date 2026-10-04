import tenantsData from '@/data/json/tenants.json';
import { LandlordTenantItem } from '@/features/landlord/LandlordTenantsScreen';

export const tenantsApi = {
  async fetchTenants(): Promise<LandlordTenantItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tenantsData as LandlordTenantItem[]);
      }, 50);
    });
  },

  async addTenant(tenant: LandlordTenantItem): Promise<LandlordTenantItem> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tenant);
      }, 50);
    });
  },
};
