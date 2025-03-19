import WorkflowEditor from "@/components/workflow-editor"
import Navbar from "@/components/navbar"

export default function NewWorkflowPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Workflow</h1>
        <WorkflowEditor isNew={true} />
      </div>
    </main>
  )
}

