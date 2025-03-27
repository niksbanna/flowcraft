"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { PlusCircleIcon } from "lucide-react"

type Integration = {
  id: string
  name: string
  icon: string
  status: "connected" | "disconnected"
  lastUsed?: string
  scopes?: string[]
}

export function IntegrationsList() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google",
      name: "Google Workspace",
      icon: "/placeholder.svg?height=40&width=40",
      status: "connected",
      lastUsed: "2 days ago",
      scopes: ["Drive", "Sheets", "Calendar"],
    },
    {
      id: "slack",
      name: "Slack",
      icon: "/placeholder.svg?height=40&width=40",
      status: "connected",
      lastUsed: "1 week ago",
      scopes: ["Channels", "Messages"],
    },
    {
      id: "github",
      name: "GitHub",
      icon: "/placeholder.svg?height=40&width=40",
      status: "disconnected",
    },
    {
      id: "salesforce",
      name: "Salesforce",
      icon: "/placeholder.svg?height=40&width=40",
      status: "disconnected",
    },
  ])

  const toggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map((integration) => {
        if (integration.id === id) {
          return {
            ...integration,
            status: integration.status === "connected" ? "disconnected" : "connected",
            lastUsed: integration.status === "disconnected" ? "Just now" : integration.lastUsed,
          }
        }
        return integration
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Connected Services</h3>
        <Button variant="outline" size="sm">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add New Integration
        </Button>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                <img
                  src={integration.icon || "/placeholder.svg"}
                  alt={integration.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{integration.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={integration.status === "connected" ? "default" : "outline"} className="text-xs">
                    {integration.status === "connected" ? "Connected" : "Disconnected"}
                  </Badge>
                  {integration.status === "connected" && (
                    <span className="text-xs text-muted-foreground">Last used: {integration.lastUsed}</span>
                  )}
                </div>
                {integration.status === "connected" && integration.scopes && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {integration.scopes.map((scope) => (
                      <Badge key={scope} variant="secondary" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={integration.status === "connected"}
                onCheckedChange={() => toggleIntegration(integration.id)}
                aria-label={`Toggle ${integration.name} integration`}
              />
              <Button variant="ghost" size="sm">
                Configure
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

