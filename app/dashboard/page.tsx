"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getWorkflows, type Workflow } from "@/lib/workflow-storage"
import { BarChart3, Clock, Activity, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import DashboardCharts from "@/components/dashboard-charts"
import WorkflowPerformanceTable from "@/components/workflow-performance-table"
import Link from "next/link"

// Sample run data for demonstration
const generateSampleRunData = (workflows: Workflow[]) => {
  const runData = workflows.map((workflow) => {
    const totalRuns = Math.floor(Math.random() * 100) + 5
    const successRate = Math.random() * 0.3 + 0.7 // 70-100% success rate
    const successRuns = Math.floor(totalRuns * successRate)
    const failedRuns = totalRuns - successRuns

    const avgDuration = Math.floor(Math.random() * 5000) + 500 // 500-5500ms

    return {
      id: workflow.id,
      name: workflow.name,
      totalRuns,
      successRuns,
      failedRuns,
      successRate: successRate * 100,
      avgDuration,
      lastRun: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Last 7 days
      trend: Math.random() > 0.7 ? "up" : Math.random() > 0.4 ? "stable" : "down",
    }
  })

  return runData
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [timeRange, setTimeRange] = useState("7d")
  const [runData, setRunData] = useState<any[]>([])

  // Total metrics
  const totalRuns = runData.reduce((sum, item) => sum + item.totalRuns, 0)
  const totalSuccessRuns = runData.reduce((sum, item) => sum + item.successRuns, 0)
  const totalFailedRuns = runData.reduce((sum, item) => sum + item.failedRuns, 0)
  const overallSuccessRate = totalRuns > 0 ? (totalSuccessRuns / totalRuns) * 100 : 0
  const avgDuration = runData.length > 0 ? runData.reduce((sum, item) => sum + item.avgDuration, 0) / runData.length : 0

  useEffect(() => {
    if (isAuthenticated) {
      const savedWorkflows = getWorkflows()
      setWorkflows(savedWorkflows)
      setRunData(generateSampleRunData(savedWorkflows))
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Dashboard & Analytics</h1>
              <p className="text-muted-foreground mt-1">Monitor your workflow performance and metrics</p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Link href="/workflow">
                <Button>View Workflows</Button>
              </Link>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRuns}</div>
                <p className="text-xs text-muted-foreground">
                  {timeRange === "24h"
                    ? "Last 24 hours"
                    : timeRange === "7d"
                      ? "Last 7 days"
                      : timeRange === "30d"
                        ? "Last 30 days"
                        : "Last 90 days"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallSuccessRate.toFixed(1)}%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{totalSuccessRuns} successful</span>
                  <span className="mx-1">•</span>
                  <span>{totalFailedRuns} failed</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(avgDuration / 1000).toFixed(2)}s</div>
                <p className="text-xs text-muted-foreground">Per workflow execution</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workflows.length}</div>
                <p className="text-xs text-muted-foreground">Total workflows</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and tables */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <DashboardCharts runData={runData} timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="performance">
              <WorkflowPerformanceTable runData={runData} />
            </TabsContent>

            <TabsContent value="errors">
              <Card>
                <CardHeader>
                  <CardTitle>Error Analysis</CardTitle>
                  <CardDescription>Common errors and their frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {totalFailedRuns > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
                              <XCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">API Connection Timeout</div>
                              <div className="text-sm text-muted-foreground">External API not responding</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">{Math.floor(totalFailedRuns * 0.4)} occurrences</div>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-full">
                              <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">Data Validation Error</div>
                              <div className="text-sm text-muted-foreground">Invalid input format</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">{Math.floor(totalFailedRuns * 0.3)} occurrences</div>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
                              <XCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">Node Execution Failure</div>
                              <div className="text-sm text-muted-foreground">
                                Processing error in transformation node
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">{Math.floor(totalFailedRuns * 0.2)} occurrences</div>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-full">
                              <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">Other Errors</div>
                              <div className="text-sm text-muted-foreground">Miscellaneous errors</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">{Math.floor(totalFailedRuns * 0.1)} occurrences</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No errors to display</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

