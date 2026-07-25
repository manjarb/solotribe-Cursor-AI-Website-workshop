export function HeroDashboardVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow)] sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="h-2 w-28 rounded-full bg-primary-soft" />
      </div>

      <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-2 rounded-xl bg-primary-soft/70 p-3">
          <div className="h-2 w-16 rounded-full bg-primary/30" />
          <div className="h-8 rounded-lg bg-surface" />
          <div className="h-8 rounded-lg bg-surface/80" />
          <div className="h-8 rounded-lg bg-surface/60" />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="h-2 w-10 rounded-full bg-muted/30" />
              <div className="mt-2 h-4 w-8 rounded bg-primary/80" />
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="h-2 w-10 rounded-full bg-muted/30" />
              <div className="mt-2 h-4 w-8 rounded bg-accent/80" />
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="h-2 w-10 rounded-full bg-muted/30" />
              <div className="mt-2 h-4 w-8 rounded bg-primary-dark/70" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background p-3">
            <div className="mb-3 flex items-end gap-1.5">
              <div className="h-8 w-full rounded-t bg-primary/25" />
              <div className="h-12 w-full rounded-t bg-primary/45" />
              <div className="h-7 w-full rounded-t bg-primary/30" />
              <div className="h-14 w-full rounded-t bg-primary/70" />
              <div className="h-10 w-full rounded-t bg-primary/40" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-border" />
              <div className="h-2 w-[80%] rounded-full bg-border" />
              <div className="h-2 w-[60%] rounded-full bg-border" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
