import EditorLayout from "@/components/editor/EditorLayout";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  // In the future, we can load design data here if resolvedParams.id !== "new"
  
  return <EditorLayout />;
}
