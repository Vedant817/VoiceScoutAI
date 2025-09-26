export type Session = {
  session: {
    id: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    userId: string;
    expiresAt: Date | string;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: {
    id: string;
    email: string;
    name?: string;
    // No `[key: string]: any`!
  };
} | null;
