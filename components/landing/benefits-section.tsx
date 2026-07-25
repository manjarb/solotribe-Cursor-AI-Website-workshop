import { Clock3, TrendingUp, Workflow } from "lucide-react";
import { business } from "@/config/business";

const icons = [Workflow, Clock3, TrendingUp];

export function BenefitsSection() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {business.benefits.heading}
        </h2>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {business.benefits.items.map((item, index) => {
            const Icon = icons[index] ?? Workflow;
            return (
              <li key={item.title}>
                <div className="mb-4 inline-flex rounded-xl bg-primary-soft p-3 text-primary">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
