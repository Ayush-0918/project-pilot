import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-lg bg-white/10 ${className}`} />
);

export default function SettingsSkeleton() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile */}
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <Skeleton className="h-20 w-20 rounded-full" />

                <div className="flex-1 space-y-3 w-full">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-64" />
                  <Skeleton className="h-9 w-36 rounded-xl" />
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                ))}
              </div>

              {/* Portfolio */}
              <div className="rounded-xl border border-white/10 p-4 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>

                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-xl" />

                <div className="flex gap-2">
                  <Skeleton className="h-9 w-28 rounded-xl" />
                  <Skeleton className="h-9 w-32 rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end">
                <Skeleton className="h-11 w-48 rounded-xl" />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-7 w-20 rounded-full"
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>

              <Skeleton className="h-36 w-full rounded-xl" />

              <div className="flex justify-end">
                <Skeleton className="h-11 w-44 rounded-xl" />
              </div>
            </CardContent>
          </Card>

          {/* Professional Links */}
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>

            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Appearance */}
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-52" />
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-28 rounded-xl"
                  />
                ))}
              </div>

              <div className="flex gap-3 flex-wrap">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-10 w-10 rounded-full"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>

            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton
                  key={i}
                  className="h-24 w-full rounded-xl"
                />
              ))}
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>

            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton
                  key={i}
                  className="h-32 w-full rounded-xl"
                />
              ))}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>

            <CardContent className="space-y-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}