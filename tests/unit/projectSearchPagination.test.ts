import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserProjects } from '@/app/actions/projectActions';
import { prisma } from '@/lib/prisma';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => Promise.resolve({ userId: 'mock-developer-id' })),
}));

// Mock Prisma Client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    project: {
      findMany: vi.fn(),
    },
  },
}));

describe('getUserProjects Search, Filtering, and Pagination', () => {
  const mockDbUser = { id: 'db-user-id', clerkId: 'mock-developer-id' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('applies search filters for title and tags', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockDbUser as any);
    vi.mocked(prisma.project.findMany).mockResolvedValue([]);

    await getUserProjects(10, 0, 'React');

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'db-user-id',
        OR: [
          { title: { contains: 'React', mode: 'insensitive' } },
          { tags: { has: 'React' } },
        ],
      },
      take: 10,
      skip: 0,
      include: {
        activities: { orderBy: { createdAt: 'desc' } },
        milestones: { orderBy: { dueDate: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  });

  it('filters by status correctly', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockDbUser as any);
    vi.mocked(prisma.project.findMany).mockResolvedValue([]);

    await getUserProjects(20, 5, undefined, 'Completed');

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'db-user-id',
        status: 'Completed',
      },
      take: 20,
      skip: 5,
      include: {
        activities: { orderBy: { createdAt: 'desc' } },
        milestones: { orderBy: { dueDate: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  });

  it('uses default pagination values when parameters are omitted', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockDbUser as any);
    vi.mocked(prisma.project.findMany).mockResolvedValue([]);

    await getUserProjects();

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { userId: 'db-user-id' },
      take: 20,
      skip: 0,
      include: {
        activities: { orderBy: { createdAt: 'desc' } },
        milestones: { orderBy: { dueDate: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  });
});
