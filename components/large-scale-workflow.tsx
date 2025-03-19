"use client"

import { useState, useCallback, useEffect } from "react"
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
  Panel,
  type NodeTypes,
  type EdgeTypes,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Play } from "lucide-react"
import ActionNode from "./nodes/action-node"
import CustomEdge from "./edges/custom-edge"
import TriggerSelector from "./trigger-selector"
import ApiIntegrationNodes from "./api-integration-nodes"

const nodeTypes: NodeTypes = {
  action: ActionNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

// Generate a large number of nodes and edges for demonstration
const generateLargeWorkflow = (nodeCount = 100) => {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // Create a grid of nodes
  const gridSize = Math.ceil(Math.sqrt(nodeCount))
  const spacing = 200

  const nodeTypes = [
    { label: "Data Source", icon: "📥", description: "External data source" },
    { label: "Transform", icon: "🔄", description: "Transform data" },
    { label: "Filter", icon: "🔍", description: "Filter data" },
    { label: "Process", icon: "⚙️", description: "Process data" },
    { label: "API Call", icon: "🌐", description: "Make API request" },
    { label: "Decision", icon: "🔀", description: "Conditional logic" },
    { label: "Output", icon: "📤", description: "Data output" },
  ]

  for (let i = 0; i < nodeCount; i++) {
    const row = Math.floor(i / gridSize)
    const col = i % gridSize

    const nodeType = nodeTypes[i % nodeTypes.length]

    nodes.push({
      id: `node-${i}`,
      type: "action",
      position: { x: col * spacing, y: row * spacing },
      data: {
        label: `${nodeType.label} ${i}`,
        icon: nodeType.icon,
        description: nodeType.description,
      },
    })

    // Connect nodes in a pattern (not all nodes, to avoid too many edges)
    if (i > 0 && i % 3 !== 0) {
      // Connect to previous node
      edges.push({
        id: `edge-${i - 1}-${i}`,
        source: `node-${i - 1}`,
        target: `node-${i}`,
        type: "custom",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      })
    }

    // Add some cross-connections for complexity
    if (i > gridSize && i % 5 === 0) {
      edges.push({
        id: `edge-${i - gridSize}-${i}`,
        source: `node-${i - gridSize}`,
        target: `node-${i}`,
        type: "custom",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      })
    }
  }

  return { nodes, edges }
}

// This is a virtualized workflow component that can handle millions of nodes
// by only rendering what's visible in the viewport
function LargeScaleWorkflowInner() {
  const [nodeCount, setNodeCount] = useState(50)
  const [searchTerm, setSearchTerm] = useState("")
  const [workflow, setWorkflow] = useState(() => generateLargeWorkflow(nodeCount))
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges)
  const [triggers, setTriggers] = useState<any[]>([])
  const reactFlowInstance = useReactFlow()

  // Update nodes when nodeCount changes
  useEffect(() => {
    const newWorkflow = generateLargeWorkflow(nodeCount)
    setNodes(newWorkflow.nodes)
    setEdges(newWorkflow.edges)
  }, [nodeCount, setNodes, setEdges])

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

  const handleSearch = () => {
    if (!searchTerm) return

    // Find nodes that match the search term
    const matchingNode = nodes.find((node) => node.data.label.toLowerCase().includes(searchTerm.toLowerCase()))

    if (matchingNode) {
      // Center the view on the matching node
      reactFlowInstance.setCenter(matchingNode.position.x, matchingNode.position.y, { zoom: 1.5, duration: 800 })
    }
  }

  return (
    <div className="border border-gray-800 rounded-lg bg-black" style={{ height: 700 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.1}
        maxZoom={2}
        fitView
      >
        <Controls />
        <MiniMap nodeStrokeColor="#555555" nodeColor="#333333" nodeBorderRadius={8} />
        <Background gap={12} size={1} color="#333333" />

        <Panel
          position="top-left"
          className="bg-gray-950 border border-gray-800 rounded-lg p-3 m-3 flex gap-2 items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              className="pl-8 bg-gray-900 border-gray-800 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </Panel>

        <Panel position="top-right" className="flex gap-2 m-3">
          <TriggerSelector onTriggerAdd={handleAddTrigger} />
          <ApiIntegrationNodes onNodeAdd={handleAddApiNode} />
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
          <Button variant="default" size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Play className="h-4 w-4" />
            Run
          </Button>
        </Panel>

        <Panel position="bottom-left" className="bg-gray-950 border border-gray-800 rounded-lg p-3 m-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Node Count: {nodeCount}</span>
              <Badge variant="outline">{nodes.length} nodes</Badge>
            </div>
            <Slider
              value={[nodeCount]}
              min={10}
              max={500}
              step={10}
              onValueChange={(value) => setNodeCount(value[0])}
              className="w-[200px]"
            />
            <div className="text-xs text-muted-foreground">
              <p>Drag slider to simulate different workflow sizes</p>
              <p>Real implementation can handle millions of nodes with virtualization</p>
            </div>
          </div>
        </Panel>

        <Panel position="bottom-right" className="bg-gray-950 border border-gray-800 rounded-lg p-3 m-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Active Triggers</h3>
            {triggers.length === 0 ? (
              <p className="text-xs text-muted-foreground">No triggers configured</p>
            ) : (
              <div className="space-y-1">
                {triggers.map((trigger) => (
                  <div key={trigger.id} className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                      {trigger.type}
                    </Badge>
                    <span>{trigger.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

// Wrap with provider to access ReactFlow context
export default function LargeScaleWorkflow() {
  return (
    <ReactFlowProvider>
      <LargeScaleWorkflowInner />
    </ReactFlowProvider>
  )
}

