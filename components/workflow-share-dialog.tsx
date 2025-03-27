"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, Copy, Link2, Mail, Users, Plus, X, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  getTeamsForUser,
  shareWorkflow,
  getTeamsForWorkflow,
  type Team,
  type SharedWorkflow,
} from "@/lib/team-workspace"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WorkflowShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId: string
  workflowName: string
}

export default function WorkflowShareDialog({
  open,
  onOpenChange,
  workflowId,
  workflowName,
}: WorkflowShareDialogProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("link")
  const [teams, setTeams] = useState<Team[]>([])
  const [sharedTeams, setSharedTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>("")
  const [permission, setPermission] = useState<SharedWorkflow["permissions"]>("view")
  const [email, setEmail] = useState("")
  const [emailPermission, setEmailPermission] = useState<SharedWorkflow["permissions"]>("view")
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [invitedEmails, setInvitedEmails] = useState<{ email: string; permission: string }[]>([])
  const [inviteError, setInviteError] = useState("")

  useEffect(() => {
    if (open && user) {
      // Load user's teams
      const userTeams = getTeamsForUser(user.email)
      setTeams(userTeams)

      // Load teams this workflow is already shared with
      const workflowTeams = getTeamsForWorkflow(workflowId)
      setSharedTeams(workflowTeams)

      // Reset state
      setSelectedTeam(userTeams.length > 0 ? userTeams[0].id : "")
      setPermission("view")
      setEmail("")
      setEmailPermission("view")
      setCopied(false)
      setInvitedEmails([])
      setInviteError("")
    }
  }, [open, user, workflowId])

  const handleShareWithTeam = () => {
    if (!user || !selectedTeam) return

    setIsSharing(true)

    try {
      shareWorkflow(workflowId, selectedTeam, user.email, permission)

      // Update shared teams list
      const workflowTeams = getTeamsForWorkflow(workflowId)
      setSharedTeams(workflowTeams)
    } catch (error) {
      console.error("Error sharing workflow:", error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = () => {
    // In a real app, this would generate a shareable link
    const shareableLink = `${window.location.origin}/workflow/shared/${workflowId}`

    navigator.clipboard.writeText(shareableLink)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleInviteByEmail = () => {
    // Validate email
    if (!email.includes("@")) {
      setInviteError("Please enter a valid email address")
      return
    }

    // Check if already invited
    if (invitedEmails.some((invite) => invite.email === email)) {
      setInviteError("This email has already been invited")
      return
    }

    // Add to invited list
    setInvitedEmails([...invitedEmails, { email, permission: emailPermission }])
    setEmail("")
    setInviteError("")
  }

  const handleRemoveInvite = (emailToRemove: string) => {
    setInvitedEmails(invitedEmails.filter((invite) => invite.email !== emailToRemove))
  }

  const handleSendInvites = () => {
    // In a real app, this would send email invitations
    alert(`Invitations would be sent to ${invitedEmails.length} email(s)`)
    setInvitedEmails([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Share Workflow</DialogTitle>
          <DialogDescription>Share "{workflowName}" with teams or individuals</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span>Link</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Shareable Link</Label>
              <div className="flex gap-2">
                <Input value={`${window.location.origin}/workflow/shared/${workflowId}`} readOnly className="flex-1" />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Anyone with this link can view this workflow</p>
            </div>

            <div className="space-y-2">
              <Label>Link Permissions</Label>
              <RadioGroup defaultValue="view" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="view" id="link-view" />
                  <Label htmlFor="link-view">View only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="edit" id="link-edit" />
                  <Label htmlFor="link-edit">Can edit</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Link Settings</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-login" className="text-sm">
                    Require login
                  </Label>
                  <input type="checkbox" id="require-login" className="accent-primary" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="link-expiry" className="text-sm">
                    Link expires after
                  </Label>
                  <Select defaultValue="never">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1day">1 day</SelectItem>
                      <SelectItem value="7days">7 days</SelectItem>
                      <SelectItem value="30days">30 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4 mt-4">
            {teams.length > 0 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="team-select">Select Team</Label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger id="team-select">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Team Permissions</Label>
                  <RadioGroup
                    value={permission}
                    onValueChange={(value) => setPermission(value as SharedWorkflow["permissions"])}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="view" id="team-view" />
                      <Label htmlFor="team-view">View only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="edit" id="team-edit" />
                      <Label htmlFor="team-edit">Can edit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manage" id="team-manage" />
                      <Label htmlFor="team-manage">Can manage</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={handleShareWithTeam} disabled={!selectedTeam || isSharing} className="w-full">
                  {isSharing ? "Sharing..." : "Share with Team"}
                </Button>

                {/* Already shared teams */}
                {sharedTeams.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label>Already shared with</Label>
                    <div className="space-y-2">
                      {sharedTeams.map((team) => (
                        <div key={team.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div className="font-medium">{team.name}</div>
                          </div>
                          <Badge variant="outline">Shared</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">You don't have any teams yet</p>
                <Link href="/teams">
                  <Button>Create a Team</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email-input">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email-input"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button variant="outline" onClick={handleInviteByEmail}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {inviteError && <p className="text-sm text-red-500">{inviteError}</p>}
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <RadioGroup
                value={emailPermission}
                onValueChange={(value) => setEmailPermission(value as SharedWorkflow["permissions"])}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="view" id="email-view" />
                  <Label htmlFor="email-view">View only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="edit" id="email-edit" />
                  <Label htmlFor="email-edit">Can edit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manage" id="email-manage" />
                  <Label htmlFor="email-manage">Can manage</Label>
                </div>
              </RadioGroup>
            </div>

            {invitedEmails.length > 0 && (
              <div className="border rounded-lg p-3 space-y-2">
                <Label>Invited Users</Label>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {invitedEmails.map((invite) => (
                    <div key={invite.email} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{invite.email.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{invite.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {invite.permission === "view"
                            ? "View only"
                            : invite.permission === "edit"
                              ? "Can edit"
                              : "Manager"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveInvite(invite.email)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className="mt-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Invited users will receive an email with instructions to access this workflow.
                  </AlertDescription>
                </Alert>

                <Button className="w-full mt-2" onClick={handleSendInvites}>
                  Send {invitedEmails.length} Invitation{invitedEmails.length !== 1 ? "s" : ""}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

