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
import { Switch } from "@/components/ui/switch"
import { Plus, Mail, Webhook, Clock, MessageSquare } from "lucide-react"

interface TriggerSelectorProps {
  onTriggerAdd: (trigger: any) => void
}

export default function TriggerSelector({ onTriggerAdd }: TriggerSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("webhook")
  const [triggerName, setTriggerName] = useState("")

  const handleAddTrigger = () => {
    // In a real app, this would create a proper trigger configuration
    const newTrigger = {
      id: `trigger-${Date.now()}`,
      type: selectedTab,
      name: triggerName || `${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Trigger`,
      config: {},
    }

    onTriggerAdd(newTrigger)
    setOpen(false)
    setTriggerName("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Trigger
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Add Trigger</DialogTitle>
          <DialogDescription>Select a trigger to start your workflow automatically.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="webhook" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-4 bg-gray-900 border border-gray-800">
              <TabsTrigger value="webhook" className="flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                <span>Webhook</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="slack" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Slack</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trigger-name">Trigger Name</Label>
                <Input
                  id="trigger-name"
                  placeholder="My Trigger"
                  value={triggerName}
                  onChange={(e) => setTriggerName(e.target.value)}
                  className="bg-gray-900 border-gray-800"
                />
              </div>

              <TabsContent value="webhook" className="space-y-4 mt-4">
                <div className="p-4 bg-gray-900 border border-gray-800 rounded-md">
                  <h3 className="font-medium mb-2">Webhook URL</h3>
                  <div className="bg-gray-800 p-2 rounded font-mono text-sm mb-2">
                    https://api.flowcraft.io/triggers/webhook/abc123
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send a POST request to this URL to trigger your workflow.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-method">HTTP Method</Label>
                  <Select defaultValue="post">
                    <SelectTrigger className="bg-gray-900 border-gray-800">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="get">GET</SelectItem>
                      <SelectItem value="post">POST</SelectItem>
                      <SelectItem value="put">PUT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-auth">Require Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require API key for webhook requests</p>
                  </div>
                  <Switch id="require-auth" defaultChecked />
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="cron-expression">Cron Expression</Label>
                  <Input
                    id="cron-expression"
                    placeholder="0 * * * *"
                    className="bg-gray-900 border-gray-800 font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    Use cron syntax to define the schedule (e.g., "0 * * * *" for hourly)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="bg-gray-900 border-gray-800">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (EST/EDT)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST/PDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-address">Email Address</Label>
                  <Input
                    id="email-address"
                    placeholder="trigger@flowcraft.io"
                    className="bg-gray-900 border-gray-800"
                  />
                  <p className="text-sm text-muted-foreground">
                    Emails sent to this address will trigger your workflow
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject-filter">Subject Filter (Optional)</Label>
                  <Input id="subject-filter" placeholder="[Trigger]" className="bg-gray-900 border-gray-800" />
                  <p className="text-sm text-muted-foreground">Only trigger on emails with this text in the subject</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="include-attachments">Include Attachments</Label>
                    <p className="text-sm text-muted-foreground">Pass email attachments to the workflow</p>
                  </div>
                  <Switch id="include-attachments" defaultChecked />
                </div>
              </TabsContent>

              <TabsContent value="slack" className="space-y-4 mt-4">
                <div className="p-4 bg-gray-900 border border-gray-800 rounded-md">
                  <h3 className="font-medium mb-2">Slack Integration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Slack workspace to trigger workflows from messages or events.
                  </p>
                  <Button className="w-full">Connect Slack Workspace</Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slack-event">Slack Event</Label>
                  <Select defaultValue="message">
                    <SelectTrigger className="bg-gray-900 border-gray-800">
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="message">New Message</SelectItem>
                      <SelectItem value="reaction">Reaction Added</SelectItem>
                      <SelectItem value="channel">Channel Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slack-channel">Channel Filter (Optional)</Label>
                  <Input id="slack-channel" placeholder="#triggers" className="bg-gray-900 border-gray-800" />
                  <p className="text-sm text-muted-foreground">Only trigger on events from this channel</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddTrigger}>Add Trigger</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

