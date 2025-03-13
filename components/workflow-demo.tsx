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
  Panel,
  type NodeTypes,
  type EdgeTypes,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import ActionNode from "./nodes/action-node"
import CustomEdge from "./edges/custom-edge"

const nodeTypes: NodeTypes = {
  action: ActionNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "action",
    position: { x: 250, y: 50 },
    data: {
      label: "Scrape Website",
      icon: "🌐",
      description: "Extract data from any website",
    },
  },
  {
    id: "2",
    type: "action",
    position: { x: 250, y: 200 },
    data: {
      label: "Ask AI",
      icon: "🧠",
      description: "Process data with AI",
    },
  },
  {
    id: "3",
    type: "action",
    position: { x: 250, y: 350 },
    data: {
      label: "Write to Google Sheets",
      icon: "📊",
      description: "Save results to spreadsheet",
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "custom",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "custom",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
]

const nodeOptions = [
  {
    type: "action",
    label: "Data Source",
    icon: "📥",
    description: "Connect to external data",
  },
  {
    type: "action",
    label: "Transform",
    icon: "🔄",
    description: "Modify data format",
  },
  {
    type: "action",
    label: "Filter",
    icon: "🔍",
    description: "Filter data by conditions",
  },
  {
    type: "action",
    label: "Output",
    icon: "📤",
    description: "Send data to destination",
  },
]

export default function WorkflowDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
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

  const addNode = useCallback(
    (nodeData: any) => {
      const newNode = {
        id: `node_${Date.now()}`,
        type: nodeData.type,
        position: {
          x: Math.random() * 300 + 100,
          y: Math.random() * 300 + 100,
        },
        data: {
          label: nodeData.label,
          icon: nodeData.icon,
          description: nodeData.description,
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes],
  )

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  return (
    <div className="container px-4 md:px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Build Your Workflow</h2>
      <div className="border rounded-lg" style={{ height: 600 }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />

          <Panel position="top-right" className="bg-background border rounded-lg p-4 shadow-sm">
            <div className="space-y-4">
              <h3 className="font-medium">Add Node</h3>
              <div className="grid gap-2">
                {nodeOptions.map((option, index) => (
                  <Button key={index} variant="outline" className="justify-start" onClick={() => addNode(option)}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </Button>
                ))}
              </div>

              {selectedNode && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Selected: {selectedNode.data.label}</h3>
                  <Button variant="destructive" size="sm" className="w-full" onClick={deleteSelectedNode}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Node
                  </Button>
                </div>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}

