import { User } from '.prisma/client';
import { prismaClient } from '../prisma';

export class ProfileUserService {
  async execute(user_id: string): Promise<User | null> {
    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id,
      },
    });

    return user;
  }
}
