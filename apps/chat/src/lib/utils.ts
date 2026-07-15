import { format, isToday, isYesterday, differenceInDays } from "date-fns";

export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday " + format(d, "h:mm a");
  if (differenceInDays(new Date(), d) < 7) return format(d, "EEEE h:mm a");
  return format(d, "dd/MM/yy");
}

export function formatShortTime(iso: string): string {
  const d = new Date(iso);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "dd/MM/yy");
}

export function formatMessageTime(iso: string): string {
  return format(new Date(iso), "h:mm a");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getDisplayName(session: {
  userName: string;
  userEmail: string;
  userPhone?: string;
}): string {
  return session.userName || session.userEmail || session.userPhone || "Unknown";
}

const AVATAR_COLORS = [
  "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-orange-600",
  "bg-pink-600", "bg-teal-600", "bg-indigo-600", "bg-rose-600",
  "bg-cyan-600", "bg-amber-600", "bg-violet-600", "bg-lime-600",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarColor(name: string, email: string): string {
  const key = name || email || "?";
  return AVATAR_COLORS[hashString(key) % AVATAR_COLORS.length] || "bg-brand";
}

export function getContactInfo(session: {
  userEmail: string;
  userPhone?: string;
}): string | null {
  if (session.userEmail) return session.userEmail;
  if (session.userPhone) return session.userPhone;
  return null;
}
