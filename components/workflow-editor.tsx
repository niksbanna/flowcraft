"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Save,
  Trash2,
  Play,
  ArrowLeft,
  AlertCircle,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Layers,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ActionNode from "./nodes/action-node"
import ConditionNode from "./nodes/condition-node"
import LoopNode from "./nodes/loop-node"
import TransformationNode from "./nodes/transformation-node"
import TriggerNode from "./nodes/trigger-node"
import CustomEdge from "./edges/custom-edge"
import Link from "next/link"
import { getWorkflowById, saveWorkflow, generateWorkflowId, type Workflow } from "@/lib/workflow-storage"
import NodePalette from "./node-palette"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import WorkflowVersionHistory from "./workflow-version-history"
import WorkflowExportImport from "./workflow-export-import"
import WorkflowCloneDialog from "./workflow-clone-dialog"

const nodeTypes: NodeTypes = {
  action: ActionNode,
  condition: ConditionNode,
  loop: LoopNode,
  transformation: TransformationNode,
  trigger: TriggerNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

interface WorkflowEditorProps {
  workflowId?: string
  isNew: boolean
}

export default function WorkflowEditor({ workflowId, isNew }: WorkflowEditorProps) {
  const router = useRouter()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [workflowName, setWorkflowName] = useState("My Workflow")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string>(workflowId || generateWorkflowId())
  const [searchTerm, setSearchTerm] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [versionComment, setVersionComment] = useState("")
  const [showVersionComment, setShowVersionComment] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Load existing workflow if editing
  useEffect(() => {
    if (!isNew && workflowId) {
      const existingWorkflow = getWorkflowById(workflowId)
      if (existingWorkflow) {
        setWorkflowName(existingWorkflow.name)
        setWorkflowDescription(existingWorkflow.description || "")
        setNodes(existingWorkflow.nodes)
        setEdges(existingWorkflow.edges)
        setCurrentWorkflowId(existingWorkflow.id)
      } else {
        setError("Workflow not found")
      }
    }
  }, [isNew, workflowId, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Determine if this is a connection from a condition node
      const sourceNode = nodes.find((node) => node.id === params.source)
      let connectionType = "custom"
      const animated = true

      // Set edge properties based on source node type and handle
      if (sourceNode?.type === "condition") {
        if (params.sourceHandle === "true") {
          // True path from condition
          connectionType = "custom"
        } else if (params.sourceHandle === "false") {
          // False path from condition
          connectionType = "custom"
        }
      } else if (sourceNode?.type === "loop") {
        if (params.sourceHandle === "body") {
          // Loop body path
          connectionType = "custom"
        } else if (params.sourceHandle === "exit") {
          // Loop exit path
          connectionType = "custom"
        }
      }

      return setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: connectionType,
            animated,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            // Pass source handle ID to the edge for styling
            data: { sourceHandleId: params.sourceHandle },
          },
          eds,
        ),
      )
    },
    [nodes, setEdges],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const addNode = useCallback(
    (nodeData: any) => {
      // Get viewport center from ReactFlow instance
      let position = { x: 250, y: nodes.length * 150 + 50 }

      if (reactFlowInstance) {
        const { x, y, zoom } = reactFlowInstance.getViewport()
        const centerX = reactFlowInstance.screenToFlowPosition({
          x: reactFlowWrapper.current!.clientWidth / 2,
          y: reactFlowWrapper.current!.clientHeight / 2,
        }).x
        const centerY = reactFlowInstance.screenToFlowPosition({
          x: reactFlowWrapper.current!.clientWidth / 2,
          y: reactFlowWrapper.current!.clientHeight / 2,
        }).y

        position = {
          x: centerX,
          y: centerY,
        }
      }

      const newNode = {
        id: `node_${Date.now()}`,
        type: nodeData.type,
        position,
        data: {
          ...nodeData.data,
          category: nodeData.category,
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [nodes, setNodes, reactFlowInstance],
  )

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  const updateNodeData = useCallback(
    (key: string, value: string) => {
      if (selectedNode) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === selectedNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  [key]: value,
                },
              }
            }
            return node
          }),
        )
      }
    },
    [selectedNode, setNodes],
  )

  const saveWorkflowToStorage = (redirect = true) => {
    if (!workflowName.trim()) {
      setError("Workflow name is required")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const workflowData: Workflow = {
        id: currentWorkflowId,
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const savedWorkflow = saveWorkflow(workflowData, versionComment || undefined)
      setVersionComment("")
      setShowVersionComment(false)

      if (redirect) {
        // Redirect to home page after saving
        setTimeout(() => {
          router.push("/")
        }, 500)
      }

      return savedWorkflow
    } catch (err) {
      console.error("Error saving workflow:", err)
      setError("Failed to save workflow. Please try again.")
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const runWorkflow = () => {
    // Save workflow first
    const savedWorkflow = saveWorkflowToStorage(false)

    if (savedWorkflow) {
      // Then redirect to run page
      router.push(`/workflow/${currentWorkflowId}/run`)
    }
  }

  // Handle zoom controls
  const handleZoomIn = () => {
    if (reactFlowInstance) {
      const newZoom = Math.min(zoomLevel + 0.2, 2)
      reactFlowInstance.zoomTo(newZoom)
      setZoomLevel(newZoom)
    }
  }

  const handleZoomOut = () => {
    if (reactFlowInstance) {
      const newZoom = Math.max(zoomLevel - 0.2, 0.2)
      reactFlowInstance.zoomTo(newZoom)
      setZoomLevel(newZoom)
    }
  }

  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 })
      setZoomLevel(reactFlowInstance.getZoom())
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      reactFlowWrapper.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle search
  const handleSearch = () => {
    if (!searchTerm || !reactFlowInstance) return

    // Find node that matches search term
    const matchingNode = nodes.find((node) => node.data.label.toLowerCase().includes(searchTerm.toLowerCase()))

    if (matchingNode) {
      // Center view on the matching node
      reactFlowInstance.setCenter(matchingNode.position.x, matchingNode.position.y, { zoom: 1.5, duration: 800 })

      // Highlight the node temporarily
      setNodes(
        nodes.map((node) => {
          if (node.id === matchingNode.id) {
            return {
              ...node,
              className: "node-highlight",
            }
          }
          return node
        }),
      )

      // Remove highlight after 2 seconds
      setTimeout(() => {
        setNodes(
          nodes.map((node) => {
            if (node.id === matchingNode.id) {
              return {
                ...node,
                className: "",
              }
            }
            return node
          }),
        )
      }, 2000)
    }
  }

  // Handle version restore
  const handleVersionRestore = (version: number) => {
    // Reload the workflow after version restore
    const restoredWorkflow = getWorkflowById(currentWorkflowId)
    if (restoredWorkflow) {
      setWorkflowName(restoredWorkflow.name)
      setWorkflowDescription(restoredWorkflow.description || "")
      setNodes(restoredWorkflow.nodes)
      setEdges(restoredWorkflow.edges)
    }
  }

  // Handle workflow import complete
  const handleImportComplete = (newWorkflowId: string) => {
    // Redirect to the imported workflow
    router.push(`/workflow/${newWorkflowId}`)
  }

  // Handle workflow clone complete
  const handleCloneComplete = (newWorkflowId: string) => {
    // Redirect to the cloned workflow
    router.push(`/workflow/${newWorkflowId}`)
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Back button and workflow ID */}
      <div className="flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Workflows
          </Button>
        </Link>
        <div className="text-sm text-muted-foreground">Workflow ID: {currentWorkflowId}</div>
      </div>

      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
              <CardDescription>Configure your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Name</Label>
                  <Input
                    id="workflow-name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="bg-gray-900 border-gray-800 text-white"
                    placeholder="Enter workflow name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea
                    id="workflow-description"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="bg-gray-900 border-gray-800 text-white min-h-[80px]"
                    placeholder="Describe what this workflow does"
                  />
                </div>

                {showVersionComment && (
                  <div className="space-y-2">
                    <Label htmlFor="version-comment">Version Comment (Optional)</Label>
                    <Input
                      id="version-comment"
                      value={versionComment}
                      onChange={(e) => setVersionComment(e.target.value)}
                      className="bg-gray-900 border-gray-800 text-white"
                      placeholder="What changed in this version?"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => saveWorkflowToStorage(true)} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={runWorkflow}>
                    <Play className="mr-2 h-4 w-4" />
                    Run
                  </Button>
                </div>

                {/* Advanced workflow actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVersionComment(!showVersionComment)}
                    size="sm"
                    onClick={() => setShowVersionComment(!showVersionComment)}
                  >
                    {showVersionComment ? "Hide Comment" : "Add Version Comment"}
                  </Button>

                  {!isNew && workflowId && (
                    <>
                      <WorkflowVersionHistory
                        workflowId={currentWorkflowId}
                        onVersionRestore={handleVersionRestore}
                        currentVersion={getWorkflowById(currentWorkflowId)?.version || 1}
                      />

                      <WorkflowCloneDialog
                        workflowId={currentWorkflowId}
                        workflowName={workflowName}
                        onCloneComplete={handleCloneComplete}
                      />

                      <WorkflowExportImport workflowId={currentWorkflowId} onImportComplete={handleImportComplete} />
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <NodePalette onAddNode={addNode} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="border rounded-lg relative" style={{ height: 600 }} ref={reactFlowWrapper}>
                {/* Search and controls panel */}
                <div className="absolute top-4 left-4 z-10 flex gap-2 bg-gray-900/80 p-2 rounded-lg backdrop-blur-sm">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search nodes..."
                      className="pl-8 bg-gray-900 border-gray-800 text-white h-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {/* Custom controls panel */}
                <div className="absolute top-4 right-4 z-10 flex gap-2 bg-gray-900/80 p-2 rounded-lg backdrop-blur-sm">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Zoom In</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Zoom Out</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleFitView}>
                          <Layers className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Fit View</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
                          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  onPaneClick={onPaneClick}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  fitView
                  snapToGrid
                  snapGrid={[15, 15]}
                  onInit={setReactFlowInstance}
                >
                  <Controls showInteractive={false} />
                  <MiniMap
                    nodeStrokeColor="#555555"
                    nodeColor={(node) => {
                      switch (node.type) {
                        case "trigger":
                          return "#3b82f6" // blue
                        case "condition":
                          return "#eab308" // yellow
                        case "loop":
                          return "#6366f1" // indigo
                        case "transformation":
                          return "#22c55e" // green
                        default:
                          return "#8b5cf6" // purple
                      }
                    }}
                    nodeBorderRadius={4}
                  />
                  <Background gap={12} size={1} />
                </ReactFlow>
              </div>
            </CardContent>
          </Card>

          {selectedNode && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Node Settings</CardTitle>
                  <Button variant="destructive" size="sm" onClick={deleteSelectedNode}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
                <CardDescription>Configure the selected node</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="node-label">Label</Label>
                    <Input
                      id="node-label"
                      value={selectedNode.data.label}
                      onChange={(e) => updateNodeData("label", e.target.value)}
                      className="bg-gray-900 border-gray-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="node-description">Description</Label>
                    <Input
                      id="node-description"
                      value={selectedNode.data.description}
                      onChange={(e) => updateNodeData("description", e.target.value)}
                      className="bg-gray-900 border-gray-800 text-white"
                    />
                  </div>

                  {/* Conditional settings based on node type */}
                  {selectedNode.type === "condition" && (
                    <div className="space-y-2">
                      <Label htmlFor="condition-expression">Condition Expression</Label>
                      <Textarea
                        id="condition-expression"
                        value={selectedNode.data.condition || ""}
                        onChange={(e) => updateNodeData("condition", e.target.value)}
                        className="bg-gray-900 border-gray-800 text-white font-mono text-sm"
                        placeholder="e.g., data.value > 100"
                      />
                    </div>
                  )}

                  {selectedNode.type === "loop" && (
                    <div className="space-y-2">
                      <Label htmlFor="loop-type">Loop Type</Label>
                      <select
                        id="loop-type"
                        value={selectedNode.data.loopType || "forEach"}
                        onChange={(e) => updateNodeData("loopType", e.target.value)}
                        className="w-full bg-gray-900 border-gray-800 text-white rounded-md p-2"
                      >
                        <option value="forEach">For Each</option>
                        <option value="while">While</option>
                        <option value="doWhile">Do While</option>
                        <option value="count">Count</option>
                      </select>

                      <Label htmlFor="loop-config">Loop Configuration</Label>
                      <Textarea
                        id="loop-config"
                        value={selectedNode.data.loopConfig || ""}
                        onChange={(e) => updateNodeData("loopConfig", e.target.value)}
                        className="bg-gray-900 border-gray-800 text-white font-mono text-sm"
                        placeholder={
                          selectedNode.data.loopType === "forEach" ? "items in data.array" : "data.condition === true"
                        }
                      />
                    </div>
                  )}

                  {selectedNode.type === "transformation" && (
                    <div className="space-y-2">
                      <Label htmlFor="transform-type">Transformation Type</Label>
                      <select
                        id="transform-type"
                        value={selectedNode.data.transformType || "map"}
                        onChange={(e) => updateNodeData("transformType", e.target.value)}
                        className="w-full bg-gray-900 border-gray-800 text-white rounded-md p-2"
                      >
                        <option value="map">Map</option>
                        <option value="filter">Filter</option>
                        <option value="reduce">Reduce</option>
                        <option value="sort">Sort</option>
                        <option value="custom">Custom</option>
                      </select>

                      <Label htmlFor="transform-config">Transformation Code</Label>
                      <Textarea
                        id="transform-config"
                        value={selectedNode.data.transformConfig || ""}
                        onChange={(e) => updateNodeData("transformConfig", e.target.value)}
                        className="bg-gray-900 border-gray-800 text-white font-mono text-sm"
                        placeholder="item => ({ ...item, processed: true })"
                      />
                    </div>
                  )}

                  {selectedNode.type === "trigger" && (
                    <div className="space-y-2">
                      <Label htmlFor="trigger-type">Trigger Type</Label>
                      <select
                        id="trigger-type"
                        value={selectedNode.data.triggerType || "webhook"}
                        onChange={(e) => updateNodeData("triggerType", e.target.value)}
                        className="w-full bg-gray-900 border-gray-800 text-white rounded-md p-2"
                      >
                        <option value="webhook">Webhook</option>
                        <option value="schedule">Schedule</option>
                        <option value="event">Event</option>
                        <option value="manual">Manual</option>
                      </select>

                      {selectedNode.data.triggerType === "schedule" && (
                        <>
                          <Label htmlFor="trigger-schedule">Schedule (cron)</Label>
                          <Input
                            id="trigger-schedule"
                            value={selectedNode.data.triggerConfig || ""}
                            onChange={(e) => updateNodeData("triggerConfig", e.target.value)}
                            className="bg-gray-900 border-gray-800 text-white font-mono"
                            placeholder="0 * * * *"
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

