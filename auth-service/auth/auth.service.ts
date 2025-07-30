import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../generated/prisma';
import { UserRole } from './dto/update-user-role.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.verifyPassword(user, password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Обновляем время последнего входа
    await this.usersService.updateLastLogin(user.id);

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getAllUsers(currentUser: any) {
    // Проверяем, что текущий пользователь является администратором
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Только администраторы могут просматривать список пользователей');
    }

    const users = await this.usersService.findAll();
    return users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async updateUserRole(userId: string, newRole: UserRole, currentUser: any) {
    // Проверяем, что текущий пользователь является администратором
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Только администраторы могут изменять роли пользователей');
    }

    // Проверяем, что пользователь не пытается изменить свою собственную роль
    if (currentUser.id === userId) {
      throw new ForbiddenException('Нельзя изменить свою собственную роль');
    }

    const updatedUser = await this.usersService.updateRole(userId, newRole);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      isActive: updatedUser.isActive,
      isVerified: updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async updateUserStatus(userId: string, isActive: boolean, currentUser: any) {
    // Проверяем, что текущий пользователь является администратором
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Только администраторы могут изменять статус пользователей');
    }

    // Проверяем, что пользователь не пытается изменить свой собственный статус
    if (currentUser.id === userId) {
      throw new ForbiddenException('Нельзя изменить свой собственный статус');
    }

    const updatedUser = await this.usersService.updateStatus(userId, isActive);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      isActive: updatedUser.isActive,
      isVerified: updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
} 