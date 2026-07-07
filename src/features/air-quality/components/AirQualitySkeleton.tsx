function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#1E3A46] rounded-lg ${className}`} />;
}

export function AirQualitySkeleton() {
  return (
    <div className="bg-[#0A0E14] p-5 rounded-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}