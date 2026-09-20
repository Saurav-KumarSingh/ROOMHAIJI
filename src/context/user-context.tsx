import React, { createContext, useContext, useState, type ReactNode } from 'react';

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
  name: 'Amit Kumar',
  phone: '+91 98765 43210',
  email: 'amit.kumar@roomhaiji.com',
  role: 'tenant',
  property: 'Sharma Building',
  room: '204',
  upiId: 'amit.kumar@upi',
  totalUnits: '12',
  avatarColor: '#4F46E5',
};

const UserContext = createContext<UserContextType>({
  user: DEFAULT_USER,
  updateProfile: () => {},
  toggleRole: () => {},
  initials: 'AK',
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  const updateProfile = (partial: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...partial }));
  };

  const toggleRole = () => {
    setUser((prev) => ({
      ...prev,
      role: prev.role === 'landlord' ? 'tenant' : 'landlord',
      name: prev.role === 'landlord' ? 'Amit Kumar' : 'Sharmaji',
    }));
  };

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'RH';

  return (
    <UserContext.Provider value={{ user, updateProfile, toggleRole, initials }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
