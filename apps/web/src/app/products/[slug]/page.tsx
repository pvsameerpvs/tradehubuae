import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Share2, Truck, RotateCcw, CheckCircle2, ShieldCheck, MapPin, Gift, TrendingDown, ChevronRight } from "lucide-react";
import { ChatProductButton } from "@/components/chat/ChatProductButton";
import { searchProducts, defaultSpecs, comboOffers, defaultBulkTiers } from "@/data";
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

  const matchingCombos = comboOffers.filter((c) =>
    c.items.some((i) => i.slug === slug),
  );

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
          <ChatProductButton product={product} variant="icon" />
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
                <SpecsTable specs={product.detailedSpecs ?? defaultSpecs} />
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
            <div className="rounded-lg bg-bg2 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-2.5 w-2.5 rounded-full ${!product.stock || product.stock === 0 ? "bg-sale" : product.stock <= 3 ? "bg-amber-500" : "bg-green-500"}`} />
                  <span className="text-sm font-medium text-ink">
                    {!product.stock || product.stock === 0
                      ? "Out of stock"
                      : product.stock <= 3
                        ? `Only ${product.stock} left`
                        : "In stock"}
                  </span>
                </div>
                {product.stock !== undefined && product.stock > 0 && (
                  <span className="text-base font-bold text-ink">
                    {product.stock.toLocaleString()}
                  </span>
                )}
              </div>
              {product.stock !== undefined && product.stock > 0 && (
                <p className="mt-0.5 text-[11px] text-ink-2">
                  {product.stock >= 10
                    ? "Bulk quantity available — volume pricing eligible"
                    : product.stock === 1
                      ? "Last item in stock"
                      : `${product.stock} units ready to ship`}
                </p>
              )}
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

            {product.stock !== undefined && product.stock >= 10 ? (
              <div className="mt-3 rounded-xl border-2 border-brand/30 bg-brand/[0.03] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10">
                    <TrendingDown className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Bulk quantity available</p>
                    <p className="text-[11px] text-ink-2">{product.stock} units in stock · Volume pricing eligible</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {defaultBulkTiers.slice(0, 4).map((tier) => (
                    <div key={tier.minQty} className="flex-1 rounded-lg bg-white px-2 py-1.5 text-center border border-line">
                      <p className="text-[11px] font-semibold text-ink">{tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : "+"}</p>
                      <p className="text-[10px] text-brand font-semibold">{tier.discountPercent}% off</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/bulk-sales"
                  className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-ink py-2 text-xs font-semibold text-ink transition-colors hover:bg-bg3"
                >
                  Learn about bulk pricing
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-line p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingDown className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Bulk pricing</span>
                </div>
                <div className="flex gap-1.5">
                  {defaultBulkTiers.slice(0, 4).map((tier) => (
                    <div key={tier.minQty} className="flex-1 rounded-lg bg-bg2 px-2 py-1.5 text-center">
                      <p className="text-[11px] font-semibold text-ink">{tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : "+"}</p>
                      <p className="text-[10px] text-brand font-semibold">{tier.discountPercent}% off</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <SellerCard product={product} />
          </div>

          {matchingCombos.length > 0 && (
            <div className="mt-4 rounded-xl border border-line p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Gift className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <span className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Available in combos</span>
              </div>
              <div className="space-y-2">
                {matchingCombos.map((combo) => (
                  <Link
                    key={combo.id}
                    href="/combo-offers"
                    className="flex items-center justify-between rounded-lg bg-bg2 px-3 py-2 transition-colors hover:bg-bg3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-ink">{combo.name}</p>
                      <p className="text-[11px] text-ink-2">AED {combo.price.toLocaleString()}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-brand">-{combo.savingsPercent}%</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

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
