import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { RestoreAccountPrompt } from '@/components/account/RestoreAccountPrompt';

export const dynamic = 'force-dynamic';

export default async function RestoreAccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { deletedAt: true },
  });

  // Nothing to recover — send them straight to the dashboard.
  if (!user?.deletedAt) {
    redirect('/dashboard');
  }

  return <RestoreAccountPrompt />;
}