import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Badge, Card, CardContent } from "@tradehubuae/ui";

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
  const productName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const specs = [
    { label: "Processor", value: "Intel Core i7-13700H" },
    { label: "RAM", value: "32GB DDR5" },
    { label: "Storage", value: "1TB NVMe SSD" },
    { label: "Display", value: '15.6" FHD+ (1920×1200)' },
    { label: "GPU", value: "NVIDIA RTX 4060" },
    { label: "Battery", value: "Up to 10 hours" },
    { label: "Weight", value: "1.8 kg" },
    { label: "Warranty", value: "2 Years" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-primary">Categories</Link>
        <span className="mx-2">/</span>
        <Link href="/categories/laptops" className="hover:text-primary">Laptops</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{productName}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex aspect-square items-center justify-center rounded-xl bg-muted">
            <svg className="h-24 w-24 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z" />
            </svg>
          </div>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 cursor-pointer rounded-lg border-2 bg-muted transition hover:border-primary" />
            ))}
          </div>
        </div>

        <div>
          <Badge variant="success" className="mb-3">In Stock</Badge>
          <h1 className="mb-2 text-3xl font-bold">{productName}</h1>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(24 reviews)</span>
          </div>
          <p className="mb-6 text-3xl font-bold text-primary">AED 5,499</p>
          <p className="mb-6 text-muted-foreground">
            Experience unparalleled performance with the latest {productName}. Perfect for professionals, creators, and power users who demand the best.
          </p>

          <div className="mb-6 space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Quantity</label>
              <div className="flex w-32 items-center rounded-md border">
                <button className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:bg-accent">-</button>
                <span className="flex h-10 w-12 items-center justify-center text-sm font-medium">1</span>
                <button className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:bg-accent">+</button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="xl" className="flex-1">Add to Cart</Button>
            <Button size="xl" variant="outline">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </Button>
          </div>

          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Key Specifications</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between border-b pb-1 text-sm">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: "Omar R.", rating: 5, text: "Excellent laptop! Fast delivery and great price." },
            { name: "Sara A.", rating: 4, text: "Very good quality. Battery life is impressive." },
            { name: "Khalid M.", rating: 5, text: "Perfect for my business needs. Highly recommended!" },
          ].map((review) => (
            <div key={review.name} className="rounded-xl border bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium">{review.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{review.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
