import { create } from 'zustand';
import tenantsData from '@/data/json/tenants.json';
import { LandlordTenantItem } from '@/features/landlord/LandlordTenantsScreen';
import { tenantsApi } from '@/services/api/tenants-api';

interface TenantsState {
  tenants: LandlordTenantItem[];
  isLoading: boolean;
  loadTenants: () => Promise<void>;
  addTenant: (tenant: LandlordTenantItem) => Promise<void>;
}

export const useTenantsStore = create<TenantsState>((set) => ({
  tenants: tenantsData as LandlordTenantItem[],
  isLoading: false,
  loadTenants: async () => {
    set({ isLoading: true });
    try {
      const data = await tenantsApi.fetchTenants();
      set({ tenants: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  addTenant: async (tenant) => {
    set((state) => ({ tenants: [tenant, ...state.tenants] }));
    await tenantsApi.addTenant(tenant);
  },
}));
