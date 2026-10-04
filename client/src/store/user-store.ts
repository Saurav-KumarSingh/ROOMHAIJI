import { create } from 'zustand';
import profileData from '@/data/json/profile.json';
import { profileApi } from '@/services/api/profile-api';

export type UserRole = 'tenant' | 'landlord';

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  property: string;
  room: string;
  upiId: string;
  totalUnits?: string;
  avatarColor?: string;
}

interface UserState {
  user: UserProfile;
  isLoading: boolean;
  loadProfile: () => Promise<void>;
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
  toggleRole: () => void;
  setUser: (user: UserProfile) => void;
  getInitials: () => string;
}

const DEFAULT_USER: UserProfile = profileData as UserProfile;

export const useUserStore = create<UserState>((set, get) => ({
  user: DEFAULT_USER,
  isLoading: false,
  loadProfile: async () => {
    set({ isLoading: true });
    try {
      const fetched = await profileApi.fetchProfile();
      set({ user: fetched, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  updateProfile: async (partial) => {
    set((state) => ({ user: { ...state.user, ...partial } }));
    await profileApi.updateProfile(partial);
  },
  toggleRole: () =>
    set((state) => {
      const nextRole: UserRole = state.user.role === 'landlord' ? 'tenant' : 'landlord';
      const nextName = nextRole === 'landlord' ? 'Rajesh Sharma' : 'Amit Kumar';
      return {
        user: {
          ...state.user,
          role: nextRole,
          name: nextName,
        },
      };
    }),
  setUser: (user) => set({ user }),
  getInitials: () => {
    const { name } = get().user;
    return (
      name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'RS'
    );
  },
}));

export function deriveInitials(name: string): string {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'RS'
  );
}
