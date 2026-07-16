"use server";

import { api } from "@/lib/api";

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContact(data: ContactInput): Promise<{ success: boolean }> {
  try {
    await api.post("/contact", data);
    return { success: true };
  } catch {
    return { success: false };
  }
}
