"use client";

import { useEffect, useRef, useCallback } from "react";
import JsBarcode from "jsbarcode";
import { Button } from "@tradehubuae/ui";
import { Download, Printer } from "lucide-react";

interface BarcodeLabelProps {
  value: string;
  sku: string;
  price: number;
  productName: string;
  currency?: string;
}

export function BarcodeLabel({
  value,
  sku,
  price,
  productName,
  currency = "AED",
}: BarcodeLabelProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: false,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 0,
      });
    }
  }, [value]);

  const buildLabelSvg = useCallback(() => {
    const el = svgRef.current;
    if (!el) return "";
    const bW = parseInt(el.getAttribute("width") || "200", 10);
    const bH = parseInt(el.getAttribute("height") || "60", 10);
    const pad = 40;
    const w = Math.max(bW + pad, 300);
    const h = bH + 120;
    const xOff = (w - bW) / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="${w}" height="${h}" fill="#ffffff" rx="8"/>
      <text x="${w / 2}" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#1a1a2e" letter-spacing="3">tradehubuae</text>
      <text x="${w / 2}" y="46" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#888">${productName}</text>
      <g transform="translate(${xOff}, 55)">
        <svg xmlns="http://www.w3.org/2000/svg" width="${bW}" height="${bH}">${el.innerHTML}</svg>
      </g>
      <text x="${w / 2}" y="${bH + 85}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#555">SKU: ${sku}</text>
      <text x="${w / 2}" y="${bH + 107}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1a1a2e">${currency} ${Number(price).toLocaleString()}</text>
    </svg>`;
  }, [productName, sku, price, currency]);

  const handlePrint = useCallback(() => {
    const pw = window.open("", "_blank");
    if (!pw) return;
    const svg = buildLabelSvg();
    pw.document.write(`
      <html><head><title>Barcode - ${sku}</title>
      <style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh}@media print{@page{margin:0}body{margin:0}}</style>
      </head><body>${svg}
      <script>window.onload=function(){window.print();window.close()};<\/script>
      </body></html>
    `);
    pw.document.close();
  }, [buildLabelSvg, sku]);

  const handleDownload = useCallback(() => {
    const svg = buildLabelSvg();
    if (!svg) return;
    const tmp = document.createElement("div");
    tmp.innerHTML = svg;
    const parsed = tmp.querySelector("svg");
    const bw = parseInt(parsed?.getAttribute("width") || "300", 10);
    const bh = parseInt(parsed?.getAttribute("height") || "180", 10);
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = bw * scale;
    canvas.height = bh * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);
    const img = new window.Image();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, bw, bh);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => {
        if (!b) return;
        const pngUrl = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `barcode-${sku}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  }, [buildLabelSvg, sku]);

  return (
    <div className="rounded-xl border border-line bg-white">
      <div className="border-b border-line px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="text-sm font-semibold text-ink sm:text-base">Barcode Label</h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex justify-center">
          <div className="inline-block rounded-lg border border-line bg-white px-5 py-4 text-center sm:px-6">
            <p className="mb-1 text-xs font-bold tracking-[0.2em] text-ink">tradehubuae</p>
            <p className="mb-2 text-[10px] text-ink-2">{productName}</p>
            <svg ref={svgRef} className="mx-auto max-w-full" />
            <p className="mt-1 text-[10px] text-ink-3">SKU: {sku}</p>
            <p className="text-sm font-semibold text-ink">
              {currency} {Number(price).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1.5 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1.5 h-4 w-4" /> Download PNG
          </Button>
        </div>
      </div>
    </div>
  );
}
