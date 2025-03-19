"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Copy, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WorkflowTemplatesProps {
  onSelectTemplate: (template: any) => void
}

export default function WorkflowTemplates({ onSelectTemplate }: WorkflowTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Template categories
  const categories = [
    "All",
    "Data Processing",
    "Content Generation",
    "API Integration",
    "Social Media",
    "Email Automation",
    "Analytics",
  ]

  // Sample templates with actual node configurations
  const templates = [
    {
      id: "data-transformation",
      name: "Data Transformation Pipeline",
      description: "Extract, transform, and load data from one format to another",
      category: "Data Processing",
      popularity: "Popular",
      nodes: [
        {
          id: "node-1",
          type: "trigger",
          position: { x: 250, y: 50 },
          data: {
            label: "Webhook Trigger",
            icon: "🔗",
            description: "Start when data is received",
            category: "trigger",
            triggerType: "webhook",
            outputs: ["payload"],
          },
        },
        {
          id: "node-2",
          type: "transformation",
          position: { x: 250, y: 200 },
          data: {
            label: "Parse JSON",
            icon: "📝",
            description: "Parse incoming JSON data",
            category: "transformation",
            transformType: "custom",
            inputs: ["payload"],
            outputs: ["parsed"],
          },
        },
        {
          id: "node-3",
          type: "transformation",
          position: { x: 250, y: 350 },
          data: {
            label: "Map Fields",
            icon: "🔄",
            description: "Map fields to target schema",
            category: "transformation",
            transformType: "map",
            inputs: ["parsed"],
            outputs: ["mapped"],
          },
        },
        {
          id: "node-4",
          type: "action",
          position: { x: 250, y: 500 },
          data: {
            label: "Save to Database",
            icon: "💾",
            description: "Store processed data",
            category: "action",
            inputs: ["mapped"],
            outputs: ["result"],
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "node-1", target: "node-2", type: "custom", animated: true },
        { id: "e2-3", source: "node-2", target: "node-3", type: "custom", animated: true },
        { id: "e3-4", source: "node-3", target: "node-4", type: "custom", animated: true },
      ],
    },
    {
      id: "content-scheduler",
      name: "Content Scheduler",
      description: "Schedule and publish content across multiple platforms automatically",
      category: "Social Media",
      popularity: "New",
      nodes: [
        {
          id: "node-1",
          type: "trigger",
          position: { x: 250, y: 50 },
          data: {
            label: "Schedule Trigger",
            icon: "⏰",
            description: "Run on schedule",
            category: "trigger",
            triggerType: "schedule",
            triggerConfig: "0 9 * * *",
            outputs: ["timestamp"],
          },
        },
        {
          id: "node-2",
          type: "action",
          position: { x: 250, y: 200 },
          data: {
            label: "Fetch Content",
            icon: "📋",
            description: "Get content from CMS",
            category: "action",
            inputs: ["date"],
            outputs: ["content"],
          },
        },
        {
          id: "node-3",
          type: "condition",
          position: { x: 250, y: 350 },
          data: {
            label: "Has Content?",
            icon: "🔀",
            description: "Check if content exists",
            category: "condition",
            condition: "content.length > 0",
            inputs: ["content"],
          },
        },
        {
          id: "node-4",
          type: "action",
          position: { x: 100, y: 500 },
          data: {
            label: "Post to Twitter",
            icon: "🐦",
            description: "Share on Twitter",
            category: "action",
            inputs: ["content"],
            outputs: ["twitterResult"],
          },
        },
        {
          id: "node-5",
          type: "action",
          position: { x: 400, y: 500 },
          data: {
            label: "Post to LinkedIn",
            icon: "💼",
            description: "Share on LinkedIn",
            category: "action",
            inputs: ["content"],
            outputs: ["linkedinResult"],
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "node-1", target: "node-2", type: "custom", animated: true },
        { id: "e2-3", source: "node-2", target: "node-3", type: "custom", animated: true },
        { id: "e3-4", source: "node-3", target: "node-4", type: "custom", animated: true, sourceHandle: "true" },
        { id: "e3-5", source: "node-3", target: "node-5", type: "custom", animated: true, sourceHandle: "true" },
      ],
    },
    {
      id: "email-campaign",
      name: "Email Campaign Manager",
      description: "Create, schedule, and track email campaigns with analytics",
      category: "Email Automation",
      popularity: "Popular",
      nodes: [
        {
          id: "node-1",
          type: "trigger",
          position: { x: 250, y: 50 },
          data: {
            label: "Manual Trigger",
            icon: "👆",
            description: "Start campaign manually",
            category: "trigger",
            triggerType: "manual",
            outputs: ["inputs"],
          },
        },
        {
          id: "node-2",
          type: "action",
          position: { x: 250, y: 200 },
          data: {
            label: "Fetch Subscribers",
            icon: "👥",
            description: "Get subscriber list",
            category: "action",
            inputs: ["listId"],
            outputs: ["subscribers"],
          },
        },
        {
          id: "node-3",
          type: "loop",
          position: { x: 250, y: 350 },
          data: {
            label: "For Each Subscriber",
            icon: "🔁",
            description: "Process each subscriber",
            category: "loop",
            loopType: "forEach",
            loopConfig: "subscriber in subscribers",
            inputs: ["subscribers"],
            outputs: ["subscriber"],
          },
        },
        {
          id: "node-4",
          type: "action",
          position: { x: 250, y: 500 },
          data: {
            label: "Send Email",
            icon: "📧",
            description: "Send personalized email",
            category: "action",
            inputs: ["subscriber", "template"],
            outputs: ["sent"],
          },
        },
        {
          id: "node-5",
          type: "action",
          position: { x: 250, y: 650 },
          data: {
            label: "Track Analytics",
            icon: "📊",
            description: "Record email metrics",
            category: "action",
            inputs: ["sent"],
            outputs: ["analytics"],
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "node-1", target: "node-2", type: "custom", animated: true },
        { id: "e2-3", source: "node-2", target: "node-3", type: "custom", animated: true },
        { id: "e3-4", source: "node-3", target: "node-4", type: "custom", animated: true, sourceHandle: "body" },
        { id: "e4-5", source: "node-4", target: "node-5", type: "custom", animated: true },
        { id: "e3-5", source: "node-3", target: "node-5", type: "custom", animated: true, sourceHandle: "exit" },
      ],
    },
    {
      id: "api-connector",
      name: "API Data Connector",
      description: "Connect multiple APIs and transform data between them",
      category: "API Integration",
      popularity: "Featured",
      nodes: [
        {
          id: "node-1",
          type: "trigger",
          position: { x: 250, y: 50 },
          data: {
            label: "Webhook Trigger",
            icon: "🔗",
            description: "Receive API request",
            category: "trigger",
            triggerType: "webhook",
            outputs: ["payload"],
          },
        },
        {
          id: "node-2",
          type: "action",
          position: { x: 250, y: 200 },
          data: {
            label: "API Request 1",
            icon: "🌐",
            description: "Call first external API",
            category: "action",
            inputs: ["payload"],
            outputs: ["response1"],
          },
        },
        {
          id: "node-3",
          type: "transformation",
          position: { x: 250, y: 350 },
          data: {
            label: "Transform Data",
            icon: "🔄",
            description: "Convert data format",
            category: "transformation",
            transformType: "map",
            inputs: ["response1"],
            outputs: ["transformed"],
          },
        },
        {
          id: "node-4",
          type: "action",
          position: { x: 250, y: 500 },
          data: {
            label: "API Request 2",
            icon: "🌐",
            description: "Call second external API",
            category: "action",
            inputs: ["transformed"],
            outputs: ["response2"],
          },
        },
        {
          id: "node-5",
          type: "action",
          position: { x: 250, y: 650 },
          data: {
            label: "Send Response",
            icon: "📤",
            description: "Return final response",
            category: "action",
            inputs: ["response2"],
            outputs: ["result"],
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "node-1", target: "node-2", type: "custom", animated: true },
        { id: "e2-3", source: "node-2", target: "node-3", type: "custom", animated: true },
        { id: "e3-4", source: "node-3", target: "node-4", type: "custom", animated: true },
        { id: "e4-5", source: "node-4", target: "node-5", type: "custom", animated: true },
      ],
    },
    {
      id: "content-generator",
      name: "AI Content Generator",
      description: "Generate blog posts, social media content, and more using AI",
      category: "Content Generation",
      popularity: "Popular",
      nodes: [
        {
          id: "node-1",
          type: "trigger",
          position: { x: 250, y: 50 },
          data: {
            label: "Manual Trigger",
            icon: "👆",
            description: "Start content generation",
            category: "trigger",
            triggerType: "manual",
            outputs: ["inputs"],
          },
        },
        {
          id: "node-2",
          type: "action",
          position: { x: 250, y: 200 },
          data: {
            label: "Get Topic Ideas",
            icon: "💡",
            description: "Generate content topics",
            category: "ai",
            inputs: ["keywords"],
            outputs: ["topics"],
          },
        },
        {
          id: "node-3",
          type: "loop",
          position: { x: 250, y: 350 },
          data: {
            label: "For Each Topic",
            icon: "🔁",
            description: "Process each topic",
            category: "loop",
            loopType: "forEach",
            loopConfig: "topic in topics",
            inputs: ["topics"],
            outputs: ["topic"],
          },
        },
        {
          id: "node-4",
          type: "action",
          position: { x: 250, y: 500 },
          data: {
            label: "Generate Content",
            icon: "✍️",
            description: "Create content with AI",
            category: "ai",
            inputs: ["topic", "style"],
            outputs: ["content"],
          },
        },
        {
          id: "node-5",
          type: "action",
          position: { x: 250, y: 650 },
          data: {
            label: "Save Content",
            icon: "💾",
            description: "Store generated content",
            category: "action",
            inputs: ["content"],
            outputs: ["saved"],
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "node-1", target: "node-2", type: "custom", animated: true },
        { id: "e2-3", source: "node-2", target: "node-3", type: "custom", animated: true },
        { id: "e3-4", source: "node-3", target: "node-4", type: "custom", animated: true, sourceHandle: "body" },
        { id: "e4-5", source: "node-4", target: "node-5", type: "custom", animated: true },
        { id: "e3-5", source: "node-3", target: "node-5", type: "custom", animated: true, sourceHandle: "exit" },
      ],
    },
  ]

  // Filter templates based on search and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle template selection
  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template)
    setPreviewOpen(true)
  }

  // Handle template use
  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      setPreviewOpen(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-10 bg-gray-900 border-gray-800 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={category === selectedCategory ? "default" : "outline"}
              size="sm"
              className={category === selectedCategory ? "bg-purple-600 hover:bg-purple-700" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="bg-gray-950 border-gray-800 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{template.name}</CardTitle>
                  <div className="px-2 py-1 text-xs rounded bg-purple-900/50 text-purple-300 border border-purple-800">
                    {template.popularity}
                  </div>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Category: {template.category}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-gray-800 mr-2">
                    {template.nodes.length} nodes
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800">
                    {template.edges.length} connections
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                <Button variant="ghost" size="sm" onClick={() => handleSelectTemplate(template)}>
                  Preview
                </Button>
                <Button size="sm" className="gap-1" onClick={() => onSelectTemplate(template)}>
                  <Copy className="h-4 w-4" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No templates match your search criteria</p>
          </div>
        )}
      </div>

      {/* Template preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] bg-gray-950 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Tabs defaultValue="overview">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="nodes">Nodes</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Template Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{selectedTemplate?.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nodes:</span>
                        <span>{selectedTemplate?.nodes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Connections:</span>
                        <span>{selectedTemplate?.edges.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Complexity:</span>
                        <span>
                          {selectedTemplate?.nodes.length <= 3
                            ? "Simple"
                            : selectedTemplate?.nodes.length <= 5
                              ? "Medium"
                              : "Complex"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Use Cases</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedTemplate?.category === "Data Processing" && (
                        <>
                          <li>ETL data pipelines</li>
                          <li>Data cleaning and normalization</li>
                          <li>Format conversion</li>
                        </>
                      )}
                      {selectedTemplate?.category === "Social Media" && (
                        <>
                          <li>Content scheduling</li>
                          <li>Cross-platform posting</li>
                          <li>Social media monitoring</li>
                        </>
                      )}
                      {selectedTemplate?.category === "Email Automation" && (
                        <>
                          <li>Email marketing campaigns</li>
                          <li>Drip email sequences</li>
                          <li>Newsletter distribution</li>
                        </>
                      )}
                      {selectedTemplate?.category === "API Integration" && (
                        <>
                          <li>API data synchronization</li>
                          <li>Webhook processing</li>
                          <li>Third-party integrations</li>
                        </>
                      )}
                      {selectedTemplate?.category === "Content Generation" && (
                        <>
                          <li>Blog post creation</li>
                          <li>Social media content</li>
                          <li>Product descriptions</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Workflow Overview</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedTemplate?.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-xs">1</div>
                      <div className="text-sm">
                        {selectedTemplate?.nodes[0]?.data.label} - {selectedTemplate?.nodes[0]?.data.description}
                      </div>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-700 h-4"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-xs">2</div>
                      <div className="text-sm">
                        {selectedTemplate?.nodes[1]?.data.label} - {selectedTemplate?.nodes[1]?.data.description}
                      </div>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-700 h-4"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-xs">3</div>
                      <div className="text-sm">
                        {selectedTemplate?.nodes[2]?.data.label} - {selectedTemplate?.nodes[2]?.data.description}
                      </div>
                    </div>
                    {selectedTemplate?.nodes.length > 3 && (
                      <>
                        <div className="ml-3 border-l-2 border-gray-700 h-4"></div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-xs">
                            ...
                          </div>
                          <div className="text-sm text-muted-foreground">
                            And {selectedTemplate.nodes.length - 3} more steps
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="nodes" className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Node List</h3>
                  <div className="space-y-3 mt-4">
                    {selectedTemplate?.nodes.map((node, index) => (
                      <div key={index} className="border border-gray-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-xl">{node.data.icon}</div>
                          <div className="font-medium">{node.data.label}</div>
                          <Badge variant="outline" className="ml-auto bg-gray-800 text-xs">
                            {node.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">{node.data.description}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {node.data.inputs && (
                            <div>
                              <span className="text-blue-400 font-medium">Inputs: </span>
                              <span className="text-muted-foreground">{node.data.inputs.join(", ")}</span>
                            </div>
                          )}
                          {node.data.outputs && (
                            <div>
                              <span className="text-green-400 font-medium">Outputs: </span>
                              <span className="text-muted-foreground">{node.data.outputs.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="connections" className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Connections</h3>
                  <div className="space-y-2 mt-4">
                    {selectedTemplate?.edges.map((edge, index) => {
                      const sourceNode = selectedTemplate.nodes.find((n) => n.id === edge.source)
                      const targetNode = selectedTemplate.nodes.find((n) => n.id === edge.target)
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm border-b border-gray-800 pb-2">
                          <div className="font-medium">{sourceNode?.data.label}</div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">{targetNode?.data.label}</div>
                          {edge.sourceHandle && (
                            <Badge variant="outline" className="ml-auto bg-gray-800 text-xs">
                              {edge.sourceHandle}
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUseTemplate}>Use Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

