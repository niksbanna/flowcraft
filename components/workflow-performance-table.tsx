"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Minus, ExternalLink } from "lucide-react"
import Link from "next/link"

interface WorkflowPerformanceTableProps {
  runData: any[]
}

export default function WorkflowPerformanceTable({ runData }: WorkflowPerformanceTableProps) {
  // Sort workflows by total runs (descending)
  const sortedData = [...runData].sort((a, b) => b.totalRuns - a.totalRuns)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Performance</CardTitle>
        <CardDescription>Detailed performance metrics for all workflows</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Workflow</th>
                <th className="text-center py-3 px-4 font-medium">Total Runs</th>
                <th className="text-center py-3 px-4 font-medium">Success Rate</th>
                <th className="text-center py-3 px-4 font-medium">Avg. Duration</th>
                <th className="text-center py-3 px-4 font-medium">Last Run</th>
                <th className="text-center py-3 px-4 font-medium">Trend</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((workflow) => (
                <tr key={workflow.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{workflow.name}</div>
                  </td>
                  <td className="text-center py-3 px-4">{workflow.totalRuns}</td>
                  <td className="text-center py-3 px-4">
                    <Badge
                      className={
                        workflow.successRate >= 90
                          ? "bg-green-600"
                          : workflow.successRate >= 75
                            ? "bg-amber-600"
                            : "bg-red-600"
                      }
                    >
                      {workflow.successRate.toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="text-center py-3 px-4">{(workflow.avgDuration / 1000).toFixed(2)}s</td>
                  <td className="text-center py-3 px-4 text-sm text-muted-foreground">
                    {workflow.lastRun.toLocaleDateString()}
                  </td>
                  <td className="text-center py-3 px-4">
                    {workflow.trend === "up" ? (
                      <div className="flex items-center justify-center text-green-500">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span>Improving</span>
                      </div>
                    ) : workflow.trend === "down" ? (
                      <div className="flex items-center justify-center text-red-500">
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        <span>Declining</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Minus className="h-4 w-4 mr-1" />
                        <span>Stable</span>
                      </div>
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    <Link href={`/workflow/${workflow.id}/run`}>
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

