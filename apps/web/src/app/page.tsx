import Link from "next/link";
import { Button } from "@tradehubuae/ui";

const categories = [
  { name: "Laptops", slug: "laptops", desc: "New & refurbished laptops", count: "45+ products" },
  { name: "Desktop PCs", slug: "desktop-pcs", desc: "Business & home desktops", count: "30+ products" },
  { name: "Gaming PCs", slug: "gaming-pcs", desc: "High-performance gaming rigs", count: "20+ products" },
  { name: "Components", slug: "components", desc: "CPUs, GPUs, RAM & more", count: "100+ products" },
  { name: "Accessories", slug: "accessories", desc: "Keyboards, mice, monitors", count: "80+ products" },
  { name: "Networking", slug: "networking", desc: "Routers, switches & cables", count: "50+ products" },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 dark:from-blue-950/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            Premium IT Equipment in the UAE
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Discover the best deals on new and refurbished laptops, desktops, gaming PCs,
            components, and networking equipment. Trusted by businesses across the UAE.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/search" className="w-full sm:w-auto">
              <Button size="xl" className="w-full sm:w-auto">Shop Now</Button>
            </Link>
            <Link href="/bulk-sales" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">Bulk Inquiry</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">Shop by Category</h2>
              <p className="mt-2 text-muted-foreground">Find exactly what you need</p>
            </div>
            <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
              View All Categories
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                  {cat.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary">{cat.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.desc}</p>
                <p className="mt-2 text-xs text-muted-foreground">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold">Why TradeHub UAE?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "100% Genuine Products",
                desc: "All products are verified and quality-checked. We source directly from authorized distributors.",
                icon: "shield",
              },
              {
                title: "Fast Delivery Across UAE",
                desc: "Free shipping on orders over AED 500. Same-day delivery in Dubai, next-day across the UAE.",
                icon: "truck",
              },
              {
                title: "Corporate Bulk Pricing",
                desc: "Special pricing for businesses, schools, and government organizations. Dedicated account managers.",
                icon: "briefcase",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border bg-card p-8 text-center transition hover:shadow-md">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  {item.icon === "shield" && (
                    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  )}
                  {item.icon === "truck" && (
                    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  )}
                  {item.icon === "briefcase" && (
                    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                    </svg>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Upgrade?</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Browse thousands of products at competitive prices. Free delivery across Dubai and the UAE.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/categories" className="w-full sm:w-auto">
              <Button size="xl" className="w-full sm:w-auto">Browse Products</Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
