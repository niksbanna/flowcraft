"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Sample run history (more detailed for the runs page)
const sampleRuns = [
  {
    id: "run-1",
    startTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    endTime: new Date(Date.now() - 1000 * 60 * 4.9), // 4.9 minutes ago
    status: "success",
    duration: "6.2s",
    trigger: "Manual",
    user: "nikstea88@gmail.com",
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
    duration: "5.3s",
    trigger: "Schedule",
    user: "system",
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
    duration: "10.6s",
    trigger: "Webhook",
    user: "api",
    nodeResults: [
      { nodeId: "linkedin-profile", status: "success", duration: "0.06s" },
      { nodeId: "error-shield", status: "success", duration: "0.01s" },
      { nodeId: "linkedin-scraping", status: "success", duration: "10.45s" },
      { nodeId: "combine-test", status: "success", duration: "0.02s" },
      { nodeId: "output", status: "success", duration: "0.03s" },
    ],
  },
  {
    id: "run-4",
    startTime: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    endTime: new Date(Date.now() - 1000 * 60 * 119.9), // 1.99 hours ago
    status: "success",
    duration: "8.3s",
    trigger: "Manual",
    user: "nikstea88@gmail.com",
    nodeResults: [
      { nodeId: "linkedin-profile", status: "success", duration: "0.05s" },
      { nodeId: "error-shield", status: "success", duration: "0.01s" },
      { nodeId: "linkedin-scraping", status: "success", duration: "8.1s" },
      { nodeId: "combine-test", status: "success", duration: "0.01s" },
      { nodeId: "output", status: "success", duration: "0.02s" },
    ],
  },
  {
    id: "run-5",
    startTime: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    endTime: new Date(Date.now() - 1000 * 60 * 179.9), // 2.99 hours ago
    status: "error",
    duration: "3.2s",
    trigger: "Schedule",
    user: "system",
    nodeResults: [
      { nodeId: "linkedin-profile", status: "error", duration: "3.15s", error: "Invalid LinkedIn URL format" },
      { nodeId: "error-shield", status: "skipped", duration: "0s" },
      { nodeId: "linkedin-scraping", status: "skipped", duration: "0s" },
      { nodeId: "combine-test", status: "skipped", duration: "0s" },
      { nodeId: "output", status: "skipped", duration: "0s" },
    ],
  },
]

export default function WorkflowRuns({ workflowId }: { workflowId: string }) {
  const [runs, setRuns] = useState(sampleRuns)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container px-4 md:px-6 py-4">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/workflow/${workflowId}`}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Run History</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Last 7 days
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search runs..."
            className="pl-10 bg-gray-900 border-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Runs list */}
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-900 p-3 border-b border-gray-800 grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Started</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-2">Trigger</div>
            <div className="col-span-3">User</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-800">
            {runs.map((run) => (
              <div key={run.id} className="p-3 grid grid-cols-12 gap-4 items-center hover:bg-gray-900/50">
                <div className="col-span-1">
                  {run.status === "success" ? (
                    <Badge className="bg-green-600">Success</Badge>
                  ) : run.status === "error" ? (
                    <Badge variant="destructive">Failed</Badge>
                  ) : (
                    <Badge className="bg-yellow-600">Running</Badge>
                  )}
                </div>

                <div className="col-span-2 text-sm">{run.startTime.toLocaleString()}</div>

                <div className="col-span-2 text-sm">{run.duration}</div>

                <div className="col-span-2 text-sm">{run.trigger}</div>

                <div className="col-span-3 text-sm truncate">{run.user}</div>

                <div className="col-span-2 flex justify-end space-x-2">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    Rerun
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

