"use client"

import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import WorkflowTemplates from "@/components/workflow-templates"
import { useRouter } from "next/navigation"
import { saveWorkflow, generateWorkflowId } from "@/lib/workflow-storage"

export default function TemplatesPage() {
  const router = useRouter()

  const handleSelectTemplate = (template: any) => {
    // Generate a new workflow ID
    const workflowId = generateWorkflowId()

    // Create a new workflow from the template
    const workflow = {
      id: workflowId,
      name: `${template.name} Copy`,
      description: template.description,
      nodes: template.nodes,
      edges: template.edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save the workflow
    saveWorkflow(workflow)

    // Redirect to the workflow editor
    router.push(`/workflow/${workflowId}`)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Workflow Templates</h1>
              <p className="text-muted-foreground mt-1">Start with pre-built workflows for common tasks</p>
            </div>
          </div>

          {/* Templates */}
          <WorkflowTemplates onSelectTemplate={handleSelectTemplate} />

          {/* More templates prompt */}
          <div className="bg-blue-950/30 border border-blue-800 rounded-lg p-6 text-center">
            <h3 className="font-medium text-blue-300 text-lg mb-2">Need a custom template?</h3>
            <p className="text-blue-200 mb-4 max-w-2xl mx-auto">
              We can create custom workflow templates tailored to your specific business needs. Contact our team to
              discuss your requirements.
            </p>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              Contact Us <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

