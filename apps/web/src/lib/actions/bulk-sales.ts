"use server";

import { api, ApiError } from "@/lib/api";

export interface BulkSalesInput {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
}

export async function submitBulkInquiry(
  data: BulkSalesInput,
): Promise<{ success: boolean; error?: string }> {
  if (!data.companyName || !data.contactName || !data.email || !data.phone) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    await api.post("/bulk-sales", data);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof ApiError
        ? err.message
        : "Something went wrong. Please try again.";
    return { success: false, error: message };
  }
}
