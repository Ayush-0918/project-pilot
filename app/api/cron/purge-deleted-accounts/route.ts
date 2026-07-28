import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Accounts are permanently purged this many days after they are soft-deleted.
const RECOVERY_WINDOW_DAYS = 30;

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');

  // Only Vercel Cron (or another trusted caller holding CRON_SECRET) may run this.
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RECOVERY_WINDOW_DAYS);

    // The onDelete: Cascade relations on Project/Notification/Activity/
    // Subscription/AiMessage take care of removing each user's related data.
    const result = await prisma.user.deleteMany({
      where: {
        deletedAt: {
          not: null,
          lt: cutoff,
        },
      },
    });

    return NextResponse.json({ purged: result.count });
  } catch (error) {
    console.error('[CRON_PURGE_DELETED_ACCOUNTS]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}