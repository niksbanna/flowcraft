"use client"

import { useState } from "react"
import type { Node } from "reactflow"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react"

interface NodeResult {
  nodeId: string
  status: "success" | "error" | "running" | "pending" | "skipped"
  duration: string
  error?: string
}

interface WorkflowRunItemProps {
  node: Node
  result: NodeResult
}

export default function WorkflowRunItem({ node, result }: WorkflowRunItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-900"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="mr-3">
            {node.data.icon === "🔍" ? (
              <div className="bg-blue-800 p-1.5 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7H2v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="8" y="2" width="8" height="6" rx="1"></rect>
                </svg>
              </div>
            ) : node.data.icon === "🕸️" ? (
              <div className="bg-purple-800 p-1.5 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
            ) : node.data.icon === "🛡️" ? (
              <div className="bg-red-800 p-1.5 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
            ) : node.data.icon === "🔄" ? (
              <div className="bg-yellow-800 p-1.5 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 2v6h-6"></path>
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                  <path d="M3 22v-6h6"></path>
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                </svg>
              </div>
            ) : (
              <div className="bg-green-800 p-1.5 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
            )}
          </div>

          <div>
            <div className="font-medium">{node.data.label}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {result.status === "pending" ? (
            <Badge variant="outline" className="bg-gray-800 text-gray-300">
              Pending
            </Badge>
          ) : result.status === "running" ? (
            <Badge className="bg-yellow-600">Running</Badge>
          ) : result.status === "success" ? (
            <Badge className="bg-green-600">Success</Badge>
          ) : result.status === "error" ? (
            <Badge variant="destructive">Failed</Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-800 text-gray-300">
              Skipped
            </Badge>
          )}

          {result.status !== "pending" && result.status !== "skipped" && (
            <div className="text-sm text-muted-foreground">{result.duration}</div>
          )}

          {expanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="p-4 pt-0 bg-gray-900/50">
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="sm" className="text-xs">
              See all inputs and outputs
            </Button>
          </div>

          {result.error && (
            <div className="bg-red-950/30 border border-red-800 rounded p-3 mb-3">
              <div className="flex items-center text-red-400 mb-1">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-sm text-red-300">{result.error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Inputs</h4>
              <div className="space-y-2">
                {node.data.inputs?.map((input: string, index: number) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded p-2 text-sm">
                    {input}: <span className="text-muted-foreground italic">No value</span>
                  </div>
                ))}
                {!node.data.inputs?.length && <div className="text-sm text-muted-foreground italic">No inputs</div>}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Outputs</h4>
              <div className="space-y-2">
                {node.data.outputs?.map((output: string, index: number) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded p-2 text-sm">
                    {output}: <span className="text-muted-foreground italic">No value</span>
                  </div>
                ))}
                {!node.data.outputs?.length && <div className="text-sm text-muted-foreground italic">No outputs</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

