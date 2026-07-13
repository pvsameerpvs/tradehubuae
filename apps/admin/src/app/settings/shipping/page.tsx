"use client";

import { useState } from "react";
import { Truck, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, Input } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

interface ShippingZone {
  name: string;
  rate: string;
  estimatedDays: string;
}

export default function ShippingSettingsPage() {
  const [zones, setZones] = useState<ShippingZone[]>([
    { name: "Dubai", rate: "15", estimatedDays: "1-2" },
    { name: "Sharjah", rate: "15", estimatedDays: "1-2" },
    { name: "Other Emirates", rate: "50", estimatedDays: "2-4" },
  ]);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addZone = () => {
    setZones((prev) => [...prev, { name: "", rate: "0", estimatedDays: "" }]);
  };

  const removeZone = (idx: number) => {
    setZones((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateZone = (idx: number, field: keyof ShippingZone, value: string) => {
    setZones((prev) => prev.map((zone, i) => (i === idx ? { ...zone, [field]: value } : zone)));
  };

  return (
    <div className="space-y-6">
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
        <CardContent className="p-0">
          {/* Header row — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-3 border-b border-line px-5 py-3 text-xs font-medium text-ink-3 uppercase tracking-wider">
            <div className="w-8" />
            <div className="flex-1">Zone</div>
            <div className="w-24 text-right">Rate (AED)</div>
            <div className="w-24 text-right">Est. Days</div>
            <div className="w-10" />
          </div>

          {/* Zone rows */}
          {zones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Truck className="h-8 w-8 text-ink-3" strokeWidth={1.5} />
              <p className="mt-2 text-sm font-medium text-ink-2">No shipping zones</p>
              <p className="text-xs text-ink-3">Click Add Zone to create one.</p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {zones.map((zone, idx) => (
                <div key={idx} className="flex items-center gap-3 px-5 py-3 sm:py-2">
                  <div className="hidden sm:flex h-8 w-8 items-center justify-center text-ink-3">
                    <GripVertical className="h-4 w-4" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="sm:hidden mb-1 block text-xs font-medium text-ink-3">Zone</label>
                    <Input
                      value={zone.name}
                      onChange={(e) => updateZone(idx, "name", e.target.value)}
                      placeholder="e.g. Dubai"
                    />
                  </div>

                  <div className="w-20 sm:w-24">
                    <label className="sm:hidden mb-1 block text-xs font-medium text-ink-3">Rate</label>
                    <Input
                      type="number"
                      value={zone.rate}
                      onChange={(e) => updateZone(idx, "rate", e.target.value)}
                      className="text-right"
                    />
                  </div>

                  <div className="w-20 sm:w-24">
                    <label className="sm:hidden mb-1 block text-xs font-medium text-ink-3">Days</label>
                    <Input
                      value={zone.estimatedDays}
                      onChange={(e) => updateZone(idx, "estimatedDays", e.target.value)}
                      placeholder="2-3"
                      className="text-right"
                    />
                  </div>

                  <button
                    onClick={() => removeZone(idx)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-bg3 hover:text-sale"
                    aria-label={`Delete ${zone.name || "zone"} shipping zone`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
