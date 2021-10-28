import { Message } from '.prisma/client';
import { prismaClient } from '../prisma';

export class Last3MessageService {
  async execute(): Promise<Message[] | null> {
    const messages = await prismaClient.message.findMany({
      take: 3,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: true,
      },
    });

    return messages;
  }
}
