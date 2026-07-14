import { z } from "zod";

export const phoneSchema = z.string().regex(/^(\+971|00971|0)?5[0-9]{8}$/, "Invalid UAE phone number");

export const emailSchema = z.string().email("Invalid email address").min(1).max(255);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const uuidSchema = z.string().uuid("Invalid UUID");

export const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const priceSchema = z.number().min(0, "Price must be non-negative").max(9999999);

export const skuSchema = z.string().regex(/^TH-[A-Z]{3}-[A-Z]{3}-\d{6}$/, "Invalid SKU format");

export const urlSchema = z.string().url("Invalid URL");

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  condition: z.enum(["New", "Like New", "Excellent", "Good", "Fair"]).optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "popular", "rating"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  phone: phoneSchema,
  addressLine1: z.string().min(1, "Address is required").max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(100),
  emirate: z.enum([
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
  ]),
  country: z.string().default("UAE"),
  zipCode: z.string().max(20).optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(1, "Product name is required").max(500),
  description: z.string().min(1, "Description is required").max(10000),
  categoryId: uuidSchema,
  brandId: uuidSchema.optional(),
  condition: z.enum(["New", "Like New", "Excellent", "Good", "Fair"]),
  price: priceSchema,
  compareAtPrice: priceSchema.optional(),
  costPrice: priceSchema.optional(),
  sku: skuSchema.optional(),
  barcode: z.string().max(100).optional(),
  weight: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  depth: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  metaKeywords: z.string().max(255).optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const orderCreateSchema = z.object({
  items: z
    .array(
      z.object({
        productVariantId: uuidSchema,
        quantity: z.number().int().positive(),
        unitPrice: priceSchema,
      }),
    )
    .min(1, "At least one item is required"),
  contactName: z.string().min(1, "Name is required").max(255),
  contactPhone: phoneSchema,
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  shippingMethod: z.enum(["standard", "express", "next_day"]),
  paymentMethod: z.enum(["cod", "card"]),
  notes: z.string().max(1000).optional(),
  couponCode: z.string().max(50).optional(),
});

export const bulkRequestSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(255),
  contactName: z.string().min(1, "Contact name is required").max(255),
  email: emailSchema,
  phone: phoneSchema,
  items: z
    .array(
      z.object({
        productId: uuidSchema,
        quantity: z.number().int().positive(),
        targetPrice: priceSchema.optional(),
      }),
    )
    .min(1, "At least one item is required"),
  message: z.string().max(5000).optional(),
});

export const reviewCreateSchema = z.object({
  productId: uuidSchema,
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional(),
  content: z.string().max(5000).optional(),
  pros: z.array(z.string().max(500)).max(10).optional(),
  cons: z.array(z.string().max(500)).max(10).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type BulkRequestInput = z.infer<typeof bulkRequestSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
