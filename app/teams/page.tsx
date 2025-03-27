"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Users, Settings, Share2, Workflow } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getTeamsForUser, createTeam, type Team } from "@/lib/team-workspace"
import { getWorkflows, type Workflow as WorkflowType } from "@/lib/workflow-storage"
import { getSharedWorkflowsForTeam } from "@/lib/team-workspace"

export default function TeamsPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [workflows, setWorkflows] = useState<WorkflowType[]>([])
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Load teams for the current user
      const userTeams = getTeamsForUser(user.email)
      setTeams(userTeams)

      // Load workflows
      const userWorkflows = getWorkflows()
      setWorkflows(userWorkflows)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  const handleCreateTeam = () => {
    if (!user) return

    setIsCreatingTeam(true)

    try {
      const newTeam = createTeam(newTeamName, newTeamDescription, user.email, user.email)

      setTeams([...teams, newTeam])
      setNewTeamName("")
      setNewTeamDescription("")
      setCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating team:", error)
    } finally {
      setIsCreatingTeam(false)
    }
  }

  // Get shared workflows for a team
  const getTeamWorkflows = (teamId: string) => {
    const sharedWorkflows = getSharedWorkflowsForTeam(teamId)
    return sharedWorkflows
      .map((sw) => {
        const workflow = workflows.find((w) => w.id === sw.workflowId)
        return {
          ...workflow,
          permissions: sw.permissions,
        }
      })
      .filter(Boolean)
  }

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
              <h1 className="text-2xl font-bold">Team Workspaces</h1>
              <p className="text-muted-foreground mt-1">Collaborate with your team on workflows</p>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>Create a team to collaborate on workflows with others</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="team-name">Team Name</Label>
                      <Input
                        id="team-name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Enter team name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team-description">Description (Optional)</Label>
                      <Textarea
                        id="team-description"
                        value={newTeamDescription}
                        onChange={(e) => setNewTeamDescription(e.target.value)}
                        placeholder="Describe the purpose of this team"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTeam} disabled={!newTeamName.trim() || isCreatingTeam}>
                      {isCreatingTeam ? "Creating..." : "Create Team"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Teams list */}
          {teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Users className="h-12 w-12 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-3">No teams yet</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Create your first team to collaborate on workflows with others
              </p>

              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{team.name}</CardTitle>
                      <Badge>
                        {team.members.length} {team.members.length === 1 ? "member" : "members"}
                      </Badge>
                    </div>
                    <CardDescription>{team.description || "No description"}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Tabs defaultValue="workflows">
                      <TabsList className="w-full">
                        <TabsTrigger value="workflows" className="flex-1">
                          Workflows
                        </TabsTrigger>
                        <TabsTrigger value="members" className="flex-1">
                          Members
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="workflows" className="mt-4 space-y-4">
                        {getTeamWorkflows(team.id).length > 0 ? (
                          <div className="space-y-2">
                            {getTeamWorkflows(team.id).map((workflow: any) => (
                              <div
                                key={workflow.id}
                                className="flex items-center justify-between p-3 border border-border rounded-lg"
                              >
                                <div className="flex items-center">
                                  <Workflow className="h-4 w-4 mr-2 text-primary" />
                                  <span className="font-medium">{workflow.name}</span>
                                </div>
                                <Badge variant="outline">
                                  {workflow.permissions === "view"
                                    ? "View only"
                                    : workflow.permissions === "edit"
                                      ? "Can edit"
                                      : "Manager"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">No shared workflows</div>
                        )}
                      </TabsContent>

                      <TabsContent value="members" className="mt-4 space-y-4">
                        <div className="space-y-2">
                          {team.members.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 border border-border rounded-lg"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                                  {member.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">{member.email}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <Badge>{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>

                  <CardFooter className="flex justify-between border-t border-border pt-4">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Share Workflow
                    </Button>
                    <Link href={`/teams/${team.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Settings className="h-4 w-4" />
                        Manage
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

