import Link from "next/link";
import { Button } from "@tradehubuae/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <p className="text-8xl font-bold text-primary">404</p>
      <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button size="lg">Go Home</Button>
        </Link>
        <Link href="/categories">
          <Button size="lg" variant="outline">Browse Products</Button>
        </Link>
      </div>
    </div>
  );
}
