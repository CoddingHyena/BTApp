export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  role: 'PLAYER' | 'MODERATOR' | 'ADMIN';
  avatar: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: 'PLAYER' | 'MODERATOR' | 'ADMIN';
}

export interface UpdateUserStatusRequest {
  userId: string;
  isActive: boolean;
} 