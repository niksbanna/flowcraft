import { Hero } from "@/components/hero"
import { WorkflowDemo } from "@/components/workflow-demo"
import { useAuth } from "@/components/auth-provider"
import { EmptyWorkflowState } from "@/components/empty-workflow-state"
import { getWorkflows } from "@/lib/workflow-storage"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Home() {
  return (
    <main>
      <ClientHome />
    </main>
  )
}
;("use client")

function ClientHome() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <>
        <Hero />
        <WorkflowDemo />
      </>
    )
  }

  // Get workflows from localStorage
  const workflows = getWorkflows()

  if (workflows.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Workflows</h1>
          <Link href="/workflow/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </Link>
        </div>
        <EmptyWorkflowState />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Workflows</h1>
        <Link href="/workflow/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <Link key={workflow.id} href={`/workflow/${workflow.id}`}>
            <div className="border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{workflow.name}</h2>
              <p className="text-muted-foreground mb-4 flex-grow">{workflow.description || "No description"}</p>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Created: {new Date(workflow.createdAt).toLocaleDateString()}</span>
                <span>{workflow.nodes?.length || 0} nodes</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

