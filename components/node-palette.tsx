"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Zap, GitBranch, FileJson, Globe, Bot } from "lucide-react"

interface NodePaletteProps {
  onAddNode: (nodeData: any) => void
}

export default function NodePalette({ onAddNode }: NodePaletteProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Node templates organized by category
  const nodeTemplates = {
    Triggers: [
      {
        type: "trigger",
        category: "trigger",
        data: {
          label: "Webhook",
          icon: "🔗",
          description: "Start workflow from HTTP request",
          triggerType: "webhook",
          outputs: ["payload", "headers"],
          help: "Triggers workflow when an HTTP request is received at the webhook URL.",
        },
      },
      {
        type: "trigger",
        category: "trigger",
        data: {
          label: "Schedule",
          icon: "⏰",
          description: "Run workflow on a schedule",
          triggerType: "schedule",
          triggerConfig: "0 * * * *",
          outputs: ["timestamp"],
          help: "Triggers workflow based on a cron schedule expression.",
        },
      },
      {
        type: "trigger",
        category: "trigger",
        data: {
          label: "Event",
          icon: "📡",
          description: "Respond to system events",
          triggerType: "event",
          outputs: ["event", "data"],
          help: "Triggers workflow when a specific system event occurs.",
        },
      },
      {
        type: "trigger",
        category: "trigger",
        data: {
          label: "Manual",
          icon: "👆",
          description: "Trigger workflow manually",
          triggerType: "manual",
          outputs: ["inputs"],
          help: "Allows manual triggering of the workflow with optional input parameters.",
        },
      },
    ],
    Logic: [
      {
        type: "condition",
        category: "condition",
        data: {
          label: "If Condition",
          icon: "🔀",
          description: "Branch based on condition",
          condition: "data.value > 100",
          inputs: ["data"],
          outputs: ["result"],
          help: "Evaluates a condition and routes flow based on true/false result.",
        },
      },
      {
        type: "condition",
        category: "condition",
        data: {
          label: "Switch",
          icon: "🔄",
          description: "Multi-way branching",
          condition: "data.status",
          inputs: ["data"],
          outputs: ["result"],
          help: "Routes flow based on multiple possible values of an expression.",
        },
      },
      {
        type: "loop",
        category: "loop",
        data: {
          label: "For Each",
          icon: "🔁",
          description: "Iterate over a collection",
          loopType: "forEach",
          loopConfig: "item in data.items",
          inputs: ["data"],
          outputs: ["item", "index"],
          help: "Iterates over each item in a collection, executing the loop body for each item.",
        },
      },
      {
        type: "loop",
        category: "loop",
        data: {
          label: "While Loop",
          icon: "🔄",
          description: "Repeat while condition is true",
          loopType: "while",
          loopConfig: "data.condition === true",
          inputs: ["data"],
          outputs: ["iteration"],
          help: "Repeats execution as long as a specified condition evaluates to true.",
        },
      },
      {
        type: "loop",
        category: "loop",
        data: {
          label: "Count Loop",
          icon: "🔢",
          description: "Repeat a specific number of times",
          loopType: "count",
          loopConfig: "10",
          inputs: ["count"],
          outputs: ["index"],
          help: "Repeats execution a specified number of times.",
        },
      },
    ],
    Transformations: [
      {
        type: "transformation",
        category: "transformation",
        data: {
          label: "Map",
          icon: "🔄",
          description: "Transform each item in a collection",
          transformType: "map",
          transformConfig: "item => ({ ...item, processed: true })",
          inputs: ["items"],
          outputs: ["result"],
          help: "Transforms each item in a collection to create a new collection.",
        },
      },
      {
        type: "transformation",
        category: "transformation",
        data: {
          label: "Filter",
          icon: "🔍",
          description: "Filter items based on criteria",
          transformType: "filter",
          transformConfig: "item => item.value > 10",
          inputs: ["items"],
          outputs: ["filtered"],
          help: "Filters items in a collection based on a condition.",
        },
      },
      {
        type: "transformation",
        category: "transformation",
        data: {
          label: "Sort",
          icon: "📊",
          description: "Sort collection of items",
          transformType: "sort",
          transformConfig: "(a, b) => a.value - b.value",
          inputs: ["items"],
          outputs: ["sorted"],
          help: "Sorts items in a collection based on a comparison function.",
        },
      },
      {
        type: "transformation",
        category: "transformation",
        data: {
          label: "JSON Transform",
          icon: "📝",
          description: "Transform JSON structure",
          transformType: "custom",
          transformConfig: "data => ({ result: data.value * 2 })",
          inputs: ["data"],
          outputs: ["transformed"],
          help: "Applies a custom transformation to JSON data.",
        },
      },
    ],
    Actions: [
      {
        type: "action",
        category: "action",
        data: {
          label: "HTTP Request",
          icon: "🌐",
          description: "Make API calls",
          inputs: ["url", "method", "headers", "body"],
          outputs: ["response", "status"],
          help: "Makes HTTP requests to external APIs and services.",
        },
      },
      {
        type: "action",
        category: "action",
        data: {
          label: "Database Query",
          icon: "💾",
          description: "Query a database",
          inputs: ["query", "params"],
          outputs: ["results", "rowCount"],
          help: "Executes a database query and returns the results.",
        },
      },
      {
        type: "action",
        category: "action",
        data: {
          label: "Send Email",
          icon: "📧",
          description: "Send email notification",
          inputs: ["to", "subject", "body"],
          outputs: ["sent", "messageId"],
          help: "Sends an email to specified recipients.",
        },
      },
      {
        type: "action",
        category: "action",
        data: {
          label: "File Operation",
          icon: "📁",
          description: "Read or write files",
          inputs: ["path", "operation", "content"],
          outputs: ["result"],
          help: "Performs file operations like read, write, or delete.",
        },
      },
    ],
    AI: [
      {
        type: "action",
        category: "ai",
        data: {
          label: "Text Generation",
          icon: "✍️",
          description: "Generate text with AI",
          inputs: ["prompt", "options"],
          outputs: ["text"],
          help: "Generates text using AI models based on a prompt.",
        },
      },
      {
        type: "action",
        category: "ai",
        data: {
          label: "Classification",
          icon: "🏷️",
          description: "Classify data with AI",
          inputs: ["text", "categories"],
          outputs: ["category", "confidence"],
          help: "Classifies input data into predefined categories using AI.",
        },
      },
      {
        type: "action",
        category: "ai",
        data: {
          label: "Sentiment Analysis",
          icon: "😀",
          description: "Analyze sentiment of text",
          inputs: ["text"],
          outputs: ["sentiment", "score"],
          help: "Analyzes the sentiment of text as positive, negative, or neutral.",
        },
      },
      {
        type: "action",
        category: "ai",
        data: {
          label: "Image Generation",
          icon: "🖼️",
          description: "Generate images with AI",
          inputs: ["prompt", "options"],
          outputs: ["imageUrl"],
          help: "Generates images using AI models based on a text prompt.",
        },
      },
    ],
  }

  // Filter nodes based on search term
  const filterNodes = (nodes: any[]) => {
    if (!searchTerm) return nodes
    return nodes.filter(
      (node) =>
        node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.data.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Triggers":
        return <Zap className="h-4 w-4" />
      case "Logic":
        return <GitBranch className="h-4 w-4" />
      case "Transformations":
        return <FileJson className="h-4 w-4" />
      case "Actions":
        return <Globe className="h-4 w-4" />
      case "AI":
        return <Bot className="h-4 w-4" />
      default:
        return <Plus className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Node Palette</CardTitle>
        <CardDescription>Drag and drop nodes to your workflow</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            className="pl-8 bg-gray-900 border-gray-800 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <Tabs defaultValue="Triggers">
          <TabsList className="w-full mb-4">
            {Object.keys(nodeTemplates).map((category) => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-1">
                {getCategoryIcon(category)}
                <span className="hidden sm:inline">{category}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(nodeTemplates).map(([category, templates]) => (
            <TabsContent key={category} value={category} className="m-0">
              <div className="grid gap-2">
                {filterNodes(templates).map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-2"
                    onClick={() => onAddNode(template)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="text-xl mt-0.5">{template.data.icon}</div>
                      <div>
                        <div className="font-medium">{template.data.label}</div>
                        <div className="text-xs text-muted-foreground">{template.data.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}

                {filterNodes(templates).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No nodes match your search</div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

