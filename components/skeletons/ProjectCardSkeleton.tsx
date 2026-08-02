import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function ProjectCardSkeleton() {
  return (
    <Card className="bg-[#08051e]/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-full w-full">
      <div className="space-y-5">
        {/* Badges and Duration */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title and Category */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>

        {/* Progress */}
        <div className="space-y-2 rounded-xl border border-white/5 p-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>

        {/* Resume Score */}
        <div className="rounded-xl border border-white/5 p-3">
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          {Array.from({ length: 3 }).map((_, skill) => (
            <div key={skill} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 border-t border-white/5 pt-5">
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </Card>
  );
}
