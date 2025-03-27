import WorkflowDetail from "@/components/workflow-detail"

export default function WorkflowRunPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <WorkflowDetail workflowId={params.id} />
    </main>
  )
}

