"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, type PaginatedResponse } from "@/lib/api";
import { Plus } from "lucide-react";
import { Button } from "@tradehubuae/ui";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<User>>("/users", { limit: 50, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const roleStyles: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-50 text-purple-700",
    ADMIN: "bg-brand/10 text-brand",
    CONTENT_MANAGER: "bg-blue-50 text-blue-700",
    SALES_MANAGER: "bg-cyan-50 text-cyan-700",
    INVENTORY_MANAGER: "bg-amber-50 text-amber-700",
    SEO_MANAGER: "bg-rose-50 text-rose-700",
    CUSTOMER: "bg-bg2 text-ink-2",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Users & Roles</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage admin accounts and permissions</p>
        </div>
        <Button onClick={() => router.push("/users/new")}>
          <Plus className="mr-1.5 h-4 w-4" strokeWidth={2} />
          Add User
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-bg2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-bg2" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-bg2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No users yet</p>
            <p className="mt-1 text-xs text-ink-3">User accounts will appear here.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((user) => (
                <div key={user.id} onClick={() => router.push(`/users/${user.id}`)} className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-bg2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <span className="text-xs font-bold text-brand">{user.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${roleStyles[user.role] ?? "bg-bg2 text-ink-3"}`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </div>
                    <p className="truncate text-xs text-ink-3">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((user) => (
                  <tr key={user.id} onClick={() => router.push(`/users/${user.id}`)} className="cursor-pointer border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                          <span className="text-xs font-bold text-brand">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{user.name}</p>
                          <p className="text-xs text-ink-3">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[user.role] ?? "bg-bg2 text-ink-3"}`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ink-2">
                      {new Date(user.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
