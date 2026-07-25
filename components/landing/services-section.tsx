import { business } from "@/config/business";

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {business.services.heading}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {business.services.items.map((item, index) => (
            <li
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow)]"
            >
              <p className="text-sm font-semibold tracking-wide text-primary">
                Service {index + 1}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
