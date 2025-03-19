"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Clock, Zap, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import EmptyWorkflowState from "@/components/empty-workflow-state"
import { getWorkflows, deleteWorkflow, type Workflow } from "@/lib/workflow-storage"
import { formatDistanceToNow } from "date-fns"

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [view, setView] = useState("grid")
  const [isDeleting, setIsDeleting] = useState(false)

  // Load workflows from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const savedWorkflows = getWorkflows()
      setWorkflows(savedWorkflows)
    }
  }, [isAuthenticated])

  // Filter workflows based on search query
  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workflow.description && workflow.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Handle workflow deletion
  const handleDeleteWorkflow = (id: string) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      setIsDeleting(true)
      deleteWorkflow(id)
      setWorkflows(getWorkflows())
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return null // Or a loading spinner
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">My Workflows</h1>
              <p className="text-muted-foreground mt-1">Create, manage, and monitor your automated workflows</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/workflow/new">
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4" />
                  Create Workflow
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                className="pl-10 bg-gray-900 border-gray-800 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>

              <Tabs defaultValue="grid" value={view} onValueChange={setView} className="w-[180px]">
                <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-800">
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Workflows content */}
          <div>
            <Tabs value={view}>
              <TabsContent value="grid" className="mt-0">
                {filteredWorkflows.length === 0 ? (
                  <EmptyWorkflowState />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkflows.map((workflow) => (
                      <Card key={workflow.id} className="bg-gray-950 border-gray-800 overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="truncate">{workflow.name}</CardTitle>
                            <Badge variant="outline" className="bg-gray-800 text-xs">
                              {workflow.nodes.length} nodes
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {workflow.description || "No description"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>
                              Updated: {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                          <div className="flex gap-2">
                            <Link href={`/workflow/${workflow.id}`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-400"
                              onClick={() => handleDeleteWorkflow(workflow.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Link href={`/workflow/${workflow.id}/run`}>
                            <Button size="sm" className="gap-1">
                              <Zap className="h-4 w-4" />
                              Run
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                {filteredWorkflows.length === 0 ? (
                  <EmptyWorkflowState />
                ) : (
                  <div className="border border-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-gray-900 p-3 border-b border-gray-800 grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                      <div className="col-span-4">Name</div>
                      <div className="col-span-3">Last Updated</div>
                      <div className="col-span-2">Nodes</div>
                      <div className="col-span-3 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-800">
                      {filteredWorkflows.map((workflow) => (
                        <div
                          key={workflow.id}
                          className="p-3 grid grid-cols-12 gap-4 items-center hover:bg-gray-900/50"
                        >
                          <div className="col-span-4 font-medium truncate">{workflow.name}</div>
                          <div className="col-span-3 text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
                          </div>
                          <div className="col-span-2">
                            <Badge variant="outline" className="bg-gray-800">
                              {workflow.nodes.length} nodes
                            </Badge>
                          </div>
                          <div className="col-span-3 flex justify-end space-x-2">
                            <Link href={`/workflow/${workflow.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-400"
                              onClick={() => handleDeleteWorkflow(workflow.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Link href={`/workflow/${workflow.id}/run`}>
                              <Button size="sm" className="gap-1">
                                <Zap className="h-4 w-4" />
                                Run
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}

