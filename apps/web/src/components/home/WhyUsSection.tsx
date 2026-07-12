import { ShieldCheck, Truck, Briefcase } from "@/components/icons";
import { whyUsBenefits } from "@/data";

const iconMap = {
  shield: ShieldCheck,
  truck: Truck,
  briefcase: Briefcase,
};

export function WhyUsSection() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-3xl font-bold">Why TradeHub UAE?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {whyUsBenefits.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div key={item.title} className="rounded-xl border bg-card p-8 text-center transition hover:shadow-md">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
