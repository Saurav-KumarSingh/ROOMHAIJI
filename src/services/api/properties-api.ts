import propertiesData from '@/data/json/properties.json';
import { PropertyItem } from '@/features/properties/PropertiesScreen';

export const propertiesApi = {
  async fetchProperties(): Promise<PropertyItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(propertiesData as PropertyItem[]);
      }, 50);
    });
  },

  async addProperty(property: PropertyItem): Promise<PropertyItem> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(property);
      }, 50);
    });
  },
};
