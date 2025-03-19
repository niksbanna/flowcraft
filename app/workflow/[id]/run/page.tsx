import WorkflowDetail from "@/components/workflow-detail"
import Navbar from "@/components/navbar"

export default function WorkflowRunPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <WorkflowDetail workflowId={params.id} />
    </main>
  )
}

