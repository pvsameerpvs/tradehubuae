export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse rounded-lg bg-bg2" />
          <div className="h-4 w-32 animate-pulse rounded-lg bg-bg2" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-lg bg-bg2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-bg2" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-bg2" />
    </div>
  );
}
