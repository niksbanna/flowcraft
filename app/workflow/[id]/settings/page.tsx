import WorkflowSettings from "@/components/workflow-settings"
import Navbar from "@/components/navbar"

export default function WorkflowSettingsPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <WorkflowSettings workflowId={params.id} />
    </main>
  )
}

