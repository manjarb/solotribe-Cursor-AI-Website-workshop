"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  LEAD_STATUSES,
  type LeadStatus,
} from "@/lib/validations/lead";
import { updateLeadStatusAction } from "@/lib/actions";
import { logoutAction } from "@/lib/actions";
import { business } from "@/config/business";

export type DashboardLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

const statusLabels: Record<LeadStatus | "all", string> = {
  all: "All",
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};

export function DashboardClient({
  leads,
  loadError,
}: {
  leads: DashboardLead[];
  loadError?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;
      return (
        lead.fullName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query)
      );
    });
  }, [leads, search, statusFilter]);

  const totals = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      contacted: leads.filter((lead) => lead.status === "contacted").length,
    };
  }, [leads]);

  function handleStatusChange(id: string, status: LeadStatus) {
    setMessage(null);
    setError(null);
    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", status);

    startTransition(async () => {
      const result = await updateLeadStatusAction({}, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage(result.success ?? "Lead status updated.");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-medium text-primary">{business.name}</p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-foreground">
              Lead Dashboard
            </h1>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {loadError ? (
          <div
            className="mb-6 rounded-xl border border-error/20 bg-error-soft px-4 py-4 text-error"
            role="alert"
          >
            {loadError}
          </div>
        ) : null}

        {message ? (
          <div
            className="mb-6 rounded-xl border border-success/20 bg-success-soft px-4 py-3 text-success"
            role="status"
          >
            {message}
          </div>
        ) : null}

        {error ? (
          <div
            className="mb-6 rounded-xl border border-error/20 bg-error-soft px-4 py-3 text-error"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total leads" value={totals.total} />
          <SummaryCard label="New leads" value={totals.new} />
          <SummaryCard label="Contacted leads" value={totals.contacted} />
        </section>

        <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative w-full max-w-md">
            <label htmlFor="search" className="mb-1.5 block text-sm font-medium">
              Search leads
            </label>
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="search"
                type="search"
                value={search}
                placeholder="Search by name, email, or company"
                className="w-full rounded-lg border border-border bg-surface py-2.5 pr-3 pl-10"
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium">Filter by status</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Status filters">
              {(["all", ...LEAD_STATUSES] as const).map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    aria-pressed={active}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "border border-border bg-surface text-foreground hover:border-primary"
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {statusLabels[status]}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-8">
          {filteredLeads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <p className="text-lg font-semibold text-foreground">
                No leads found
              </p>
              <p className="mt-2 text-muted">
                {leads.length === 0
                  ? "New enquiries from the website will appear here."
                  : "Try a different search or status filter."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface lg:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-primary-soft/50 text-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Contact</th>
                      <th className="px-4 py-3 font-semibold">Company</th>
                      <th className="px-4 py-3 font-semibold">Message</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border last:border-b-0">
                        <td className="px-4 py-4 align-top font-medium text-foreground">
                          {lead.fullName}
                        </td>
                        <td className="px-4 py-4 align-top text-muted">
                          <div>{lead.email}</div>
                          <div>{lead.phone || "—"}</div>
                        </td>
                        <td className="px-4 py-4 align-top text-muted">
                          {lead.company || "—"}
                        </td>
                        <td className="max-w-xs px-4 py-4 align-top text-muted">
                          {lead.message}
                        </td>
                        <td className="px-4 py-4 align-top">
                          <StatusSelect
                            value={lead.status}
                            disabled={isPending}
                            onChange={(status) =>
                              handleStatusChange(lead.id, status)
                            }
                          />
                        </td>
                        <td className="px-4 py-4 align-top whitespace-nowrap text-muted">
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="grid gap-4 lg:hidden">
                {filteredLeads.map((lead) => (
                  <li
                    key={lead.id}
                    className="rounded-2xl border border-border bg-surface p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">
                          {lead.fullName}
                        </h2>
                        <p className="text-sm text-muted">
                          {formatDate(lead.createdAt)}
                        </p>
                      </div>
                      <StatusSelect
                        value={lead.status}
                        disabled={isPending}
                        onChange={(status) =>
                          handleStatusChange(lead.id, status)
                        }
                      />
                    </div>
                    <dl className="mt-4 space-y-2 text-sm">
                      <div>
                        <dt className="font-medium text-foreground">Email</dt>
                        <dd className="text-muted">{lead.email}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-foreground">Phone</dt>
                        <dd className="text-muted">{lead.phone || "—"}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-foreground">Company</dt>
                        <dd className="text-muted">{lead.company || "—"}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-foreground">Message</dt>
                        <dd className="text-muted">{lead.message}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow)]">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: LeadStatus;
  onChange: (status: LeadStatus) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      aria-label="Lead status"
      className="rounded-lg border border-border bg-background px-2.5 py-2 text-sm font-medium capitalize text-foreground"
      onChange={(event) => onChange(event.target.value as LeadStatus)}
    >
      {LEAD_STATUSES.map((status) => (
        <option key={status} value={status}>
          {statusLabels[status]}
        </option>
      ))}
    </select>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
