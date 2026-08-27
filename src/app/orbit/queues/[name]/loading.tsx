import { Skeleton, SkeletonTable } from "@/components/ui";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-4 border-y border-base-300 py-4 sm:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2 px-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-10" />
          </div>
        ))}
      </div>
      <SkeletonTable rows={6} columns={6} />
    </div>
  );
}
