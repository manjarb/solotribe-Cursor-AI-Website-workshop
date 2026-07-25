"use client";

import { useActionState } from "react";
import { loginAction, type AuthActionState } from "@/lib/actions";
import { business } from "@/config/business";
import Link from "next/link";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-8 font-[family-name:var(--font-display)] text-xl font-semibold text-primary"
      >
        {business.name}
      </Link>
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-foreground">
          Dashboard Login
        </h1>
        <p className="mt-2 text-muted">
          Enter the dashboard password to review customer enquiries.
        </p>
        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground"
            />
          </div>
          {state.error ? (
            <p className="rounded-lg border border-error/20 bg-error-soft px-3 py-2 text-sm text-error" role="alert">
              {state.error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-70"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
