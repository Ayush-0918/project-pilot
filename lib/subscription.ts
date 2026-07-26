import { prisma } from '@/lib/prisma';

export async function getUserSubscription(userId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    return subscription;
  } catch {
    return null;
  }
}

export async function isPremiumUser(userId: string): Promise<boolean> {
  const sub = await getUserSubscription(userId);
  return sub?.status === 'active' && sub?.planTier === 'premium';
}
