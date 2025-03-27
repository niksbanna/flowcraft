"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Settings, Share2, Workflow, Users, FileText } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getTeamById, updateTeam, type Team } from "@/lib/team-workspace"
import { getSharedWorkflowsForTeam } from "@/lib/team-workspace"
import { getWorkflows, type Workflow as WorkflowType } from "@/lib/workflow-storage"
import TeamMemberManagement from "@/components/team-member-management"

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [workflows, setWorkflows] = useState<WorkflowType[]>([])
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Load team
      const loadedTeam = getTeamById(params.id)
      if (loadedTeam) {
        setTeam(loadedTeam)
        setTeamName(loadedTeam.name)
        setTeamDescription(loadedTeam.description || "")

        // Load workflows
        const userWorkflows = getWorkflows()
        setWorkflows(userWorkflows)
      } else {
        router.push("/teams")
      }
    }
  }, [isAuthenticated, user, params.id, router])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated || !team) {
    return null
  }

  // Check if user is a member of this team
  const isMember = team.members.some((member) => member.id === user?.email)
  if (!isMember) {
    router.push("/teams")
    return null
  }

  const isOwner = user?.email === team.ownerId
  const isAdmin = isOwner || team.members.some((m) => m.id === user?.email && m.role === "admin")

  // Get shared workflows for this team
  const getTeamWorkflows = () => {
    const sharedWorkflows = getSharedWorkflowsForTeam(team.id)
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

  const teamWorkflows = getTeamWorkflows()

  const handleSaveTeamSettings = () => {
    if (!teamName.trim()) return

    setIsSaving(true)

    try {
      const updatedTeam = updateTeam({
        ...team,
        name: teamName,
        description: teamDescription,
      })

      setTeam(updatedTeam)
      alert("Team settings saved successfully")
    } catch (error) {
      console.error("Error saving team settings:", error)
      alert("Failed to save team settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleTeamUpdate = (updatedTeam: Team) => {
    setTeam(updatedTeam)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/teams">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{team.name}</h1>
              <p className="text-muted-foreground mt-1">
                {team.members.length} {team.members.length === 1 ? "member" : "members"}
              </p>
            </div>
          </div>

          <Tabs defaultValue="workflows">
            <TabsList>
              <TabsTrigger value="workflows" className="flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                Workflows
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workflows" className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Team Workflows</h2>
                <Button className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Workflow
                </Button>
              </div>

              {teamWorkflows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamWorkflows.map((workflow: any) => (
                    <Card key={workflow.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="truncate">{workflow.name}</CardTitle>
                          <Badge variant="outline">
                            {workflow.permissions === "view"
                              ? "View only"
                              : workflow.permissions === "edit"
                                ? "Can edit"
                                : "Manager"}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {workflow.description || "No description"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="mr-1 h-4 w-4" />
                          <span>Updated: {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end border-t pt-4">
                        <Link href={`/workflow/${workflow.id}/run`}>
                          <Button size="sm">View Workflow</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No shared workflows yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Share workflows with this team to collaborate with team members
                  </p>
                  <Button>Share a Workflow</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <TeamMemberManagement team={team} onTeamUpdate={handleTeamUpdate} />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Settings</CardTitle>
                  <CardDescription>Manage your team's basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="team-name" className="font-medium">
                      Team Name
                    </label>
                    <Input
                      id="team-name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      disabled={!isAdmin}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="team-description" className="font-medium">
                      Description
                    </label>
                    <Textarea
                      id="team-description"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      disabled={!isAdmin}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium">Team ID</label>
                    <div className="flex items-center gap-2">
                      <Input value={team.id} readOnly />
                      <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(team.id)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">This is your unique team identifier</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  {isAdmin ? (
                    <>
                      <Button variant="outline">Delete Team</Button>
                      <Button
                        onClick={handleSaveTeamSettings}
                        disabled={!teamName.trim() || isSaving}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Only team owners and admins can edit team settings
                    </p>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

