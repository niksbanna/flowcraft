"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Home,
  Edit,
  Share,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  Webhook,
  Mail,
  MessageSquare,
  ArrowLeft,
} from "lucide-react"
import ActionNode from "./nodes/action-node"
import CustomEdge from "./edges/custom-edge"
import WorkflowRunItem from "./workflow-run-item"
import TriggerSelector from "./trigger-selector"
import ApiIntegrationNodes from "./api-integration-nodes"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { getWorkflowById, saveWorkflow } from "@/lib/workflow-storage"

const nodeTypes: NodeTypes = {
  action: ActionNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
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
  const router = useRouter()
  const [workflow, setWorkflow] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [runs, setRuns] = useState(sampleRuns)
  const [currentRun, setCurrentRun] = useState(runs[0])
  const [isRunning, setIsRunning] = useState(false)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [triggers, setTriggers] = useState<any[]>([])

  // Load workflow data
  useEffect(() => {
    const loadedWorkflow = getWorkflowById(workflowId)
    if (loadedWorkflow) {
      setWorkflow(loadedWorkflow)
      setNodes(loadedWorkflow.nodes)
      setEdges(loadedWorkflow.edges)
      setTriggers(loadedWorkflow.triggers || [])
    } else {
      setError("Workflow not found")
    }
  }, [workflowId, setNodes, setEdges])

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
    const newTriggers = [...triggers, trigger]
    setTriggers(newTriggers)

    // Update workflow with new triggers
    if (workflow) {
      const updatedWorkflow = {
        ...workflow,
        triggers: newTriggers,
        updatedAt: new Date().toISOString(),
      }
      saveWorkflow(updatedWorkflow)
      setWorkflow(updatedWorkflow)
    }
  }

  const handleAddApiNode = (node: any) => {
    setNodes((nds) => {
      const newNodes = [...nds, node]

      // Update workflow with new nodes
      if (workflow) {
        const updatedWorkflow = {
          ...workflow,
          nodes: newNodes,
          updatedAt: new Date().toISOString(),
        }
        saveWorkflow(updatedWorkflow)
        setWorkflow(updatedWorkflow)
      }

      return newNodes
    })
  }

  const runWorkflow = () => {
    setIsRunning(true)

    // Simulate workflow execution
    const newRun = {
      id: `run-${Date.now()}`,
      startTime: new Date(),
      endTime: new Date(Date.now() + 15000), // Simulate 15 second run
      status: "running",
      nodeResults: nodes.map((node) => ({
        nodeId: node.id,
        status: "pending",
        duration: "0s",
      })),
    }

    setRuns((prev) => [newRun, ...prev])
    setCurrentRun(newRun)

    // Simulate node execution
    const nodeIds = nodes.map((node) => node.id)

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
      const executionTime = Math.floor(Math.random() * 2500) + 500

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

  if (error) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/">
            <Button>Back to Workflows</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="container px-4 md:px-6 py-8 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-800 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-800 rounded"></div>
        </div>
      </div>
    )
  }

  return (
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
            <div>
              <h1 className="text-xl font-semibold">{workflow.name}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Workflow ID: {workflow.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link href={`/workflow/${workflowId}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
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
          <div className="border border-gray-800 rounded-lg bg-black text-white" style={{ height: 600 }}>
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
            {/* Workflow info */}
            <div className="border border-gray-800 rounded-lg p-4 bg-black">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-yellow-500 rounded-full p-1">
                  <span className="text-lg">✨</span>
                </div>
                <h2 className="text-lg font-semibold">Workflow Overview</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description:</h3>
                  <p className="text-sm text-muted-foreground">{workflow.description || "No description provided"}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Workflow Stats:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-900/50 border border-gray-800 rounded p-2">
                      <div className="text-sm text-muted-foreground">Nodes</div>
                      <div className="text-xl font-semibold">{nodes.length}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded p-2">
                      <div className="text-sm text-muted-foreground">Connections</div>
                      <div className="text-xl font-semibold">{edges.length}</div>
                    </div>
                  </div>
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
                        const node = nodes.find((n) => n.id === result.nodeId)
                        if (!node) return null
                        return <WorkflowRunItem key={result.nodeId} node={node} result={result} />
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="previous" className="m-0 p-0 max-h-[500px] overflow-y-auto">
                  <div className="space-y-4 p-4">
                    {runs.map((run) => (
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
                            const node = nodes.find((n) => n.id === result.nodeId)
                            if (!node) return null
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
          <Link href={`/workflow/${workflowId}`}>
            <div className="border border-gray-800 rounded-lg p-4 hover:bg-gray-900/50 transition-colors">
              <h3 className="font-medium mb-2 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-400" />
                Edit Workflow
              </h3>
              <p className="text-sm text-muted-foreground">Modify nodes, connections, and workflow settings</p>
            </div>
          </Link>
          <Link href="/">
            <div className="border border-gray-800 rounded-lg p-4 hover:bg-gray-900/50 transition-colors">
              <h3 className="font-medium mb-2 flex items-center">
                <Home className="h-5 w-5 mr-2 text-green-400" />
                All Workflows
              </h3>
              <p className="text-sm text-muted-foreground">Return to your workflow dashboard</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

