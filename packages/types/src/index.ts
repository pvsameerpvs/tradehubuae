export type UUID = string;
export type Slug = string;
export type Email = string;
export type URL = string;
export type Price = number;
export type Currency = "AED" | "USD";
export type Condition = "New" | "Like New" | "Excellent" | "Good" | "Fair";
export type Timestamp = string;

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface SearchParams {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: Condition;
  inStock?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "popular" | "rating";
  page?: number;
  limit?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
