import { IsEnum } from 'class-validator';

export enum UserRole {
  PLAYER = 'PLAYER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
} 