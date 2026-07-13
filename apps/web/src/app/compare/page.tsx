import type { Metadata } from "next";
import { Button, Badge } from "@tradehubuae/ui";
import { ImageIcon } from "@/components/icons";
import { compareProducts, compareSpecs } from "@/data";

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Compare Products</h1>

      <div className="grid gap-4 lg:hidden">
        {compareProducts.map((p) => (
          <div key={p.name} className="rounded-xl border bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-bg2">
                <ImageIcon className="h-6 w-6 text-ink-2" strokeWidth={1} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{p.name}</h2>
                  {p.badge && <Badge variant={p.badge === "New" ? "default" : "success"}>{p.badge}</Badge>}
                </div>
                <p className="text-lg font-bold text-brand">AED {p.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2 border-t pt-3">
              {compareSpecs.map((spec) => (
                <div key={spec.label} className="flex justify-between text-sm">
                  <span className="text-ink-2">{spec.label}</span>
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
              <th className="w-40 border-b bg-bg2/50 p-4 text-left text-sm font-medium text-ink-2">Specification</th>
              {compareProducts.map((p) => (
                <th key={p.name} className="border-b bg-bg2/50 p-4 text-center">
                  <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-lg bg-bg2">
                    <ImageIcon className="h-8 w-8 text-ink-2" strokeWidth={1} />
                  </div>
                  <p className="font-semibold">{p.name}</p>
                  {p.badge && <Badge variant={p.badge === "New" ? "default" : "success"} className="mt-1">{p.badge}</Badge>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareSpecs.map((spec) => (
              <tr key={spec.label} className="border-b last:border-0">
                <td className="p-4 text-sm font-medium text-ink-2">{spec.label}</td>
                {compareProducts.map((p) => (
                  <td key={p.name} className="p-4 text-center text-sm">
                    {spec.getValue(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4" />
              {compareProducts.map((p) => (
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
