"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface DashboardChartsProps {
  runData: any[]
  timeRange: string
}

export default function DashboardCharts({ runData, timeRange }: DashboardChartsProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Generate daily run data for the area chart
  const getDailyRunData = () => {
    const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90

    return Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))

      const successRuns = Math.floor(Math.random() * 20) + 5
      const failedRuns = Math.floor(Math.random() * 5)

      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        successful: successRuns,
        failed: failedRuns,
        total: successRuns + failedRuns,
      }
    })
  }

  // Generate duration data for the bar chart
  const getDurationData = () => {
    return runData.slice(0, 5).map((workflow) => ({
      name: workflow.name.length > 15 ? workflow.name.substring(0, 15) + "..." : workflow.name,
      duration: workflow.avgDuration / 1000, // Convert to seconds
    }))
  }

  // Generate success/failure data for the pie chart
  const getSuccessFailureData = () => {
    const totalSuccess = runData.reduce((sum, item) => sum + item.successRuns, 0)
    const totalFailed = runData.reduce((sum, item) => sum + item.failedRuns, 0)

    return [
      { name: "Successful", value: totalSuccess },
      { name: "Failed", value: totalFailed },
    ]
  }

  const dailyRunData = getDailyRunData()
  const durationData = getDurationData()
  const successFailureData = getSuccessFailureData()

  // Colors for charts
  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
  const successColor = "#22c55e"
  const failedColor = "#ef4444"
  const primaryColor = "#8b5cf6"

  const COLORS = [successColor, failedColor]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Workflow Runs Over Time</CardTitle>
          <CardDescription>Daily successful and failed workflow executions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRunData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                    color: textColor,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="successful"
                  stackId="1"
                  stroke={successColor}
                  fill={successColor}
                  name="Successful"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stackId="1"
                  stroke={failedColor}
                  fill={failedColor}
                  name="Failed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Execution Duration</CardTitle>
          <CardDescription>Top 5 workflows by execution time (seconds)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="name"
                  stroke={textColor}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                  height={60}
                />
                <YAxis stroke={textColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                    color: textColor,
                  }}
                  formatter={(value: any) => [`${value.toFixed(2)}s`, "Duration"]}
                />
                <Bar dataKey="duration" fill={primaryColor} name="Duration (s)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Success vs Failure Rate</CardTitle>
          <CardDescription>Overall success and failure distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successFailureData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {successFailureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                    color: textColor,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

