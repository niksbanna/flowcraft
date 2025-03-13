"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"

export default function WorkflowSettings({ workflowId }: { workflowId: string }) {
  const [workflowName, setWorkflowName] = useState("LinkedIn Profile Analysis (w/ Interface)")
  const [workflowDescription, setWorkflowDescription] = useState("Analyze LinkedIn profiles and generate insights")
  const [isPublic, setIsPublic] = useState(false)
  const [runTimeout, setRunTimeout] = useState("300")
  const [maxRetries, setMaxRetries] = useState("3")

  return (
    <div className="container px-4 md:px-6 py-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href={`/workflow/${workflowId}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Workflow Settings</h1>
        </div>

        {/* Settings tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic information about your workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="bg-gray-900 border-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea
                    id="workflow-description"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="bg-gray-900 border-gray-800 min-h-[100px]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-workflow">Public Workflow</Label>
                    <p className="text-sm text-muted-foreground">Allow others to view and clone this workflow</p>
                  </div>
                  <Switch id="public-workflow" checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Workflow
              </Button>

              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="execution" className="space-y-6">
            <Card className="bg-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle>Execution Settings</CardTitle>
                <CardDescription>Configure how your workflow executes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="run-timeout">Run Timeout (seconds)</Label>
                  <Input
                    id="run-timeout"
                    type="number"
                    value={runTimeout}
                    onChange={(e) => setRunTimeout(e.target.value)}
                    className="bg-gray-900 border-gray-800"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum time a workflow run can execute before timing out
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-retries">Maximum Retries</Label>
                  <Input
                    id="max-retries"
                    type="number"
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(e.target.value)}
                    className="bg-gray-900 border-gray-800"
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of times to retry a failed node before giving up
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="concurrent-runs">Allow Concurrent Runs</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow multiple instances of this workflow to run simultaneously
                    </p>
                  </div>
                  <Switch id="concurrent-runs" />
                </div>
              </CardContent>
            </Card>

            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-auth">Require Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require users to authenticate before triggering this workflow
                    </p>
                  </div>
                  <Switch id="require-auth" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rate-limiting">Enable Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Limit how frequently this workflow can be triggered</p>
                  </div>
                  <Switch id="rate-limiting" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      value="••••••••••••••••••••••••••••••"
                      readOnly
                      className="bg-gray-900 border-gray-800 flex-1"
                    />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Use this key to trigger the workflow via API</p>
                </div>
              </CardContent>
            </Card>

            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Advanced configuration options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
                  </div>
                  <Switch id="debug-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="webhook-notifications">Webhook Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to a webhook URL when workflow runs complete
                    </p>
                  </div>
                  <Switch id="webhook-notifications" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://example.com/webhook"
                    className="bg-gray-900 border-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment-variables">Environment Variables</Label>
                  <Textarea
                    id="environment-variables"
                    placeholder="KEY=value"
                    className="bg-gray-900 border-gray-800 min-h-[100px] font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    Define environment variables for this workflow (one per line, KEY=value format)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

