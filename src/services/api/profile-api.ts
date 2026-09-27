import profileData from '@/data/json/profile.json';
import { UserProfile } from '@/store/user-store';

export const profileApi = {
  async fetchProfile(): Promise<UserProfile> {
    // Simulating async network request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(profileData as UserProfile);
      }, 50);
    });
  },

  async updateProfile(partial: Partial<UserProfile>): Promise<Partial<UserProfile>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(partial);
      }, 50);
    });
  },
};
