"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Database, Globe, FileJson } from "lucide-react"

interface ApiIntegrationNodesProps {
  onNodeAdd: (node: any) => void
}

// This component provides a UI for adding API integration nodes
// In a real app, these would connect to actual APIs
export default function ApiIntegrationNodes({ onNodeAdd }: ApiIntegrationNodesProps) {
  const [open, setOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("rest")
  const [nodeName, setNodeName] = useState("")

  const handleAddNode = () => {
    // In a real app, this would create a proper API node configuration
    const newNode = {
      id: `node-${Date.now()}`,
      type: "action",
      position: { x: 250, y: 250 },
      data: {
        label: nodeName || `${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} API`,
        icon: selectedTab === "rest" ? "🌐" : selectedTab === "graphql" ? "📊" : "💾",
        description: `Connect to ${selectedTab.toUpperCase()} API`,
        apiType: selectedTab,
        // In a real app, this would include actual API configuration
        config: {},
      },
    }

    onNodeAdd(newNode)
    setOpen(false)
    setNodeName("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          <Globe className="h-4 w-4" />
          Add API Integration
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Add API Integration</DialogTitle>
          <DialogDescription>Connect to external APIs and services.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="rest" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 bg-gray-900 border border-gray-800">
              <TabsTrigger value="rest" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>REST API</span>
              </TabsTrigger>
              <TabsTrigger value="graphql" className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                <span>GraphQL</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Database</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="node-name">Node Name</Label>
                <Input
                  id="node-name"
                  placeholder="My API Integration"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  className="bg-gray-900 border-gray-800"
                />
              </div>

              {/* REST API Configuration */}
              <TabsContent value="rest" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="rest-url">API URL</Label>
                  <Input
                    id="rest-url"
                    placeholder="https://api.example.com/v1/resource"
                    className="bg-gray-900 border-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rest-method">HTTP Method</Label>
                  <Select defaultValue="get">
                    <SelectTrigger className="bg-gray-900 border-gray-800">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="get">GET</SelectItem>
                      <SelectItem value="post">POST</SelectItem>
                      <SelectItem value="put">PUT</SelectItem>
                      <SelectItem value="delete">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rest-headers">Headers (JSON)</Label>
                  <Textarea
                    id="rest-headers"
                    placeholder='{"Content-Type": "application/json", "Authorization": "Bearer ${token}"}'
                    className="bg-gray-900 border-gray-800 font-mono text-sm min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rest-body">Request Body (JSON)</Label>
                  <Textarea
                    id="rest-body"
                    placeholder='{"key": "value"}'
                    className="bg-gray-900 border-gray-800 font-mono text-sm min-h-[100px]"
                  />
                </div>

                {/* Comment explaining API integration */}
                <div className="p-3 bg-blue-950/30 border border-blue-800 rounded text-sm">
                  <p className="text-blue-300">
                    <strong>Developer Note:</strong> In a production environment, this would make actual API calls. For
                    now, we're using static data to simulate responses. The real implementation would:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-blue-300 space-y-1">
                    <li>Make authenticated HTTP requests to the specified endpoint</li>
                    <li>Handle rate limiting and retries</li>
                    <li>Process and transform response data</li>
                    <li>Implement error handling and logging</li>
                  </ul>
                </div>
              </TabsContent>

              {/* GraphQL Configuration */}
              <TabsContent value="graphql" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="graphql-endpoint">GraphQL Endpoint</Label>
                  <Input
                    id="graphql-endpoint"
                    placeholder="https://api.example.com/graphql"
                    className="bg-gray-900 border-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graphql-query">GraphQL Query/Mutation</Label>
                  <Textarea
                    id="graphql-query"
                    placeholder={`query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}`}
                    className="bg-gray-900 border-gray-800 font-mono text-sm min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graphql-variables">Variables (JSON)</Label>
                  <Textarea
                    id="graphql-variables"
                    placeholder='{"id": "${userId}"}'
                    className="bg-gray-900 border-gray-800 font-mono text-sm min-h-[100px]"
                  />
                </div>

                {/* Comment explaining GraphQL integration */}
                <div className="p-3 bg-blue-950/30 border border-blue-800 rounded text-sm">
                  <p className="text-blue-300">
                    <strong>Developer Note:</strong> In a production environment, this would execute GraphQL operations.
                    Currently using static data for demonstration. The real implementation would:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-blue-300 space-y-1">
                    <li>Connect to GraphQL endpoints with proper authentication</li>
                    <li>Execute queries, mutations, and subscriptions</li>
                    <li>Support variable substitution from workflow data</li>
                    <li>Handle GraphQL-specific errors and validation</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Database Configuration */}
              <TabsContent value="database" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="db-type">Database Type</Label>
                  <Select defaultValue="postgres">
                    <SelectTrigger className="bg-gray-900 border-gray-800">
                      <SelectValue placeholder="Select database type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="postgres">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mongodb">MongoDB</SelectItem>
                      <SelectItem value="sqlite">SQLite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="db-connection">Connection String</Label>
                  <Input
                    id="db-connection"
                    placeholder="postgresql://user:password@localhost:5432/dbname"
                    className="bg-gray-900 border-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="db-query">Query</Label>
                  <Textarea
                    id="db-query"
                    placeholder="SELECT * FROM users WHERE id = $1"
                    className="bg-gray-900 border-gray-800 font-mono text-sm min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="db-params">Parameters (JSON)</Label>
                  <Input
                    id="db-params"
                    placeholder='["param1", "param2"]'
                    className="bg-gray-900 border-gray-800 font-mono"
                  />
                </div>

                {/* Comment explaining Database integration */}
                <div className="p-3 bg-blue-950/30 border border-blue-800 rounded text-sm">
                  <p className="text-blue-300">
                    <strong>Developer Note:</strong> In a production environment, this would execute database
                    operations. Currently using static data for demonstration. The real implementation would:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-blue-300 space-y-1">
                    <li>Establish secure database connections with connection pooling</li>
                    <li>Execute parameterized queries to prevent SQL injection</li>
                    <li>Support transactions and error handling</li>
                    <li>Implement connection retry logic and timeouts</li>
                  </ul>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddNode}>Add Node</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

