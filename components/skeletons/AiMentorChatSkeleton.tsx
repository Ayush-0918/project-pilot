"use client";


const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-white/10 ${className}`}
    aria-hidden="true"
  />
);

export default function AiMentorChatSkeleton() {
  return (
    <div className="flex h-[80vh] overflow-hidden rounded-3xl border border-white/10">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r border-white/10 bg-[#08051e]/40 md:flex">
        <div className="border-b border-white/10 p-4">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        <div className="flex-1 space-y-3 p-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>

              <Skeleton className="h-4 w-4 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex flex-1 flex-col bg-[#08051e]/20">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          {/* Assistant */}
          <div className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />

            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* User */}
          <div className="flex justify-end gap-4">
            <div className="space-y-3">
              <Skeleton className="ml-auto h-4 w-64" />
              <Skeleton className="ml-auto h-4 w-48" />
            </div>

            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Assistant with code block */}
          <div className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />

            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          </div>

          {/* Another assistant */}
          <div className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />

            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap gap-2 px-6 pb-3">
          <Skeleton className="h-10 w-52 rounded-xl" />
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-10 w-56 rounded-xl" />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-6">
          <Skeleton className="h-24 w-full rounded-2xl" />

          <div className="mt-4 flex justify-end gap-2">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}