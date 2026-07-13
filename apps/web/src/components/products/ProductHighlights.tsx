import { Check } from "lucide-react";

interface ProductHighlightsProps {
  specs?: string;
}

export function ProductHighlights({ specs }: ProductHighlightsProps) {
  if (!specs) return null;

  const items = specs.split(" · ");

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2.5} />
          <span className="text-sm leading-5 text-ink-2">{item}</span>
        </div>
      ))}
    </div>
  );
}
