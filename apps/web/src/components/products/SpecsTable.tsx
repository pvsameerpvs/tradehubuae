import type { ProductSpec } from "@/data";

interface SpecsTableProps {
  specs: ProductSpec[];
}

export function SpecsTable({ specs }: SpecsTableProps) {
  const visible = specs.filter((s) => s.value?.trim());
  if (visible.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <tbody>
          {visible.map((spec, i) => (
            <tr key={spec.label} className={i % 2 === 0 ? "bg-white" : "bg-bg2"}>
              <td className="w-2/5 px-5 py-3 text-ink-2">{spec.label}</td>
              <td className="px-5 py-3 font-medium text-ink">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
