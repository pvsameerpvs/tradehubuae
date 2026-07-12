import type { Metadata } from "next";
import { Button, Badge } from "@tradehubuae/ui";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare IT equipment side by side at TradeHub UAE",
};

const specs = [
  { label: "Price", getValue: (p: typeof products[0]) => `AED ${p.price.toLocaleString()}` },
  { label: "Processor", getValue: () => "Intel Core i7-13700H" },
  { label: "RAM", getValue: () => "32GB DDR5" },
  { label: "Storage", getValue: () => "1TB NVMe SSD" },
  { label: "Display", getValue: () => '15.6" FHD+' },
  { label: "GPU", getValue: (p: typeof products[0]) => p.gpu },
  { label: "Battery", getValue: () => "Up to 10 hours" },
  { label: "Weight", getValue: () => "1.8 kg" },
  { label: "Warranty", getValue: () => "2 Years" },
  { label: "In Stock", getValue: () => "Yes" },
];

const products = [
  { name: "Dell XPS 15", price: 5499, gpu: "NVIDIA RTX 4060", badge: "Best Seller" as const },
  { name: "MacBook Pro 16", price: 7899, gpu: "M3 Pro 18-core", badge: "New" as const },
  { name: "HP Pavilion Desktop", price: 3299, gpu: "Intel UHD", badge: undefined },
];

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Compare Products</h1>

      <div className="grid gap-4 lg:hidden">
        {products.map((p) => (
          <div key={p.name} className="rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{p.name}</h2>
                  {p.badge && <Badge variant={p.badge === "New" ? "default" : "success"}>{p.badge}</Badge>}
                </div>
                <p className="text-lg font-bold text-primary">AED {p.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2 border-t pt-3">
              {specs.map((spec) => (
                <div key={spec.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.getValue(p)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1">Add to Cart</Button>
              <Button variant="ghost" size="sm">Remove</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-40 border-b bg-muted/50 p-4 text-left text-sm font-medium text-muted-foreground">Specification</th>
              {products.map((p) => (
                <th key={p.name} className="border-b bg-muted/50 p-4 text-center">
                  <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-lg bg-muted">
                    <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z" />
                    </svg>
                  </div>
                  <p className="font-semibold">{p.name}</p>
                  {p.badge && <Badge variant={p.badge === "New" ? "default" : "success"} className="mt-1">{p.badge}</Badge>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec) => (
              <tr key={spec.label} className="border-b last:border-0">
                <td className="p-4 text-sm font-medium text-muted-foreground">{spec.label}</td>
                {products.map((p) => (
                  <td key={p.name} className="p-4 text-center text-sm">
                    {spec.getValue(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4" />
              {products.map((p) => (
                <td key={p.name} className="p-4 text-center">
                  <Button size="sm" className="w-full">Add to Cart</Button>
                  <Button variant="ghost" size="sm" className="mt-1 w-full">Remove</Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
