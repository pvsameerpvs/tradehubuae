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
      <div className="flex h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span className="text-sm text-ink-2">Verifying session...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
