import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Lead } from "@/models/lead";
import {
  DashboardClient,
  type DashboardLead,
} from "@/components/dashboard/dashboard-client";
import type { LeadStatus } from "@/lib/validations/lead";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/dashboard/login");
  }

  let leads: DashboardLead[] = [];
  let loadError: string | undefined;

  try {
    await connectToDatabase();
    const documents = await Lead.find().sort({ createdAt: -1 }).lean();
    leads = documents.map((lead) => ({
      id: String(lead._id),
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone ?? "",
      company: lead.company ?? "",
      message: lead.message,
      status: lead.status as LeadStatus,
      createdAt: new Date(lead.createdAt).toISOString(),
    }));
  } catch (error) {
    loadError =
      error instanceof Error && error.message.includes("MONGODB_URI")
        ? "MongoDB is not connected yet. Open .env.local and replace PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE with your MongoDB Atlas connection string."
        : "Could not load leads from the database. Please check your MongoDB connection and try again.";
  }

  return <DashboardClient leads={leads} loadError={loadError} />;
}
