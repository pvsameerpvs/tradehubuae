"use client";

import { useState } from "react";
import { Button, Input } from "@tradehubuae/ui";

const trackingSteps = [
  { label: "Order Placed", date: "Jul 5, 2026", completed: true },
  { label: "Payment Confirmed", date: "Jul 5, 2026", completed: true },
  { label: "Processing", date: "Jul 6, 2026", completed: true },
  { label: "Shipped", date: "Jul 8, 2026", completed: true },
  { label: "Out for Delivery", date: "Jul 10, 2026", completed: false },
  { label: "Delivered", date: null, completed: false },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [tracked, setTracked] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold">Track Your Order</h1>
          <p className="text-lg text-muted-foreground">
            Enter your order ID to track the status of your shipment.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Enter order ID (e.g., ORD-002)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="h-12 text-base"
          />
          <Button size="lg" onClick={() => setTracked(true)} disabled={!orderId} className="w-full sm:w-auto">
            Track
          </Button>
        </div>

        {tracked && (
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Order ORD-002</h2>
                <p className="text-sm text-muted-foreground">Placed on July 5, 2026</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                In Transit
              </span>
            </div>

            <div className="relative">
              {trackingSteps.map((step, i) => (
                <div key={step.label} className="flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium ${
                        step.completed
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-background text-muted-foreground"
                      }`}
                    >
                      {step.completed ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < trackingSteps.length - 1 && (
                      <div className={`h-full w-0.5 ${step.completed ? "bg-primary" : "bg-muted-foreground/20"}`} />
                    )}
                  </div>
                  <div className={`pt-1 ${step.completed ? "" : "opacity-50"}`}>
                    <p className="font-medium">{step.label}</p>
                    {step.date && <p className="text-sm text-muted-foreground">{step.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
