import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import Template, { type ITemplate } from "@/models/Template";

type ModerationUpdate = Partial<Pick<ITemplate, "moderationStatus" | "reported" | "isPublic">>;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'approve', 'reject', 'clear_report'

    await connectToDatabase();

    const update: ModerationUpdate = {};
    if (action === 'approve') {
      update.moderationStatus = 'approved';
      update.reported = false;
    } else if (action === 'reject') {
      update.moderationStatus = 'rejected';
      update.isPublic = false;
      update.reported = false;
    } else if (action === 'clear_report') {
      update.reported = false;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const template = await Template.findByIdAndUpdate(id, update, { new: true });
    
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error("Moderation error:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();

    await Template.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Template deleted" });
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
