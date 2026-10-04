import React, { type ReactNode } from 'react';
import { deriveInitials, useUserStore, type UserProfile, type UserRole } from '@/store/user-store';

export type { UserProfile, UserRole };

const DEFAULT_USER: UserProfile = {
  name: 'Rajesh Sharma',
  phone: '+91 98765 43210',
  email: 'rajesh.sharma@roomhaiji.com',
  role: 'landlord',
  property: 'Sharma Building',
  room: '204',
  upiId: 'rajesh@upi',
  totalUnits: '12',
  avatarColor: '#4F46E5',
};

export function UserProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useUser() {
  const storeUser = useUserStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const toggleRole = useUserStore((state) => state.toggleRole);

  const user = storeUser || DEFAULT_USER;
  const initials = deriveInitials(user?.name || '');

  return {
    user,
    updateProfile,
    toggleRole,
    initials,
  };
}
