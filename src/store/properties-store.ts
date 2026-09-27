import { create } from 'zustand';
import propertiesData from '@/data/json/properties.json';
import { PropertyItem } from '@/features/properties/PropertiesScreen';
import { propertiesApi } from '@/services/api/properties-api';

interface PropertiesState {
  properties: PropertyItem[];
  isLoading: boolean;
  loadProperties: () => Promise<void>;
  addProperty: (property: PropertyItem) => Promise<void>;
}

export const usePropertiesStore = create<PropertiesState>((set) => ({
  properties: propertiesData as PropertyItem[],
  isLoading: false,
  loadProperties: async () => {
    set({ isLoading: true });
    try {
      const data = await propertiesApi.fetchProperties();
      set({ properties: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  addProperty: async (property) => {
    set((state) => ({ properties: [...state.properties, property] }));
    await propertiesApi.addProperty(property);
  },
}));
