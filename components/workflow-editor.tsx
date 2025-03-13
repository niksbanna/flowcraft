"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
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
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Save, Trash2, Play } from "lucide-react"
import ActionNode from "./nodes/action-node"
import CustomEdge from "./edges/custom-edge"

const nodeTypes: NodeTypes = {
  action: ActionNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

const nodeTemplates = [
  {
    type: "action",
    category: "Triggers",
    label: "Webhook",
    icon: "🔗",
    description: "Start workflow from HTTP request",
  },
  {
    type: "action",
    category: "Triggers",
    label: "Schedule",
    icon: "⏰",
    description: "Run workflow on a schedule",
  },
  {
    type: "action",
    category: "Actions",
    label: "HTTP Request",
    icon: "🌐",
    description: "Make API calls",
  },
  {
    type: "action",
    category: "Actions",
    label: "Transform Data",
    icon: "🔄",
    description: "Modify data structure",
  },
  {
    type: "action",
    category: "Actions",
    label: "Filter",
    icon: "🔍",
    description: "Filter data by conditions",
  },
  {
    type: "action",
    category: "AI",
    label: "Text Generation",
    icon: "✍️",
    description: "Generate text with AI",
  },
  {
    type: "action",
    category: "AI",
    label: "Classification",
    icon: "🏷️",
    description: "Classify data with AI",
  },
  {
    type: "action",
    category: "Destinations",
    label: "Google Sheets",
    icon: "📊",
    description: "Write data to spreadsheet",
  },
  {
    type: "action",
    category: "Destinations",
    label: "Email",
    icon: "📧",
    description: "Send email notification",
  },
  {
    type: "action",
    category: "Destinations",
    label: "Database",
    icon: "💾",
    description: "Store in database",
  },
]

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [workflowName, setWorkflowName] = useState("My Workflow")
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

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

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const addNode = useCallback(
    (nodeData: any) => {
      const newNode = {
        id: `node_${Date.now()}`,
        type: nodeData.type,
        position: {
          x: 250,
          y: nodes.length * 150 + 50,
        },
        data: {
          label: nodeData.label,
          icon: nodeData.icon,
          description: nodeData.description,
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [nodes, setNodes],
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

  const saveWorkflow = () => {
    const workflow = {
      name: workflowName,
      nodes,
      edges,
    }
    console.log("Saving workflow:", workflow)
    // In a real app, you would save this to a database
    alert("Workflow saved successfully!")
  }

  const runWorkflow = () => {
    console.log("Running workflow")
    // In a real app, you would trigger the workflow execution
    alert("Workflow execution started!")
  }

  // Group node templates by category
  const groupedTemplates = nodeTemplates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = []
      }
      acc[template.category].push(template)
      return acc
    },
    {} as Record<string, typeof nodeTemplates>,
  )

  return (
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
                <Input id="workflow-name" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button className="w-full" onClick={saveWorkflow}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="secondary" className="w-full" onClick={runWorkflow}>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Nodes</CardTitle>
            <CardDescription>Drag and drop nodes to your workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="Triggers">
              <TabsList className="w-full mb-4">
                {Object.keys(groupedTemplates).map((category) => (
                  <TabsTrigger key={category} value={category} className="flex-1">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(groupedTemplates).map(([category, templates]) => (
                <TabsContent key={category} value={category} className="m-0">
                  <div className="grid gap-2">
                    {templates.map((template, index) => (
                      <Button key={index} variant="outline" className="justify-start" onClick={() => addNode(template)}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="mr-2">{template.icon}</span>
                        {template.label}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <div className="border rounded-lg" style={{ height: 600 }} ref={reactFlowWrapper}>
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
              >
                <Controls />
                <MiniMap />
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-description">Description</Label>
                  <Input
                    id="node-description"
                    value={selectedNode.data.description}
                    onChange={(e) => updateNodeData("description", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

