"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/login"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) {
      setLoading(false);
      return;
    }

    // TODO: Replace with real JWT check from @tradehubuae/auth
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="flex h-dvh flex-col p-4">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-bg2" />
          <div className="h-5 w-32 animate-pulse rounded bg-bg2" />
        </div>
        <div className="mt-8 flex-1 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-bg2" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-bg2" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-bg2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
