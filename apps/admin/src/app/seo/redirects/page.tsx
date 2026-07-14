"use client";

import { useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

interface Redirect {
  from: string;
  to: string;
  type: number;
}

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([
    { from: "/old-products", to: "/products", type: 301 },
    { from: "/shop", to: "/products", type: 301 },
    { from: "/contact-us", to: "/contact", type: 301 },
  ]);

  const addRedirect = () => {
    setRedirects([...redirects, { from: "", to: "", type: 301 }]);
  };

  const removeRedirect = (idx: number) => {
    setRedirects(redirects.filter((_, i) => i !== idx));
  };

  const updateRedirect = (idx: number, field: keyof Redirect, value: string | number) => {
    const updated = [...redirects];
    updated[idx] = { ...updated[idx], [field]: value } as Redirect;
    setRedirects(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Redirects</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage 301 redirects and fix broken links</p>
        </div>
        <Button size="sm" onClick={addRedirect}>
          <Plus className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.75} />
          Add Redirect
        </Button>
      </div>
      <Card>
        <CardHeader className="px-5 py-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <CardTitle className="text-sm font-semibold text-ink">Redirect Rules</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <table className="w-full">
            <thead>
              <tr className="border-t border-line text-left text-xs text-ink-3 uppercase tracking-wider">
                <th className="p-4 font-medium">From</th>
                <th className="p-4 font-medium">To</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {redirects.map((r, idx) => (
                <tr key={idx} className="border-t border-line">
                  <td className="p-2 pl-4">
                    <input
                      value={r.from}
                      onChange={(e) => updateRedirect(idx, "from", e.target.value)}
                      placeholder="/old-path"
                      className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={r.to}
                      onChange={(e) => updateRedirect(idx, "to", e.target.value)}
                      placeholder="/new-path"
                      className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={r.type}
                      onChange={(e) => updateRedirect(idx, "type", parseInt(e.target.value))}
                      className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value={301}>301</option>
                      <option value={302}>302</option>
                    </select>
                  </td>
                  <td className="p-2 pr-4">
                    <button onClick={() => removeRedirect(idx)} className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-bg3 hover:text-sale">
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
