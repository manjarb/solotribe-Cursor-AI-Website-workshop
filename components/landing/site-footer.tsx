import { business } from "@/config/business";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#b91c1c] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold">
            {business.name}
          </p>
          <p className="mt-3 max-w-md leading-relaxed text-white/75">
            {business.footer.tagline}
          </p>
        </div>
        <div className="space-y-2 text-white/85">
          <p>
            <a
              href={`mailto:${business.contact.email}`}
              className="hover:text-white"
            >
              {business.contact.email}
            </a>
          </p>
          <p>
            <a href={`tel:${business.contact.phone}`} className="hover:text-white">
              {business.contact.phone}
            </a>
          </p>
          <p>{business.contact.address}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-white/60 sm:px-6">
          © {year} {business.name}
        </p>
      </div>
    </footer>
  );
}
