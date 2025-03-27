import LargeScaleWorkflow from "@/components/large-scale-workflow"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

export default function LargeScaleWorkflowPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container px-4 md:px-6 py-4">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Large-Scale Workflow Demo</h1>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-950/30 border border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-300 mb-1">Scalable Workflow Engine</h3>
                <p className="text-sm text-blue-200">
                  This demo showcases our workflow engine's ability to handle large-scale workflows with thousands of
                  nodes. In a production environment, the system uses virtualization and efficient rendering to support
                  millions of nodes while maintaining performance.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-900/30 border border-blue-800/50 rounded p-2">
                    <span className="font-medium block mb-1">API Integration</span>
                    <span className="text-blue-300 text-xs">
                      Connect to any REST API, GraphQL, or database with our integration nodes
                    </span>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-800/50 rounded p-2">
                    <span className="font-medium block mb-1">Multiple Triggers</span>
                    <span className="text-blue-300 text-xs">
                      Trigger workflows via webhooks, schedules, email, Slack, and more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large workflow */}
          <LargeScaleWorkflow />

          {/* API Integration Note */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">API Integration</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                This demo uses static data to simulate API responses. In a production environment, the workflow engine
                would make real API calls to external services.
              </p>
              <p>
                <strong>Developer Note:</strong> The API integration layer is designed to be pluggable, allowing for
                easy replacement of the static data provider with real API clients. The architecture follows a provider
                pattern where each integration type (REST, GraphQL, Database) has its own provider implementation.
              </p>
              <pre className="bg-gray-950 p-3 rounded text-xs overflow-x-auto mt-2">
                {`// Example of real API integration code (not implemented in this demo)
const apiClient = new ApiClient({
  baseUrl: config.apiUrl,
  headers: { Authorization: \`Bearer \${config.apiKey}\` },
  timeout: 30000,
  retries: 3
});

// Execute node with real API call
async function executeApiNode(node, inputs) {
  try {
    const response = await apiClient.request({
      method: node.config.method,
      url: node.config.url,
      data: processTemplateVariables(node.config.body, inputs),
      headers: processTemplateVariables(node.config.headers, inputs)
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      details: error.response?.data 
    };
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

