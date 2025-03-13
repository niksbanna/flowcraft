import WorkflowEditor from "@/components/workflow-editor"
import Navbar from "@/components/navbar"

export default function WorkflowPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Workflow Editor</h1>
        <WorkflowEditor />
      </div>
    </main>
  )
}

