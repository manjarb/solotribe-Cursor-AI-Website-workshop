import { z } from "zod";

export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const createLeadSchema = z.object({
  fullName: z
    .string({ error: () => ({ message: "Please enter your full name." }) })
    .trim()
    .min(1, "Please enter your full name.")
    .max(120, "Full name is too long."),
  email: z
    .string({ error: () => ({ message: "Please enter your email address." }) })
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address.")
    .transform((value) => value.toLowerCase()),
  phone: z
    .string({ error: () => ({ message: "Phone number must be text." }) })
    .trim()
    .max(40, "Phone number is too long.")
    .default(""),
  company: z
    .string({ error: () => ({ message: "Company name must be text." }) })
    .trim()
    .max(120, "Company name is too long.")
    .default(""),
  message: z
    .string({ error: () => ({ message: "Please enter a message." }) })
    .trim()
    .min(1, "Please enter a message.")
    .max(2000, "Message is too long."),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES, {
    message: "Please choose a valid status.",
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
