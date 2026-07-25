import { business } from "@/config/business";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-border bg-surface"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {business.howItWorks.heading}
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {business.howItWorks.steps.map((step, index) => (
            <li key={step.title} className="relative">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
