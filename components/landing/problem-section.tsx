import { business } from "@/config/business";

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {business.problemSection.heading}
        </h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
          {business.problemSection.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
