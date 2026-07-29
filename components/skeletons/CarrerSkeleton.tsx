"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/Card";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-white/10 ${className}`}
    aria-hidden="true"
  />
);

export default function CareerSkeleton() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Overall Score */}
        <Card className="bg-[#08051e]/40 lg:col-span-2">
          <CardHeader className="space-y-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>

          <CardContent className="grid grid-cols-1 items-center gap-6 pt-4 sm:grid-cols-3">
            {/* Circular Score */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/2 p-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="mt-4 h-3 w-20" />
            </div>

            {/* Radar Chart */}
            <div className="sm:col-span-2">
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-white/5 pt-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </CardFooter>
        </Card>

        {/* Readiness Gauges */}
        <Card className="bg-[#08051e]/40">
          <CardHeader className="space-y-3">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>

          <CardContent className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-10" />
                </div>

                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}

            <div className="h-px bg-white/5" />

            <div className="flex justify-between">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Missing Skills */}
        <Card className="bg-[#08051e]/40 lg:col-span-2">
          <CardHeader className="space-y-3">
            <Skeleton className="h-3 w-44" />
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>

          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 p-4"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>

                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-[#08051e]/40">
          <CardHeader className="space-y-3">
            <Skeleton className="h-3 w-44" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-52" />
          </CardHeader>

          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="mt-1 h-4 w-4 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </CardContent>

          <CardFooter>
            <Skeleton className="h-11 w-full rounded-xl" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}