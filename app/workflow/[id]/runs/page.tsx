import WorkflowRuns from "@/components/workflow-runs"
import Navbar from "@/components/navbar"

export default function WorkflowRunsPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <WorkflowRuns workflowId={params.id} />
    </main>
  )
}

