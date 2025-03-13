"use client"

import { useState, useCallback } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  MarkerType,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, Home, Edit, Share, Clock, CheckCircle2, AlertCircle, Webhook, Mail, MessageSquare, Settings, Layers } from "lucide-react"
import ActionNode from "./nodes/action-node"
import CustomEdge from "./edges/custom-edge"
import WorkflowRunItem from "./workflow-run-item"
import TriggerSelector from "./trigger-selector"
import ApiIntegrationNodes from "./api-integration-nodes"
import { cn } from "@/lib/utils"
import Link from "next/link"

const nodeTypes: NodeTypes = {
  action: ActionNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

// Sample workflow data
const sampleWorkflow = {
  id: "linkedin-profile-analysis",
  name: "LinkedIn Profile Analysis (w/ Interface)",
  version: "0.0.1",
  description: "Analyze LinkedIn profiles and generate insights",
  nodes: [
    {
      id: "linkedin-profile",
      type: "action",
      position: { x: 450, y: 150 },
      data: {
        label: "LinkedIn Profile Analysis",
        icon: "🔍",
        description: "Analyze LinkedIn profile data",
        inputs: ["LinkedIn Profile URL"],
        outputs: ["Profile Score", "Analysis"],
      },
    },
    {
      id: "error-shield",
      type: "action",
      position: { x: 450, y: 400 },
      data: {
        label: "Error Shield",
        icon: "🛡️",
        description: "Handle errors and exceptions",
        inputs: ["Input Data"],
        outputs: ["Processed Data"],
      },
    },
    {
      id: "linkedin-scraping",
      type: "action",
      position: { x: 450, y: 550 },
      data: {
        label: "LinkedIn Scraping",
        icon: "🕸️",
        description: "Extract data from LinkedIn profiles",
        inputs: ["URL"],
        outputs: ["Profile Data"],
      },
    },
    {
      id: "combine-test",
      type: "action",
      position: { x: 450, y: 700 },
      data: {
        label: "Combine Test",
        icon: "🔄",
        description: "Combine text including a given format",
        inputs: ["Text Input"],
        outputs: ["Combined Text"],
      },
    },
    {
      id: "output",
      type: "action",
      position: { x: 450, y: 850 },
      data: {
        label: "Output",
        icon: "📤",
        description: "Send data to destination",
        inputs: ["Data"],
        outputs: [],
      },
    },
  ],
  edges: [
    {
      id: "e-linkedin-error",
      source: "linkedin-profile",
      target: "error-shield",
      type: "custom",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: "e-error-scraping",
      source: "error-shield",
      target: "linkedin-scraping",
      type: "custom",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: "e-scraping-combine",
      source: "linkedin-scraping",
      target: "combine-test",
      type: "custom",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: "e-combine-output",
      source: "combine-test",
      target: "output",
      type: "custom",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
  ],
  template: {
    overview: "This workflow analyzes LinkedIn profiles to extract insights and generate a comprehensive report.",
    inputs: ["LinkedIn Profile URL"],
    howItWorks: [
      "Input a LinkedIn profile link, and the automation processes the profile to assign a score from 0-100 based on experience.",
      "AI generates a short summary of the person's background and expertise.",
      "You can output the data wherever you'd like! Add it to Google Docs, Slack, Airtable, etc.",
    ],
  },
  triggers: [
    {
      id: "webhook-trigger",
      type: "webhook",
      name: "Webhook Trigger",
      config: {
        url: "https://api.flowcraft.io/triggers/webhook/abc123",
        method: "POST",
      },
    },
  ],
}

// Sample run history
const sampleRuns = [
  {
    id: "run-1",
    startTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    endTime: new Date(Date.now() - 1000 * 60 * 4.9), // 4.9 minutes ago
    status: "success",
    nodeResults: [
      { nodeId: "linkedin-profile", status: "success", duration: "0.05s" },
      { nodeId: "error-shield", status: "success", duration: "0.01s" },
      { nodeId: "linkedin-scraping", status: "success", duration: "12.03s" },
      { nodeId: "combine-test", status: "success", duration: "0.01s" },
      { nodeId: "output", status: "success", duration: "0.02s" },
    ],
  },
  {
    id: "run-2",
    startTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    endTime: new Date(Date.now() - 1000 * 60 * 29.8), // 29.8 minutes ago
    status: "error",
    nodeResults: [
      { nodeId: "linkedin-profile", status: "success", duration: "0.04s" },
      { nodeId: "error-shield", status: "success", duration: "0.01s" },
      { nodeId: "linkedin-scraping", status: "error", duration: "5.21s", error: "Failed to access LinkedIn profile" },
      { nodeId: "combine-test", status: "skipped", duration: "0s" },
      { nodeId: "output", status: "skipped", duration: "0s" },
    ],
  },
  {
    id: "run-3",
    startTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    endTime: new Date(Date.now() - 1000 * 60 * 59.9), // 59.9 minutes ago
    status: "success",
    nodeResults: [
      { nodeId: "linkedin-profile", status: "success", duration: "0.06s" },
      { nodeId: "error-shield", status: "success", duration: "0.01s" },
      { nodeId: "linkedin-scraping", status: "success", duration: "10.45s" },
      { nodeId: "combine-test", status: "success", duration: "0.02s" },
      { nodeId: "output", status: "success", duration: "0.03s" },
    ],
  },
]

export default function WorkflowDetail({ workflowId }: { workflowId: string }) {
  const [workflow, setWorkflow] = useState(sampleWorkflow)
  const [runs, setRuns] = useState(sampleRuns)
  const [currentRun, setCurrentRun] = useState(runs[0])
  const [isRunning, setIsRunning] = useState(false)
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges)
  const [triggers, setTriggers] = useState(workflow.triggers || [])

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "custom",
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds,
        ),
      ),
    [setEdges],
  )

  const handleAddTrigger = (trigger: any) => {
    setTriggers((prev) => [...prev, trigger])
  }

  const handleAddApiNode = (node: any) => {
    setNodes((nds) => [...nds, node])
  }

  const runWorkflow = () => {
    setIsRunning(true)

    // Simulate workflow execution
    const newRun = {
      id: `run-${Date.now()}`,
      startTime: new Date(),
      endTime: new Date(Date.now() + 15000), // Simulate 15 second run
      status: "running",
      nodeResults: workflow.nodes.map((node) => ({
        nodeId: node.id,
        status: "pending",
        duration: "0s",
      })),
    }

    setRuns((prev) => [newRun, ...prev])
    setCurrentRun(newRun)

    // Simulate node execution
    const nodeIds = workflow.nodes.map((node) => node.id)

    // Execute nodes sequentially with delays
    let currentNodeIndex = 0

    const executeNextNode = () => {
      if (currentNodeIndex >= nodeIds.length) {
        // All nodes executed
        setIsRunning(false)
        setRuns((prev) => {
          const updated = [...prev]
          updated[0] = {
            ...updated[0],
            status: "success",
            endTime: new Date(),
          }
          return updated
        })
        setCurrentRun((prev) => ({
          ...prev,
          status: "success",
          endTime: new Date(),
        }))
        return
      }

      const nodeId = nodeIds[currentNodeIndex]

      // Update current node to running
      setRuns((prev) => {
        const updated = [...prev]
        const nodeResults = [...updated[0].nodeResults]
        nodeResults[currentNodeIndex] = {
          ...nodeResults[currentNodeIndex],
          status: "running",
        }
        updated[0] = {
          ...updated[0],
          nodeResults,
        }
        return updated
      })

      setCurrentRun((prev) => {
        const nodeResults = [...prev.nodeResults]
        nodeResults[currentNodeIndex] = {
          ...nodeResults[currentNodeIndex],
          status: "running",
        }
        return {
          ...prev,
          nodeResults,
        }
      })

      // Simulate execution time (random between 0.5 and 3 seconds)
      const executionTime =
        nodeId === "linkedin-scraping"
          ? Math.floor(Math.random() * 10000) + 5000
          : // Longer for scraping (5-15s)
            Math.floor(Math.random() * 2500) + 500 // Shorter for other nodes (0.5-3s)

      setTimeout(() => {
        // Mark node as completed
        setRuns((prev) => {
          const updated = [...prev]
          const nodeResults = [...updated[0].nodeResults]
          nodeResults[currentNodeIndex] = {
            ...nodeResults[currentNodeIndex],
            status: "success",
            duration: `${(executionTime / 1000).toFixed(2)}s`,
          }
          updated[0] = {
            ...updated[0],
            nodeResults,
          }
          return updated
        })

        setCurrentRun((prev) => {
          const nodeResults = [...prev.nodeResults]
          nodeResults[currentNodeIndex] = {
            ...nodeResults[currentNodeIndex],
            status: "success",
            duration: `${(executionTime / 1000).toFixed(2)}s`,
          }
          return {
            ...prev,
            nodeResults,
          }
        })

        // Move to next node
        currentNodeIndex++
        executeNextNode()
      }, executionTime)
    }

    // Start execution
    executeNextNode()
  }

  return (
    <div className="container px-4 md:px-6 py-4">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Home className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{workflow.name}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Run from {workflow.version}</span>
                <span className="mx-2">•</span>
                <span className="text-primary">See latest version</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Interface
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
            <TriggerSelector onTriggerAdd={handleAddTrigger} />
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={runWorkflow}
              disabled={isRunning}
            >
              <Play className="h-4 w-4" />
              Run
            </Button>
          </div>
        </div>

        {/* Active triggers */}
        {triggers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {triggers.map((trigger) => (
              <div
                key={trigger.id}
                className="bg-gray-900 border border-gray-800 rounded-md px-3 py-1.5 flex items-center gap-2 text-sm"
              >
                {trigger.type === "webhook" ? (
                  <Webhook className="h-4 w-4 text-blue-400" />
                ) : trigger.type === "schedule" ? (
                  <Clock className="h-4 w-4 text-green-400" />
                ) : trigger.type === "email" ? (
                  <Mail className="h-4 w-4 text-purple-400" />
                ) : (
                  <MessageSquare className="h-4 w-4 text-yellow-400" />
                )}
                <span>{trigger.name}</span>
                <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800 text-xs">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
          {/* Flow diagram */}
          <div className="border border-gray-800 rounded-lg bg-black" style={{ height: 600 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              attributionPosition="bottom-right"
            >
              <Controls />
              <MiniMap nodeStrokeColor="#555555" nodeColor="#333333" nodeBorderRadius={8} />
              <Background gap={12} size={1} color="#333333" />

              {/* API Integration Note */}
              <Panel position="top-right" className="m-3">
                <ApiIntegrationNodes onNodeAdd={handleAddApiNode} />
              </Panel>
            </ReactFlow>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col space-y-4">
            {/* Template info */}
            <div className="border border-gray-800 rounded-lg p-4 bg-black">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-yellow-500 rounded-full p-1">
                  <span className="text-lg">✨</span>
                </div>
                <h2 className="text-lg font-semibold">Template Overview:</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <div className="bg-red-500 rounded-full p-1 mt-1">
                    <span className="text-lg">📌</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Inputs Required:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {workflow.template.inputs.map((input, index) => (
                        <li key={index}>{input}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Here's How It Works:</h3>
                  <ul className="space-y-3">
                    {workflow.template.howItWorks.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Run history */}
            <div className="border border-gray-800 rounded-lg bg-black overflow-hidden">
              <Tabs defaultValue="current">
                <div className="border-b border-gray-800">
                  <TabsList className="w-full bg-transparent">
                    <TabsTrigger
                      value="current"
                      className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                    >
                      Current Run
                    </TabsTrigger>
                    <TabsTrigger
                      value="previous"
                      className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                    >
                      Previous Runs
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="current" className="m-0 p-0">
                  <div className="space-y-1">
                    {currentRun &&
                      currentRun.nodeResults.map((result, index) => {
                        const node = workflow.nodes.find((n) => n.id === result.nodeId)

                        return <WorkflowRunItem key={result.nodeId} node={node!} result={result} />
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="previous" className="m-0 p-0 max-h-[500px] overflow-y-auto">
                  <div className="space-y-4 p-4">
                    {runs.map((run, index) => (
                      <div key={run.id} className="border border-gray-800 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Badge
                              variant={run.status === "success" ? "default" : "destructive"}
                              className={cn(
                                "mr-2",
                                run.status === "success"
                                  ? "bg-green-600"
                                  : run.status === "error"
                                    ? "bg-red-600"
                                    : "bg-yellow-600",
                              )}
                            >
                              {run.status === "success" ? "Success" : run.status === "error" ? "Failed" : "Running"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{run.startTime.toLocaleTimeString()}</span>
                          </div>
                          <Link href={`/workflow/${workflowId}/runs`}>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {run.nodeResults.slice(0, 4).map((result) => {
                            const node = workflow.nodes.find((n) => n.id === result.nodeId)
                            return (
                              <div key={result.nodeId} className="flex items-center text-sm">
                                {result.status === "success" ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                                ) : result.status === "error" ? (
                                  <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                                ) : (
                                  <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                                )}
                                <span className="truncate">{node?.data.label}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* API Integration Note */}
        <div className="bg-blue-950/30 border border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-300 mb-2">API Integration</h3>
          <p className="text-sm text-blue-200">
            This demo uses static data to simulate API responses. In a production environment, the workflow engine would
            make real API calls to external services and process the responses.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="bg-blue-900/30 border border-blue-800/50 rounded p-2">
              <span className="font-medium block mb-1">REST API</span>
              <span className="text-blue-300 text-xs">
                Connect to any REST API with authentication, custom headers, and request body
              </span>
            </div>
            <div className="bg-blue-900/30 border border-blue-800/50 rounded p-2">
              <span className="font-medium block mb-1">GraphQL</span>
              <span className="text-blue-300 text-xs">Execute GraphQL queries and mutations with variable support</span>
            </div>
            <div className="bg-blue-900/30 border border-blue-800/50 rounded p-2">
              <span className="font-medium block mb-1">Database</span>
              <span className="text-blue-300 text-xs">
                Connect to SQL and NoSQL databases with parameterized queries
              </span>
            </div>
          </div>
        </div>

        {/* Links to other features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={`/workflow/${workflowId}/runs`}>
            <div className="border border-gray-800 rounded-lg p-4 hover:bg-gray-900/50 transition-colors">
              <h3 className="font-medium mb-2 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                Run History
              </h3>
              <p className="text-sm text-muted-foreground">View detailed history of all workflow executions</p>
            </div>
          </Link>
          <Link href={`/workflow/${workflowId}/settings`}>
            <div className="border border-gray-800 rounded-lg p-4 hover:bg-gray-900/50 transition-colors">
              <h3 className="font-medium mb-2 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-400" />
                Workflow Settings
              </h3>
              <p className="text-sm text-muted-foreground">Configure execution, security, and advanced options</p>
            </div>
          </Link>
          <Link href={`/workflow/large-scale`}>
            <div className="border border-gray-800 rounded-lg p-4 hover:bg-gray-900/50 transition-colors">
              <h3 className="font-medium mb-2 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-green-400" />
                Large-Scale Demo
              </h3>
              <p className="text-sm text-muted-foreground">See how our engine handles millions of nodes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

