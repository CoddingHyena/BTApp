// src/modules/user/user.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UpdateProfileDto } from './dto/update-profile.dto';

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createUserDto: any): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    // Проверяем уникальность email и username
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email или username уже существует');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async updateStatus(id: string, isActive: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async findMany(ids: string[]): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
    });
  }

  async exists(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!user;
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    // Проверяем существование пользователя
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Проверяем уникальность username, если он изменяется
    if (updateProfileDto.username && updateProfileDto.username !== existingUser.username) {
      const userWithSameUsername = await this.findByUsername(updateProfileDto.username);
      if (userWithSameUsername) {
        throw new ConflictException('Username уже используется');
      }
    }

    // Обновляем профиль
    return this.prisma.user.update({
      where: { id },
      data: {
        username: updateProfileDto.username,
      },
    });
  }
}
