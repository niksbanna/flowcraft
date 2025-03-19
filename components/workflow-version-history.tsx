"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, AlertCircle, Clock, RotateCcw, Eye } from "lucide-react"
import { getWorkflowVersions, restoreWorkflowVersion, type WorkflowVersion } from "@/lib/workflow-storage"
import { formatDistanceToNow, format } from "date-fns"

interface WorkflowVersionHistoryProps {
  workflowId: string
  onVersionRestore: (version: number) => void
  currentVersion: number
}

export default function WorkflowVersionHistory({
  workflowId,
  onVersionRestore,
  currentVersion,
}: WorkflowVersionHistoryProps) {
  const [versions, setVersions] = useState<WorkflowVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<WorkflowVersion | null>(null)
  const [compareVersion, setCompareVersion] = useState<WorkflowVersion | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [compareMode, setCompareMode] = useState(false)

  // Load versions
  useEffect(() => {
    if (workflowId) {
      const workflowVersions = getWorkflowVersions(workflowId)
      setVersions(workflowVersions.sort((a, b) => b.version - a.version))
    }
  }, [workflowId, currentVersion])

  const handleRestore = async (version: number) => {
    setError(null)
    setRestoring(true)

    try {
      const restored = restoreWorkflowVersion(workflowId, version)
      if (restored) {
        onVersionRestore(version)
        setDialogOpen(false)
      } else {
        setError("Failed to restore version. Please try again.")
      }
    } catch (err) {
      console.error("Error restoring version:", err)
      setError("An error occurred while restoring the version.")
    } finally {
      setRestoring(false)
    }
  }

  const handleSelectVersion = (version: WorkflowVersion) => {
    if (compareMode && selectedVersion) {
      if (version.id === selectedVersion.id) {
        // Deselect if clicking the same version
        setSelectedVersion(null)
      } else {
        // Set as compare version
        setCompareVersion(version)
      }
    } else {
      setSelectedVersion(version)
      setCompareVersion(null)
    }
  }

  const toggleCompareMode = () => {
    setCompareMode(!compareMode)
    if (!compareMode) {
      setCompareVersion(null)
    } else {
      setCompareVersion(null)
    }
  }

  // Calculate differences between versions
  const getDifferences = () => {
    if (!selectedVersion || !compareVersion) return null

    const v1 = selectedVersion.data
    const v2 = compareVersion.data

    const differences = {
      nodeCount: {
        v1: v1.nodes.length,
        v2: v2.nodes.length,
        diff: v1.nodes.length - v2.nodes.length,
      },
      edgeCount: {
        v1: v1.edges.length,
        v2: v2.edges.length,
        diff: v1.edges.length - v2.edges.length,
      },
      nodesAdded: 0,
      nodesRemoved: 0,
      edgesAdded: 0,
      edgesRemoved: 0,
    }

    // Find added/removed nodes
    const v1NodeIds = new Set(v1.nodes.map((n: any) => n.id))
    const v2NodeIds = new Set(v2.nodes.map((n: any) => n.id))

    v1.nodes.forEach((node: any) => {
      if (!v2NodeIds.has(node.id)) {
        differences.nodesRemoved++
      }
    })

    v2.nodes.forEach((node: any) => {
      if (!v1NodeIds.has(node.id)) {
        differences.nodesAdded++
      }
    })

    // Find added/removed edges
    const v1EdgeIds = new Set(v1.edges.map((e: any) => e.id))
    const v2EdgeIds = new Set(v2.edges.map((e: any) => e.id))

    v1.edges.forEach((edge: any) => {
      if (!v2EdgeIds.has(edge.id)) {
        differences.edgesRemoved++
      }
    })

    v2.edges.forEach((edge: any) => {
      if (!v1EdgeIds.has(edge.id)) {
        differences.edgesAdded++
      }
    })

    return differences
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          Version History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Workflow Version History</DialogTitle>
          <DialogDescription>View and restore previous versions of this workflow</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Current version:{" "}
            <Badge variant="outline" className="ml-1 bg-purple-900/50 text-purple-300 border-purple-800">
              v{currentVersion}
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={toggleCompareMode}>
            {compareMode ? "Exit Compare Mode" : "Compare Versions"}
          </Button>
        </div>

        <Tabs defaultValue="list">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="list">Version List</TabsTrigger>
            {compareMode && selectedVersion && compareVersion && <TabsTrigger value="compare">Compare</TabsTrigger>}
          </TabsList>

          <TabsContent value="list">
            <ScrollArea className="h-[400px] rounded-md border border-gray-800 p-4">
              <div className="space-y-4">
                {versions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No version history available</div>
                ) : (
                  versions.map((version) => (
                    <Card
                      key={version.id}
                      className={`bg-gray-900 border-gray-800 ${selectedVersion?.id === version.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => handleSelectVersion(version)}
                    >
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-gray-800">
                              v{version.version}
                            </Badge>
                            <CardTitle className="text-base">
                              {version.comment || `Version ${version.version}`}
                            </CardTitle>
                          </div>
                          {version.version === currentVersion && <Badge className="bg-green-600">Current</Badge>}
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({format(new Date(version.createdAt), "MMM d, yyyy h:mm a")})
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="py-3 flex justify-between border-t border-gray-800">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-gray-800">
                            {version.data.nodes.length} nodes
                          </Badge>
                          <Badge variant="outline" className="bg-gray-800">
                            {version.data.edges.length} edges
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {compareMode ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectVersion(version)
                              }}
                            >
                              {selectedVersion?.id === version.id ? "Selected" : "Select"}
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedVersion(version)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                              {version.version !== currentVersion && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRestore(version.version)
                                  }}
                                  disabled={restoring}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  Restore
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {compareMode && selectedVersion && compareVersion && (
            <TabsContent value="compare">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-gray-800">
                          v{selectedVersion.version}
                        </Badge>
                        <CardTitle className="text-base">
                          {selectedVersion.comment || `Version ${selectedVersion.version}`}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        {format(new Date(selectedVersion.createdAt), "MMM d, yyyy h:mm a")}
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-gray-800">
                          v{compareVersion.version}
                        </Badge>
                        <CardTitle className="text-base">
                          {compareVersion.comment || `Version ${compareVersion.version}`}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        {format(new Date(compareVersion.createdAt), "MMM d, yyyy h:mm a")}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {/* Differences */}
                {getDifferences() && (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-base">Changes</CardTitle>
                      <CardDescription>
                        Differences between version {selectedVersion.version} and {compareVersion.version}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <div className="text-sm font-medium mb-1">Nodes</div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">v{selectedVersion.version}:</span>
                              <span>{getDifferences()?.nodeCount.v1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">v{compareVersion.version}:</span>
                              <span>{getDifferences()?.nodeCount.v2}</span>
                            </div>
                            <div className="flex justify-between mt-2 pt-2 border-t border-gray-700">
                              <span className="text-sm font-medium">Difference:</span>
                              <span
                                className={
                                  getDifferences()?.nodeCount.diff > 0
                                    ? "text-green-400"
                                    : getDifferences()?.nodeCount.diff < 0
                                      ? "text-red-400"
                                      : "text-gray-400"
                                }
                              >
                                {getDifferences()?.nodeCount.diff > 0 ? "+" : ""}
                                {getDifferences()?.nodeCount.diff}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <div className="text-sm font-medium mb-1">Connections</div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">v{selectedVersion.version}:</span>
                              <span>{getDifferences()?.edgeCount.v1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">v{compareVersion.version}:</span>
                              <span>{getDifferences()?.edgeCount.v2}</span>
                            </div>
                            <div className="flex justify-between mt-2 pt-2 border-t border-gray-700">
                              <span className="text-sm font-medium">Difference:</span>
                              <span
                                className={
                                  getDifferences()?.edgeCount.diff > 0
                                    ? "text-green-400"
                                    : getDifferences()?.edgeCount.diff < 0
                                      ? "text-red-400"
                                      : "text-gray-400"
                                }
                              >
                                {getDifferences()?.edgeCount.diff > 0 ? "+" : ""}
                                {getDifferences()?.edgeCount.diff}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <div className="text-sm font-medium mb-1">Changes</div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Nodes Added:</span>
                              <span className="text-green-400">{getDifferences()?.nodesAdded}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Nodes Removed:</span>
                              <span className="text-red-400">{getDifferences()?.nodesRemoved}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Edges Added:</span>
                              <span className="text-green-400">{getDifferences()?.edgesAdded}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Edges Removed:</span>
                              <span className="text-red-400">{getDifferences()?.edgesRemoved}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleRestore(selectedVersion.version)}
                            disabled={restoring || selectedVersion.version === currentVersion}
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restore v{selectedVersion.version}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleRestore(compareVersion.version)}
                            disabled={restoring || compareVersion.version === currentVersion}
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restore v{compareVersion.version}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>

        <DialogFooter className="flex justify-between items-center">
          <div>
            {selectedVersion && !compareMode && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleRestore(selectedVersion.version)}
                disabled={restoring || selectedVersion.version === currentVersion}
              >
                <RotateCcw className="h-4 w-4" />
                Restore to Version {selectedVersion.version}
              </Button>
            )}
          </div>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

