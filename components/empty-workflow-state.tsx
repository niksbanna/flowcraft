import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Zap, FileText, Workflow } from "lucide-react"
import Link from "next/link"

export default function EmptyWorkflowState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-800/50 p-4 rounded-full mb-6">
        <Workflow className="h-12 w-12 text-purple-400" />
      </div>

      <h2 className="text-2xl font-bold mb-3">No workflows yet</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Create your first workflow to automate repetitive tasks, connect APIs, and process data without writing code.
      </p>

      <div className="grid gap-6 md:grid-cols-3 w-full max-w-3xl">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-left">
          <div className="bg-purple-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <Plus className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="font-medium mb-2">Create from scratch</h3>
          <p className="text-sm text-muted-foreground mb-4">Build a custom workflow with our visual editor</p>
          <Link href="/workflow">
            <Button variant="outline" className="w-full justify-between">
              Start building <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-left">
          <div className="bg-blue-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="font-medium mb-2">Use a template</h3>
          <p className="text-sm text-muted-foreground mb-4">Start with pre-built workflows for common tasks</p>
          <Link href="/templates">
            <Button variant="outline" className="w-full justify-between">
              Browse templates <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-left">
          <div className="bg-green-900/30 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <Zap className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="font-medium mb-2">AI Assistant</h3>
          <p className="text-sm text-muted-foreground mb-4">Let AI generate a workflow based on your description</p>
          <Link href="/ai-assistant">
            <Button variant="outline" className="w-full justify-between">
              Try AI builder <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 bg-blue-950/30 border border-blue-800 rounded-lg p-4 max-w-3xl">
        <h3 className="font-medium text-blue-300 mb-2">Need inspiration?</h3>
        <p className="text-sm text-blue-200 mb-3">
          Check out our examples and tutorials to see what you can build with FlowCraft.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="border-blue-800">
            View examples
          </Button>
          <Button variant="outline" className="border-blue-800">
            Watch tutorial
          </Button>
        </div>
      </div>
    </div>
  )
}

