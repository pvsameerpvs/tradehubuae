import React from "react";
import { searchProducts, compareProducts, wishlistItems, defaultSpecs } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { orders } from "@/data/orders";
import { blogPosts } from "@/data/blog";
import { promoCodes } from "@/data/promoCodes";
import { defaultBulkTiers } from "@/data/bulkPricing";
import { bulkBenefits, industries, aboutStats } from "@/data/benefits";
import { Package, ShoppingCart, Tags, Users, Newspaper, BadgePercent, Layers, Building2, Gift, Star } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-2">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-ink" style={{ letterSpacing: "-0.01em" }}>{value}</p>
          {sub && <p className="mt-0.5 text-xs text-ink-3">{sub}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
          <Icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-baseline gap-2 border-b border-line pb-3">
      <h2 className="text-lg font-semibold text-ink" style={{ letterSpacing: "-0.01em" }}>{title}</h2>
      <span className="text-sm text-ink-3">({count})</span>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-bg2">
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0 hover:bg-bg2/50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-ink">
                  {cell === null || cell === undefined ? <span className="text-ink-3">—</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BadgePill({ text, variant }: { text: string; variant?: "brand" | "emerald" | "amber" | "red" | "slate" }) {
  const colors = {
    brand: "bg-brand/10 text-brand",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${colors[variant ?? "slate"]}`}>
      {text}
    </span>
  );
}

export default function DashboardPage() {
  const productCount = searchProducts.length;
  const categoryCount = categories.length;
  const brandCount = brands.length;
  const orderCount = orders.length;
  const blogCount = blogPosts.length;
  const promoCount = promoCodes.length;
  const tierCount = defaultBulkTiers.length;
  const benefitCount = bulkBenefits.length;

  const totalProductValue = searchProducts.reduce((s, p) => s + p.price, 0);
  const totalOrderValue = orders.reduce((s, o) => s + o.total, 0);
  const totalStock = searchProducts.reduce((s, p) => s + (p.stock ?? 0), 0);
  const avgRating = searchProducts.reduce((s, p) => s + (p.rating ?? 0), 0) / searchProducts.filter((p) => p.rating).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>
          Data Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink-2">
          Complete overview of all front-end data — every field exposed
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard icon={Package} label="Products" value={String(productCount)} sub={`${totalStock} total stock · AED ${totalProductValue.toLocaleString()} combined value`} />
        <StatCard icon={Tags} label="Categories" value={String(categoryCount)} />
        <StatCard icon={Building2} label="Brands" value={String(brandCount)} />
        <StatCard icon={ShoppingCart} label="Orders" value={String(orderCount)} sub={`AED ${totalOrderValue.toLocaleString()} total revenue`} />
        <StatCard icon={Newspaper} label="Blog Posts" value={String(blogCount)} />
        <StatCard icon={BadgePercent} label="Promo Codes" value={String(promoCount)} />
        <StatCard icon={Layers} label="Bulk Tiers" value={String(tierCount)} sub={`${defaultBulkTiers[0]?.discountPercent}% to ${defaultBulkTiers[defaultBulkTiers.length - 1]?.discountPercent}%`} />
        <StatCard icon={Gift} label="Bulk Benefits" value={String(benefitCount)} />
        <StatCard icon={Star} label="Avg Rating" value={avgRating ? avgRating.toFixed(1) : "—"} />
        <StatCard icon={Users} label="Industries" value={String(industries.length)} />
      </div>

      {/* Products */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="Products" count={productCount} />
        <Table
          headers={["Name", "Price", "Original Price", "Category", "Slug", "Badge", "Stock", "Rating", "Reviews", "Specs", "GPU", "In Stock"]}
          rows={searchProducts.map((p) => [
            p.name,
            `AED ${p.price.toLocaleString()}`,
            p.originalPrice ? `AED ${p.originalPrice.toLocaleString()}` : null,
            p.category,
            p.slug,
            p.badge ?? null,
            p.stock ?? null,
            p.rating ?? null,
            p.reviewCount ?? null,
            p.specs ?? null,
            p.gpu ?? null,
            p.inStock === undefined ? (p.stock ?? 0) > 0 : p.inStock,
          ])}
        />
        <div className="flex gap-6 text-xs text-ink-3">
          <span>Compare products: {compareProducts.length} products</span>
          <span>Wishlist items: {wishlistItems.length} products</span>
          <span>Default specs: {defaultSpecs.length} specs</span>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="Categories" count={categoryCount} />
        <Table
          headers={["Name", "Slug", "Description", "Product Count"]}
          rows={categories.map((c) => [c.name, c.slug, c.desc, c.count])}
        />
      </section>

      {/* Brands */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="Brands" count={brandCount} />
        <Table
          headers={["Name", "Slug", "Description"]}
          rows={brands.map((b) => [b.name, b.slug, b.description])}
        />
      </section>

      {/* Orders */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="Orders" count={orderCount} />
        <Table
          headers={["ID", "Date", "Status", "Total", "Items"]}
          rows={orders.map((o) => [
            o.id,
            o.date,
            <BadgePill key={o.id} text={o.status} variant={o.status === "Delivered" ? "emerald" : o.status === "Shipped" ? "brand" : o.status === "Processing" ? "amber" : "red"} />,
            `AED ${o.total.toLocaleString()}`,
            o.items.map((i) => `${i.name} x${i.qty}`).join(", "),
          ])}
        />
      </section>

      {/* Blog */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="Blog Posts" count={blogCount} />
        <Table
          headers={["Title", "Excerpt", "Date", "Read Time", "Category", "Slug"]}
          rows={blogPosts.map((b) => [b.title, b.excerpt, b.date, b.readTime, b.category, b.slug])}
        />
      </section>

      {/* Promo Codes */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="Promo Codes" count={promoCount} />
        <Table
          headers={["Code", "Type", "Value", "Min Order", "Max Discount", "Description", "Active"]}
          rows={promoCodes.map((p) => [
            p.code,
            p.type === "percentage" ? "Percentage" : "Fixed",
            p.type === "percentage" ? `${p.value}%` : `AED ${p.value}`,
            p.minOrderAmount ? `AED ${p.minOrderAmount.toLocaleString()}` : null,
            p.maxDiscount ? `AED ${p.maxDiscount.toLocaleString()}` : null,
            p.description,
            p.isActive ? <BadgePill text="Active" variant="emerald" /> : <BadgePill text="Inactive" variant="red" />,
          ])}
        />
      </section>

      {/* Bulk Pricing */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="Bulk Pricing Tiers" count={tierCount} />
        <Table
          headers={["Min Qty", "Max Qty", "Discount", "Label"]}
          rows={defaultBulkTiers.map((t) => [t.minQty, t.maxQty ?? "∞", `${t.discountPercent}%`, t.label])}
        />
      </section>

      {/* Benefits */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="Bulk Benefits" count={benefitCount} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bulkBenefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-line bg-white p-5">
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-brand/5">
                <div className="h-4 w-4 text-brand">
                  {b.icon === "shield" && <span className="text-xs font-bold">S</span>}
                  {b.icon === "truck" && <span className="text-xs font-bold">T</span>}
                  {b.icon === "briefcase" && <span className="text-xs font-bold">B</span>}
                </div>
              </div>
              <p className="text-sm font-semibold text-ink">{b.title}</p>
              <p className="mt-0.5 text-xs text-ink-2">{b.desc}</p>
              <p className="mt-1 text-[10px] text-ink-3">Icon: {b.icon}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Stats */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="About Stats" count={aboutStats.length} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aboutStats.map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-white p-5 text-center">
              <p className="text-2xl font-semibold text-brand" style={{ letterSpacing: "-0.01em" }}>{s.value}</p>
              <p className="mt-1 text-sm text-ink-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="mb-10 space-y-4">
        <SectionHeader title="Industries Served" count={industries.length} />
        <div className="flex flex-wrap gap-2">
          {industries.map((ind) => (
            <span key={ind} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm text-ink">
              {ind}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
