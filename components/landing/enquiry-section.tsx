"use client";

import { FormEvent, useRef, useState } from "react";
import { business } from "@/config/business";
import { createLeadSchema } from "@/lib/validations/lead";

type FieldErrors = Partial<
  Record<"fullName" | "email" | "phone" | "company" | "message", string>
>;

type FormStatus = "idle" | "submitting" | "success" | "error";

const initialValues = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

export function EnquirySection() {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    setFieldErrors({});
    setErrorMessage("");

    const parsed = createLeadSchema.safeParse(values);
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          key === "fullName" ||
          key === "email" ||
          key === "phone" ||
          key === "company" ||
          key === "message"
        ) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = (await response.json()) as {
        error?: string;
        fieldErrors?: Record<string, string[]>;
      };

      if (!response.ok) {
        if (data.fieldErrors) {
          const errors: FieldErrors = {};
          for (const [key, messages] of Object.entries(data.fieldErrors)) {
            if (
              key === "fullName" ||
              key === "email" ||
              key === "phone" ||
              key === "company" ||
              key === "message"
            ) {
              errors[key] = messages[0];
            }
          }
          setFieldErrors(errors);
        }
        setErrorMessage(
          data.error ?? "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setValues(initialValues);
      setStatus("success");
    } catch {
      setErrorMessage("Could not send your enquiry. Please try again.");
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <section id="contact" className="scroll-mt-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {business.enquiry.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {business.enquiry.supportingMessage}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
          {status === "success" ? (
            <div
              className="rounded-xl border border-success/20 bg-success-soft px-4 py-5 text-success"
              role="status"
            >
              <p className="font-semibold">{business.enquiry.successMessage}</p>
              <button
                type="button"
                className="mt-4 text-sm font-semibold underline"
                onClick={() => setStatus("idle")}
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Field
                id="fullName"
                label="Full name"
                required
                value={values.fullName}
                error={fieldErrors.fullName}
                onChange={(value) =>
                  setValues((current) => ({ ...current, fullName: value }))
                }
              />
              <Field
                id="email"
                label="Email address"
                type="email"
                required
                value={values.email}
                error={fieldErrors.email}
                onChange={(value) =>
                  setValues((current) => ({ ...current, email: value }))
                }
              />
              <Field
                id="phone"
                label="Phone number"
                type="tel"
                value={values.phone}
                error={fieldErrors.phone}
                onChange={(value) =>
                  setValues((current) => ({ ...current, phone: value }))
                }
              />
              <Field
                id="company"
                label="Company name"
                value={values.company}
                error={fieldErrors.company}
                onChange={(value) =>
                  setValues((current) => ({ ...current, company: value }))
                }
              />
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Message{" "}
                  <span className="text-error" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only">required</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={values.message}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={
                    fieldErrors.message ? "message-error" : undefined
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground transition-colors focus:border-primary"
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                />
                {fieldErrors.message ? (
                  <p id="message-error" className="mt-1.5 text-sm text-error">
                    {fieldErrors.message}
                  </p>
                ) : null}
              </div>

              {status === "error" ? (
                <div
                  className="rounded-lg border border-error/20 bg-error-soft px-3 py-3 text-sm text-error"
                  role="alert"
                >
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {status === "submitting"
                  ? "Submitting..."
                  : business.enquiry.submitLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}{" "}
        {required ? (
          <>
            <span className="text-error" aria-hidden="true">
              *
            </span>
            <span className="sr-only">required</span>
          </>
        ) : (
          <span className="font-normal text-muted">(optional)</span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground transition-colors focus:border-primary"
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
