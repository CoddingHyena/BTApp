import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export async function seedUsers(prisma: PrismaClient) {
  console.log('🌱 Начинаем seeding пользователей...');

  // Проверяем, существует ли уже пользователь с таким email
  const existingUser = await prisma.user.findUnique({
    where: { email: 'Serge49@mail.ru' },
  });

  if (existingUser) {
    console.log('⚠️  Пользователь Serge49 уже существует, пропускаем создание');
  } else {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('Das1nner1h', 10);

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email: 'Serge49@mail.ru',
        username: 'Serge49',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        isVerified: true,
      },
    });

    console.log('✅ Администратор создан:', {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    });
  }

  console.log('🎉 Seeding пользователей завершен!');
}
