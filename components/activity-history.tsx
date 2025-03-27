"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlayIcon, PencilIcon, TrashIcon, ShareIcon, PlusIcon, FilterIcon } from "lucide-react"

type ActivityItem = {
  id: string
  type: "run" | "edit" | "delete" | "share" | "create"
  description: string
  resource: string
  resourceId: string
  timestamp: string
}

export function ActivityHistory() {
  const [filter, setFilter] = useState("all")

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "act1",
      type: "run",
      description: "Ran workflow",
      resource: "Customer Onboarding",
      resourceId: "wf-123",
      timestamp: "Today, 10:30 AM",
    },
    {
      id: "act2",
      type: "edit",
      description: "Edited workflow",
      resource: "Data Processing Pipeline",
      resourceId: "wf-456",
      timestamp: "Yesterday, 3:45 PM",
    },
    {
      id: "act3",
      type: "share",
      description: "Shared workflow with Marketing team",
      resource: "Social Media Automation",
      resourceId: "wf-789",
      timestamp: "2 days ago",
    },
    {
      id: "act4",
      type: "create",
      description: "Created new workflow",
      resource: "Invoice Processing",
      resourceId: "wf-101",
      timestamp: "3 days ago",
    },
    {
      id: "act5",
      type: "delete",
      description: "Deleted workflow",
      resource: "Legacy Process",
      resourceId: "wf-202",
      timestamp: "1 week ago",
    },
  ])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "run":
        return <PlayIcon className="h-4 w-4 text-green-500" />
      case "edit":
        return <PencilIcon className="h-4 w-4 text-blue-500" />
      case "delete":
        return <TrashIcon className="h-4 w-4 text-red-500" />
      case "share":
        return <ShareIcon className="h-4 w-4 text-purple-500" />
      case "create":
        return <PlusIcon className="h-4 w-4 text-teal-500" />
      default:
        return null
    }
  }

  const filteredActivities = filter === "all" ? activities : activities.filter((activity) => activity.type === filter)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="run">Workflow Runs</SelectItem>
              <SelectItem value="edit">Edits</SelectItem>
              <SelectItem value="share">Shares</SelectItem>
              <SelectItem value="create">Creations</SelectItem>
              <SelectItem value="delete">Deletions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No activities found for the selected filter.</div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{activity.resource}</span> • {activity.timestamp}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}

