'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function saveConversation(title: string, messages: { role: string; content: string }[]) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) throw new Error('User not found');

    const saved = await prisma.aiMessage.create({
      data: {
        userId: dbUser.id,
        role: 'assistant',
        content: JSON.stringify({ title, messages }),
      },
    });

    return { success: true, id: saved.id };
  } catch (error) {
    console.error('Failed to save conversation:', error);
    return { success: false, error: 'Failed to save conversation' };
  }
}

export async function getConversations() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return [];

    const records = await prisma.aiMessage.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true },
    });

    return records
      .map(r => {
        try {
          const parsed = JSON.parse(r.content);
          return {
            id: r.id,
            title: parsed.title || 'Chat',
            messages: parsed.messages || [],
            lastUpdated: r.createdAt.toISOString(),
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return [];
  }
}
