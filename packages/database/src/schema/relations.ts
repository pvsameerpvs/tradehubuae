import { relations } from "drizzle-orm";
import { users } from "./users";
import { profiles } from "./users";
import { sessions } from "./users";
import { activityLogs } from "./users";
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
import { notifications } from "./notifications";
import { bulkRequests, bulkRequestItems } from "./bulk-sales";
import { chatSessions, chatMessages } from "./chat";

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
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id], relationName: "CategoryHierarchy" }),
  children: many(categories, { relationName: "CategoryHierarchy" }),
  products: many(productCategories),
  attributes: many(categoryAttributes),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const usesRelations = relations(uses, ({ many }) => ({
  products: many(products),
}));

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
}));

export const stockRelations = relations(stock, ({ one }) => ({
  warehouse: one(warehouses, { fields: [stock.warehouseId], references: [warehouses.id] }),
  product: one(products, { fields: [stock.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [stock.variantId], references: [productVariants.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  payment: many(payments),
  shipments: many(shipments),
  return: many(returns),
  notifications: many(notifications),
  shippingAddress: one(addresses, { fields: [orders.shippingAddressId], references: [addresses.id], relationName: "ShippingAddress" }),
  billingAddress: one(addresses, { fields: [orders.billingAddressId], references: [addresses.id], relationName: "BillingAddress" }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [orderItems.variantId], references: [productVariants.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const comboOffersRelations = relations(comboOffers, ({ many }) => ({
  items: many(comboOfferItems),
}));

export const comboOfferItemsRelations = relations(comboOfferItems, ({ one }) => ({
  offer: one(comboOffers, { fields: [comboOfferItems.offerId], references: [comboOffers.id] }),
  product: one(products, { fields: [comboOfferItems.productId], references: [products.id] }),
}));

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

export const bulkRequestsRelations = relations(bulkRequests, ({ many }) => ({
  items: many(bulkRequestItems),
}));

export const bulkRequestItemsRelations = relations(bulkRequestItems, ({ one }) => ({
  request: one(bulkRequests, { fields: [bulkRequestItems.bulkRequestId], references: [bulkRequests.id] }),
  product: one(products, { fields: [bulkRequestItems.productId], references: [products.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  order: one(orders, { fields: [notifications.orderId], references: [orders.id] }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [cartItems.variantId], references: [productVariants.id] }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, { fields: [wishlistItems.userId], references: [users.id] }),
  product: one(products, { fields: [wishlistItems.productId], references: [products.id] }),
}));

export const stockTransfersRelations = relations(stockTransfers, ({ one, many }) => ({
  fromWarehouse: one(warehouses, { fields: [stockTransfers.fromWarehouseId], references: [warehouses.id], relationName: "SourceWarehouse" }),
  toWarehouse: one(warehouses, { fields: [stockTransfers.toWarehouseId], references: [warehouses.id], relationName: "DestinationWarehouse" }),
  items: many(stockTransferItems),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  user: one(users, { fields: [chatSessions.userId], references: [users.id] }),
  assignedAdmin: one(users, { fields: [chatSessions.assignedAdminId], references: [users.id], relationName: "AssignedAdmin" }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, { fields: [chatMessages.sessionId], references: [chatSessions.id] }),
  admin: one(users, { fields: [chatMessages.adminId], references: [users.id] }),
}));
