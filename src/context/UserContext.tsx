import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { UserProfile } from '../types';

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null | ((prev: UserProfile | null) => UserProfile | null)) => void;
  isOnboarded: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('cutine_profile', null);

  return (
    <UserContext.Provider value={{
      profile,
      setProfile,
      isOnboarded: profile !== null,
    }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
