"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearSessionCookie,
  requireAuth,
  setSessionCookie,
  verifyDashboardPassword,
} from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Lead } from "@/models/lead";
import { updateLeadStatusSchema } from "@/lib/validations/lead";

export type AuthActionState = {
  error?: string;
};

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Please enter the dashboard password." };
  }

  try {
    if (!verifyDashboardPassword(password)) {
      return { error: "Incorrect password. Please try again." };
    }
    await setSessionCookie();
  } catch {
    return {
      error:
        "Login is not configured yet. Check AUTH_SECRET and DASHBOARD_PASSWORD in .env.local.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/dashboard/login");
}

export type UpdateLeadState = {
  error?: string;
  success?: string;
};

export async function updateLeadStatusAction(
  _prevState: UpdateLeadState,
  formData: FormData,
): Promise<UpdateLeadState> {
  const authenticated = await requireAuth();
  if (!authenticated) {
    redirect("/dashboard/login");
  }

  const id = String(formData.get("id") ?? "");
  const parsed = updateLeadStatusSchema.safeParse({
    status: formData.get("status"),
  });

  if (!id) {
    return { error: "Lead not found." };
  }

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid status." };
  }

  try {
    await connectToDatabase();
    const lead = await Lead.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true },
    );

    if (!lead) {
      return { error: "Lead not found." };
    }

    revalidatePath("/dashboard");
    return { success: "Lead status updated." };
  } catch {
    return {
      error:
        "Could not update the lead. Check your MongoDB connection and try again.",
    };
  }
}
