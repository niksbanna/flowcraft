import WorkflowDetail from "@/components/workflow-detail"
import Navbar from "@/components/navbar"

export default async function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <WorkflowDetail workflowId={id} />
    </main>
  )
}

