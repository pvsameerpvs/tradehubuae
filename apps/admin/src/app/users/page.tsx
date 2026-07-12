import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
};

export default function UsersPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Users & Roles</h1>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6">
          <p className="text-muted-foreground">User management with role-based access control will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
