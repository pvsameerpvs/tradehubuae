import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <FileQuestion className="h-10 w-10 text-ink-3" strokeWidth={1.75} />
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-xl" style={{ letterSpacing: "-0.01em" }}>Page not found</h1>
          <p className="mt-1 text-sm text-ink-2">The page you&apos;re looking for doesn&apos;t exist.</p>
        </div>
        <Link href="/dashboard" className="inline-flex h-10 items-center rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
