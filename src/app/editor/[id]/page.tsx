import EditorLayout from "@/components/editor/EditorLayout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import Design from "@/models/Design";
import { redirect } from "next/navigation";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  let initialDesign = null;

  if (resolvedParams.id !== "new") {
    await connectToDatabase();
    
    const designDoc = await Design.findOne({
      _id: resolvedParams.id,
      userId: session.user.id,
    }).lean();

    if (designDoc) {
      initialDesign = JSON.parse(JSON.stringify(designDoc));
    } else {
      redirect("/designs");
    }
  }
  
  return <EditorLayout initialDesign={initialDesign} />;
}
