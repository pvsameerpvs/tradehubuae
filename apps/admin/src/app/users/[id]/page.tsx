"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Shield, Mail, Calendar } from "lucide-react";
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
  admin: "bg-violet-50 text-violet-700",
  manager: "bg-blue-50 text-blue-700",
  staff: "bg-amber-50 text-amber-700",
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

  if (loading) return <p className="text-sm text-ink-2">Loading user...</p>;
  if (error) return <p className="text-sm text-sale">{error}</p>;
  if (!user) return <p className="text-sm text-ink-2">User not found</p>;

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
