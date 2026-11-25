export const USER_ROLES = [
  'PASSENGER',
  'SUPER_ADMIN',
  'ADMIN',
  'OPERATIONS_MANAGER',
  'STATION_MANAGER',
  'CONDUCTOR',
  'SUPPORT_AGENT',
  'FINANCE_OFFICER',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type UserCreationAttributes = Pick<UserAttributes, 'firstName' | 'email' | 'password'> &
  Partial<Pick<UserAttributes, 'lastName' | 'phoneNumber' | 'role'>>;

/** User shape that is safe to return from the API (never includes the password hash). */
export type PublicUser = Omit<UserAttributes, 'password' | 'deletedAt'>;

export interface PageParams {
  pageNumber?: number;
  pageSize?: number;
}
