import { relations } from "drizzle-orm";
import { users, profiles, sessions, activityLogs } from "./users";
import { addresses } from "./addresses";
import { categories, categoryAttributes } from "./categories";
import { brands } from "./brands";
import { uses } from "./uses";
import {
  products, productCategories, productImages, productSpecs, productVariants,
} from "./products";
import { warehouses, stock, stockHistory, stockTransfers, stockTransferItems, inventoryLogs } from "./inventory";
import { orders, orderItems, payments, shipments, returns } from "./orders";
import { cartItems, wishlistItems } from "./cart";
import { reviews } from "./reviews";
import { coupons, couponProducts, comboOffers, comboOfferItems } from "./marketing";
import { blogPosts, blogPostProducts, blogTags, blogPostTags } from "./blog";
import { seoMetadata, redirects } from "./seo";
import { notifications } from "./notifications";
import { bulkRequests, bulkRequestItems } from "./bulk-sales";
import { chatSessions, chatMessages } from "./chat";
import { analyticsEvents, pageViews, searchLogs } from "./analytics";

// ── Users ──
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
  cartItems: many(cartItems),
  sessions: many(sessions),
  activityLogs: many(activityLogs),
  blogPosts: many(blogPosts),
  notifications: many(notifications),
  chatSessions: many(chatSessions),
  assignedChats: many(chatSessions, { relationName: "AssignedAdmin" }),
  closedChats: many(chatSessions, { relationName: "ClosedBy" }),
  sentMessages: many(chatMessages),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
}));

// ── Addresses ──
export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

// ── Categories ──
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id], relationName: "CategoryHierarchy" }),
  children: many(categories, { relationName: "CategoryHierarchy" }),
  products: many(productCategories),
  attributes: many(categoryAttributes),
}));

export const categoryAttributesRelations = relations(categoryAttributes, ({ one }) => ({
  category: one(categories, { fields: [categoryAttributes.categoryId], references: [categories.id] }),
}));

// ── Brands ──
export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

// ── Uses ──
export const usesRelations = relations(uses, ({ many }) => ({
  products: many(products),
}));

// ── Products ──
export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  use: one(uses, { fields: [products.useId], references: [uses.id] }),
  categories: many(productCategories),
  images: many(productImages),
  specs: many(productSpecs),
  variants: many(productVariants),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  stock: many(stock),
  comboOfferItems: many(comboOfferItems),
  couponProducts: many(couponProducts),
  bulkRequestItems: many(bulkRequestItems),
  blogPosts: many(blogPostProducts),
  stockHistory: many(stockHistory),
}));

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
  product: one(products, { fields: [productCategories.productId], references: [products.id] }),
  category: one(categories, { fields: [productCategories.categoryId], references: [categories.id] }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const productSpecsRelations = relations(productSpecs, ({ one }) => ({
  product: one(products, { fields: [productSpecs.productId], references: [products.id] }),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
  stockHistory: many(stockHistory),
  stockItems: many(stock),
  transferItems: many(stockTransferItems),
}));

// ── Inventory ──
export const warehousesRelations = relations(warehouses, ({ many }) => ({
  stock: many(stock),
  stockHistory: many(stockHistory),
  inventoryLogs: many(inventoryLogs),
  outgoingTransfers: many(stockTransfers, { relationName: "SourceWarehouse" }),
  incomingTransfers: many(stockTransfers, { relationName: "DestinationWarehouse" }),
}));

export const stockRelations = relations(stock, ({ one }) => ({
  warehouse: one(warehouses, { fields: [stock.warehouseId], references: [warehouses.id] }),
  product: one(products, { fields: [stock.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [stock.variantId], references: [productVariants.id] }),
}));

export const stockHistoryRelations = relations(stockHistory, ({ one }) => ({
  product: one(products, { fields: [stockHistory.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [stockHistory.variantId], references: [productVariants.id] }),
  warehouse: one(warehouses, { fields: [stockHistory.warehouseId], references: [warehouses.id] }),
}));

export const stockTransfersRelations = relations(stockTransfers, ({ one, many }) => ({
  fromWarehouse: one(warehouses, { fields: [stockTransfers.fromWarehouseId], references: [warehouses.id], relationName: "SourceWarehouse" }),
  toWarehouse: one(warehouses, { fields: [stockTransfers.toWarehouseId], references: [warehouses.id], relationName: "DestinationWarehouse" }),
  items: many(stockTransferItems),
}));

export const stockTransferItemsRelations = relations(stockTransferItems, ({ one }) => ({
  transfer: one(stockTransfers, { fields: [stockTransferItems.transferId], references: [stockTransfers.id] }),
  variant: one(productVariants, { fields: [stockTransferItems.variantId], references: [productVariants.id] }),
}));

export const inventoryLogsRelations = relations(inventoryLogs, ({ one }) => ({
  warehouse: one(warehouses, { fields: [inventoryLogs.warehouseId], references: [warehouses.id] }),
}));

// ── Orders ──
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  payment: many(payments),
  shipments: many(shipments),
  orderReturns: many(returns),
  notifications: many(notifications),
  shippingAddress: one(addresses, { fields: [orders.shippingAddressId], references: [addresses.id], relationName: "ShippingAddress" }),
  billingAddress: one(addresses, { fields: [orders.billingAddressId], references: [addresses.id], relationName: "BillingAddress" }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [orderItems.variantId], references: [productVariants.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, { fields: [shipments.orderId], references: [orders.id] }),
}));

export const returnsRelations = relations(returns, ({ one }) => ({
  order: one(orders, { fields: [returns.orderId], references: [orders.id] }),
}));

// ── Reviews ──
export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

// ── Cart / Wishlist ──
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [cartItems.variantId], references: [productVariants.id] }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, { fields: [wishlistItems.userId], references: [users.id] }),
  product: one(products, { fields: [wishlistItems.productId], references: [products.id] }),
}));

// ── Marketing (Coupons / Combo Offers) ──
export const couponsRelations = relations(coupons, ({ many }) => ({
  products: many(couponProducts),
}));

export const couponProductsRelations = relations(couponProducts, ({ one }) => ({
  coupon: one(coupons, { fields: [couponProducts.couponId], references: [coupons.id] }),
  product: one(products, { fields: [couponProducts.productId], references: [products.id] }),
}));

export const comboOffersRelations = relations(comboOffers, ({ many }) => ({
  items: many(comboOfferItems),
}));

export const comboOfferItemsRelations = relations(comboOfferItems, ({ one }) => ({
  offer: one(comboOffers, { fields: [comboOfferItems.offerId], references: [comboOffers.id] }),
  product: one(products, { fields: [comboOfferItems.productId], references: [products.id] }),
}));

// ── Blog ──
export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
  products: many(blogPostProducts),
  postTags: many(blogPostTags),
}));

export const blogPostProductsRelations = relations(blogPostProducts, ({ one }) => ({
  blogPost: one(blogPosts, { fields: [blogPostProducts.blogPostId], references: [blogPosts.id] }),
  product: one(products, { fields: [blogPostProducts.productId], references: [products.id] }),
}));

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  postTags: many(blogPostTags),
}));

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  blogPost: one(blogPosts, { fields: [blogPostTags.blogPostId], references: [blogPosts.id] }),
  tag: one(blogTags, { fields: [blogPostTags.tagId], references: [blogTags.id] }),
}));

// ── SEO ──
export const seoMetadataRelations = relations(seoMetadata, () => ({}));

export const redirectsRelations = relations(redirects, () => ({}));

// ── Notifications ──
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  order: one(orders, { fields: [notifications.orderId], references: [orders.id] }),
}));

// ── Bulk Sales ──
export const bulkRequestsRelations = relations(bulkRequests, ({ one, many }) => ({
  user: one(users, { fields: [bulkRequests.userId], references: [users.id] }),
  items: many(bulkRequestItems),
}));

export const bulkRequestItemsRelations = relations(bulkRequestItems, ({ one }) => ({
  request: one(bulkRequests, { fields: [bulkRequestItems.bulkRequestId], references: [bulkRequests.id] }),
  product: one(products, { fields: [bulkRequestItems.productId], references: [products.id] }),
}));

// ── Chat ──
export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  user: one(users, { fields: [chatSessions.userId], references: [users.id] }),
  assignedAdmin: one(users, { fields: [chatSessions.assignedAdminId], references: [users.id], relationName: "AssignedAdmin" }),
  closedByUser: one(users, { fields: [chatSessions.closedBy], references: [users.id], relationName: "ClosedBy" }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, { fields: [chatMessages.sessionId], references: [chatSessions.id] }),
  admin: one(users, { fields: [chatMessages.adminId], references: [users.id] }),
}));

// ── Analytics ──
export const analyticsEventsRelations = relations(analyticsEvents, () => ({}));

export const pageViewsRelations = relations(pageViews, () => ({}));

export const searchLogsRelations = relations(searchLogs, () => ({}));
