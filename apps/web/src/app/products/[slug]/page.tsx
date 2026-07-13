import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart, Share2, Truck, RotateCcw, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { searchProducts, defaultSpecs } from "@/data";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductRow } from "@/components/home";
import { BuyButtons } from "@/components/products/BuyButtons";
import { ProductGallery } from "@/components/products/ProductGallery";
import { SellerCard } from "@/components/products/SellerCard";
import { SpecsTable } from "@/components/products/SpecsTable";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `View product details for ${slug.replace(/-/g, " ")} at TradeHub UAE`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = searchProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const productName = product.name;
  const relatedProducts = searchProducts.filter(
    (p) => p.category === product.category && p.slug !== slug,
  ).slice(0, 6);

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-28 md:px-6 md:pb-28">
      <div className="py-3 md:py-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: product.category, href: `/categories/${product.category.toLowerCase().replace(/\s+/g, "-")}` },
            { label: productName },
          ]}
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold leading-6 text-ink md:text-2xl md:leading-7" style={{ letterSpacing: "-0.01em" }}>
          {productName}
        </h1>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button type="button" aria-label="Share" className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-bg3">
            <Share2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Save" className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-bg3">
            <Heart className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-[1fr_360px] md:gap-4">
        <div>
          <ProductGallery badge={product.badge} />

          {product.specs && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.specs.split(" · ").map((item) => (
                <span key={item} className="rounded-lg bg-bg2 px-3 py-1.5 text-xs font-medium text-ink-2">
                  {item}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-ink">Description</h2>
              <p className="mt-1.5 text-sm leading-6 text-ink-2">
                Experience unparalleled performance with the {productName}. Perfect for professionals, creators, and power users who demand the best. This expertly crafted machine delivers exceptional speed, stunning visuals, and all-day battery life. Every unit undergoes rigorous testing to ensure it meets the highest standards of quality and reliability.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ink">Key specifications</h2>
              <div className="mt-2">
                <SpecsTable specs={defaultSpecs} />
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ink">Condition</h2>
              <div className="mt-2 rounded-xl border border-line p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2} />
                  <div>
                    <p className="text-sm font-semibold text-ink">Second-hand · Good condition</p>
                    <p className="mt-0.5 text-xs leading-5 text-ink-2">
                      Pre-owned item in good working condition. May show minor signs of use. Fully tested before listing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <div className="rounded-xl border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-xs font-medium text-green-700">In stock</span>
            </div>

            <div className="mt-2">
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-xs text-ink-3 line-through">AED {product.originalPrice.toLocaleString()}</p>
              )}
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-ink">AED {product.price.toLocaleString()}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="rounded bg-sale/10 px-1.5 py-0.5 text-[10px] font-semibold text-sale">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-xs text-ink-2">
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-ink" strokeWidth={1.75} />
                Free delivery by Thu, Jul 16
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-ink" strokeWidth={1.75} />
                14-day returns
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-bg2 px-3 py-2 text-center">
              <p className="text-[11px] text-ink-2">
                4 interest-free payments of <span className="font-semibold text-ink">AED {(product.price / 4).toLocaleString()}</span>
              </p>
            </div>

            <div className="mt-3">
              <BuyButtons product={product} />
            </div>
          </div>

          <div className="mt-4">
            <SellerCard />
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-line p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-semibold text-ink">Secure checkout</p>
              <p className="mt-0.5 text-xs text-ink-2">SSL encrypted · PayPal & card accepted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line p-4 md:hidden">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-semibold text-ink">Secure checkout</p>
            <p className="mt-0.5 text-xs text-ink-2">SSL encrypted · PayPal & card accepted</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-semibold text-ink">Free shipping</p>
            <p className="text-xs text-ink-2">On orders over 500 AED</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-semibold text-ink">Easy returns</p>
            <p className="text-xs text-ink-2">14-day return policy</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-semibold text-ink">Dubai showroom</p>
            <p className="text-xs text-ink-2">Visit us in Silicon Oasis</p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12 border-t border-line pt-12">
          <ProductRow
            title={`More in ${product.category}`}
            products={relatedProducts}
            href={`/categories/${product.category.toLowerCase().replace(/\s+/g, "-")}`}
          />
        </div>
      )}
    </div>
  );
}
