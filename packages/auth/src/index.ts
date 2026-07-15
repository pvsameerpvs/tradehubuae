import type { Role, Permission } from "@tradehubuae/config";

export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission,
): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[],
): boolean {
  return requiredPermissions.some((p) => userPermissions.includes(p));
}

export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[],
): boolean {
  return requiredPermissions.every((p) => userPermissions.includes(p));
}

export function getUserRole(userPermissions: Permission[]): Role {
  if (hasPermission(userPermissions, "users:manage")) return "SUPER_ADMIN";
  if (hasPermission(userPermissions, "settings:manage")) return "ADMIN";
  if (hasPermission(userPermissions, "inventory:read")) return "INVENTORY_MANAGER";
  if (hasPermission(userPermissions, "orders:read")) return "SALES_MANAGER";
  if (hasPermission(userPermissions, "blog:create")) return "CONTENT_MANAGER";
  if (hasPermission(userPermissions, "seo:manage")) return "SEO_MANAGER";
  return "CUSTOMER";
}

export type { Role, Permission };
