// Client-side auth helpers
'use client';

import { useUser } from '@clerk/nextjs';
import type { UserRole } from './auth';

export function useCurrentUser() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded || !user) {
    return { user: null, isLoaded };
  }
  
  const role = (user.publicMetadata?.role as UserRole) || 'user';
  
  return {
    user: {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName,
      lastName: user.lastName,
      role,
      organizerId: user.publicMetadata?.organizerId as number | undefined,
    },
    isLoaded: true,
  };
}

export function useRequireRole(requiredRole: UserRole) {
  const { user, isLoaded } = useCurrentUser();
  
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    organizer: 2, 
    admin: 3,
    superadmin: 4,
  };
  
  const hasPermission = user && roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  
  return { user, isLoaded, hasPermission };
} 