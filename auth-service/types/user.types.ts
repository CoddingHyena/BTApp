import { UserRole } from '@prisma/client';

// Тип для безопасного возврата пользователя (без пароля)
export type SafeUser = {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  avatar: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}; 