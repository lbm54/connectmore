// Organizer type based on the Prisma schema
export type Organizer = {
  id: number;
  name: string;
  contactPhone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  websiteUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  imageUrl?: string | null;
  eventsUrl?: string | null;
  isChecked?: boolean | null;
  aliases?: unknown | null; // JSON field
  authUserid?: string | null; // This links to Clerk user ID
};

// For the dashboard with computed fields
export type OrganizerWithStats = Organizer & {
  totalEvents: number;
  totalUpcomingEvents: number;
  totalAttendees: number;
  recentActivity: string;
};

// For forms
export type CreateOrganizerInput = Omit<Organizer, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateOrganizerInput = Partial<CreateOrganizerInput> & { id: number }; 