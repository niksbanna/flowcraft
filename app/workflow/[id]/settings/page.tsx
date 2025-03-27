import WorkflowSettings from "@/components/workflow-settings"

export default function WorkflowSettingsPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <WorkflowSettings workflowId={params.id} />
    </main>
  )
}

