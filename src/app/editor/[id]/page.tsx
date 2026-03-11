import EditorLayout from "@/components/editor/EditorLayout";

export default function EditorPage({ params }: { params: { id: string } }) {
  // In the future, we can load design data here if params.id !== "new"
  
  return <EditorLayout designId={params.id} />;
}
