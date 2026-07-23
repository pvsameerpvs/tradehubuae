export default function Loading() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse rounded-lg bg-bg2" />
          <div className="h-4 w-32 animate-pulse rounded-lg bg-bg2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-line p-4">
            <div className="aspect-square animate-pulse rounded-lg bg-bg2" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-bg2" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-bg2" />
          </div>
        ))}
      </div>
    </div>
  );
}
