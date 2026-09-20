import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

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

interface UserContextType {
  user: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  toggleRole: () => void;
  initials: string;
}

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

const UserContext = createContext<UserContextType>({
  user: DEFAULT_USER,
  updateProfile: () => {},
  toggleRole: () => {},
  initials: 'RS',
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggleRole = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      role: prev.role === 'landlord' ? 'tenant' : 'landlord',
      name: prev.role === 'landlord' ? 'Amit Kumar' : 'Rajesh Sharma',
    }));
  }, []);

  const initials = useMemo(() => {
    return (
      user.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'RS'
    );
  }, [user.name]);

  const value = useMemo(
    () => ({
      user,
      updateProfile,
      toggleRole,
      initials,
    }),
    [user, updateProfile, toggleRole, initials]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
