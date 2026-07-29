"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/Card";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-white/10 ${className}`}
    aria-hidden="true"
  />
);

export default function RoadmapsSkeleton() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <Skeleton className="h-11 w-56 rounded-xl" />
      </div>

      {/* Progress Card */}
      <Card className="bg-[#08051e]/40">
        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          <div className="space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-56" />
          </div>

          <div className="space-y-3 md:col-span-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>

            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative space-y-8 pl-8 before:absolute before:left-[15px] before:top-0 before:bottom-0 before:w-[2px] before:bg-white/5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative">
            {/* Timeline Circle */}
            <Skeleton className="absolute -left-[28px] top-4 h-6 w-6 rounded-full" />

            <Card className="bg-[#08051e]/30">
              <CardHeader className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>

                <Skeleton className="h-7 w-72" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 rounded-xl border border-white/5 p-3"
                    >
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-44 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}