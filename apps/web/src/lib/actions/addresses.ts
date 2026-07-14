"use server";

import { api, ApiError } from "@/lib/api";

export interface AddressData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  emirate: string;
  country: string;
  zipCode?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  emirate: string;
  country?: string;
  zipCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {}

export async function getAddresses(): Promise<AddressData[]> {
  const res = await api.get<{ data: AddressData[] }>("/addresses");
  return res.data ?? [];
}

export async function createAddress(input: CreateAddressInput): Promise<AddressData> {
  return api.post<AddressData>("/addresses", {
    ...input,
    country: input.country || "UAE",
  });
}

export async function updateAddress(id: string, input: UpdateAddressInput): Promise<AddressData> {
  return api.put<AddressData>(`/addresses/${id}`, input);
}

export async function deleteAddress(id: string): Promise<void> {
  await api.delete(`/addresses/${id}`);
}

export async function setDefaultAddress(id: string): Promise<AddressData> {
  return api.put<AddressData>(`/addresses/${id}/default`, {});
}

export { ApiError };
