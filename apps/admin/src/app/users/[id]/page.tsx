"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Shield, Mail, Calendar, User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-50 text-purple-700",
  ADMIN: "bg-brand/10 text-brand",
  CONTENT_MANAGER: "bg-blue-50 text-blue-700",
  SALES_MANAGER: "bg-cyan-50 text-cyan-700",
  INVENTORY_MANAGER: "bg-amber-50 text-amber-700",
  SEO_MANAGER: "bg-rose-50 text-rose-700",
  CUSTOMER: "bg-bg2 text-ink-2",
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<User>(`/users/${params.id}`)
      .then(setUser)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load user"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="space-y-6">
      <div className="h-4 w-16 animate-pulse rounded bg-bg2" />
      <div className="h-40 animate-pulse rounded-xl bg-bg2" />
      <div className="h-32 animate-pulse rounded-xl bg-bg2" />
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <Shield className="h-10 w-10 text-sale" strokeWidth={1.75} />
      <p className="text-sm text-sale">{error}</p>
      <button onClick={() => router.back()} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
        Go Back
      </button>
    </div>
  );
  if (!user) return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <UserIcon className="h-10 w-10 text-ink-3" strokeWidth={1.75} />
      <p className="text-sm font-medium text-ink-2">User not found</p>
      <button onClick={() => router.back()} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
        Go Back
      </button>
    </div>
  );

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back
      </button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-lg font-semibold text-white">
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>{user.name}</h1>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[user.role] ?? "bg-bg2 text-ink-3"}`}>
                  {user.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
            <span className="text-ink">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
            <span className="text-ink capitalize">{user.role}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
            <span className="text-ink">Joined {new Date(user.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={() => router.push(`/users/${user.id}/edit`)}>Edit User</Button>
      </div>
    </div>
  );
}
