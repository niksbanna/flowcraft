import WorkflowRuns from "@/components/workflow-runs"

export default function WorkflowRunsPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <WorkflowRuns workflowId={params.id} />
    </main>
  )
}

