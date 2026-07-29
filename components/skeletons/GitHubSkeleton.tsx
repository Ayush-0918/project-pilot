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

export default function GitHubSkeleton() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main Stats */}
        <Card className="bg-[#08051e]/40 lg:col-span-3">
          <CardHeader className="space-y-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-6 w-52" />
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-6 pt-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-3 w-24" />
                {index >= 2 && (
                  <Skeleton className="mt-2 h-2 w-full rounded-full" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Language Chart */}
        <Card className="bg-[#08051e]/40">
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>

          <CardContent className="flex h-[140px] items-center justify-center">
            <Skeleton className="h-28 w-28 rounded-full" />
          </CardContent>

          <CardFooter className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-5 w-14 rounded-full"
              />
            ))}
          </CardFooter>
        </Card>
      </div>

      {/* Recruiter + Skills */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recruiter Insights */}
        <Card className="bg-[#08051e]/40">
          <CardHeader className="space-y-3">
            <Skeleton className="h-3 w-44" />
            <Skeleton className="h-6 w-56" />
          </CardHeader>

          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-white/5 p-4"
              >
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills + Recommendations */}
        <div className="space-y-6">
          <Card className="bg-[#08051e]/40">
            <CardHeader className="space-y-3">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-6 w-40" />
            </CardHeader>

            <CardContent className="flex flex-wrap gap-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-7 w-20 rounded-full"
                />
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#08051e]/40">
            <CardHeader className="space-y-3">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-6 w-56" />
            </CardHeader>

            <CardContent className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Repository Intelligence */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-64" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card
              key={index}
              className="flex flex-col justify-between bg-[#0a071a]/50 border-white/5"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-14" />
                </div>

                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-3 w-28" />

                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="space-y-2 border-t border-white/5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}