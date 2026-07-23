import Link from "next/link";
import { Button } from "@tradehubuae/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <img src="/404-oops.gif" alt="Page not found" className="mb-6 h-48 w-48 object-contain" />
      <p className="text-xl text-ink-2">Page not found</p>
      <p className="mt-2 text-sm text-ink-2">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link href="/" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto">Go Home</Button>
        </Link>
        <Link href="/categories" className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">Browse Products</Button>
        </Link>
      </div>
    </div>
  );
}
