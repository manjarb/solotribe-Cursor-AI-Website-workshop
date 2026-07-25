import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createLeadSchema } from "@/lib/validations/lead";
import { Lead } from "@/models/lead";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the form and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { fullName, email, phone, company, message } = parsed.data;

    await connectToDatabase();

    const lead = await Lead.create({
      fullName,
      email,
      phone: phone || undefined,
      company: company || undefined,
      message,
      status: "new",
    });

    return NextResponse.json(
      {
        message: "Enquiry submitted successfully.",
        id: lead._id.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("MONGODB_URI")
        ? "The enquiry form is not connected to the database yet. Please add your MongoDB connection string."
        : "Something went wrong while saving your enquiry. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authenticated = await requireAuth();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";

    const query: Record<string, unknown> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      leads: leads.map((lead) => ({
        id: String(lead._id),
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone ?? "",
        company: lead.company ?? "",
        message: lead.message,
        status: lead.status,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("MONGODB_URI")
        ? "MongoDB is not configured yet."
        : "Could not load leads.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
