import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { updateLeadStatusSchema } from "@/lib/validations/lead";
import { Lead } from "@/models/lead";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authenticated = await requireAuth();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateLeadStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid status." },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const lead = await Lead.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true },
    );

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({
      id: lead._id.toString(),
      status: lead.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not update the lead." },
      { status: 500 },
    );
  }
}
