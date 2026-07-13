"use client";

import { useState } from "react";
import { Truck, Save, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

interface ShippingZone {
  name: string;
  rate: string;
  estimatedDays: string;
}

export default function ShippingSettingsPage() {
  const [zones, setZones] = useState<ShippingZone[]>([
    { name: "Dubai", rate: "15", estimatedDays: "1-2" },
    { name: "Abu Dhabi", rate: "20", estimatedDays: "2-3" },
    { name: "Other Emirates", rate: "25", estimatedDays: "3-5" },
    { name: "International", rate: "75", estimatedDays: "7-14" },
  ]);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addZone = () => {
    setZones([...zones, { name: "", rate: "0", estimatedDays: "" }]);
  };

  const removeZone = (idx: number) => {
    setZones(zones.filter((_, i) => i !== idx));
  };

  const updateZone = (idx: number, field: keyof ShippingZone, value: string) => {
    const updated = [...zones];
    (updated[idx] as any)[field] = value;
    setZones(updated);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Shipping Settings</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage shipping zones and rates</p>
        </div>
        <Button size="sm" onClick={addZone}>
          <Plus className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.75} />
          Add Zone
        </Button>
      </div>
      <Card>
        <CardContent className="p-5 space-y-4">
          {zones.map((zone, idx) => (
            <div key={idx} className="flex items-end gap-3 border-b border-line pb-4 last:border-0 last:pb-0">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-ink-2">Zone Name</label>
                <input
                  value={zone.name}
                  onChange={(e) => updateZone(idx, "name", e.target.value)}
                  placeholder="e.g. Dubai"
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div className="w-24">
                <label className="mb-1 block text-xs font-medium text-ink-2">Rate (AED)</label>
                <input
                  type="number"
                  value={zone.rate}
                  onChange={(e) => updateZone(idx, "rate", e.target.value)}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div className="w-24">
                <label className="mb-1 block text-xs font-medium text-ink-2">Est. Days</label>
                <input
                  value={zone.estimatedDays}
                  onChange={(e) => updateZone(idx, "estimatedDays", e.target.value)}
                  placeholder="2-3"
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <button onClick={() => removeZone(idx)} className="mb-0.5 rounded-lg p-2 text-ink-3 transition-colors hover:bg-bg3 hover:text-sale">
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          ))}
          <div className="pt-2">
            <Button onClick={handleSave}>
              <Save className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
