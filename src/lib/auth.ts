import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export type UserRole = 'user' | 'organizer' | 'admin' | 'superadmin';

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  
  // Return Clerk user data directly - no database lookup needed for basic auth
  return {
    id: clerkUser.id, // This is the string ID from Clerk
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    displayName: clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}` 
      : clerkUser.firstName || clerkUser.lastName || 'Anonymous',
    role: (clerkUser.publicMetadata?.role as UserRole) || 'user',
    organizerId: clerkUser.publicMetadata?.organizerId as number | undefined,
  };
}

// Helper function to ensure user exists in database (call when needed)
export async function ensureUserExists(clerkUser: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) {
  const { PrismaClient } = await import('@/app/generated/prisma');
  const prisma = new PrismaClient();
  
  try {
    const existingUser = await prisma.users.findUnique({
      where: { userid: clerkUser.id }
    });

    if (!existingUser) {
      await prisma.users.create({
        data: {
          userid: clerkUser.id,
          email: clerkUser.email,
          first_name: clerkUser.firstName,
          last_name: clerkUser.lastName,
          display_name: clerkUser.displayName,
        }
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  return getCurrentUser();
}

export async function requireRole(requiredRole: UserRole) {
  const user = await requireAuth();
  if (!user) {
    redirect('/sign-in');
  }
  
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    organizer: 2, 
    admin: 3,
    superadmin: 4,
  };
  
  const userLevel = roleHierarchy[user.role];
  const requiredLevel = roleHierarchy[requiredRole];
  
  if (userLevel < requiredLevel) {
    redirect('/unauthorized');
  }
  
  return user;
}

export async function requireOrganizer() {
  const user = await requireRole('organizer');
  
  if (!user.organizerId) {
    // Redirect to organizer setup if they have the role but no organizer profile
    redirect('/organizers/setup');
  }
  
  return user as typeof user & { organizerId: number };
} 