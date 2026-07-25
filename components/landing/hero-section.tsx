import Link from "next/link";
import { business } from "@/config/business";
import { HeroDashboardVisual } from "@/components/landing/hero-dashboard-visual";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#d9ebff_0%,_transparent_55%),linear-gradient(180deg,_#eef5fc_0%,_#f4f8fc_100%)]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p className="mb-4 font-[family-name:var(--font-display)] text-lg font-semibold text-primary sm:text-xl">
            {business.name}
          </p>
          <h1 className="max-w-xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            {business.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {business.supportingMessage}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {business.primaryCta}
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-5 py-3 text-base font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {business.secondaryCta}
            </Link>
          </div>
        </div>
        <HeroDashboardVisual />
      </div>
    </section>
  );
}
