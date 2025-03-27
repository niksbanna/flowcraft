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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Mail, Shield, ShieldAlert, ShieldCheck, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { addTeamMember, removeTeamMember, updateMemberRole, type Team, type TeamMember } from "@/lib/team-workspace"

interface TeamMemberManagementProps {
  team: Team
  onTeamUpdate: (updatedTeam: Team) => void
}

export default function TeamMemberManagement({ team, onTeamUpdate }: TeamMemberManagementProps) {
  const { user } = useAuth()
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("viewer")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [error, setError] = useState("")

  const isOwner = user?.email === team.ownerId
  const isAdmin = isOwner || team.members.some((m) => m.id === user?.email && m.role === "admin")

  const handleInviteMember = () => {
    if (!inviteEmail.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    // Check if already a member
    if (team.members.some((m) => m.email === inviteEmail)) {
      setError("This user is already a member of the team")
      return
    }

    setIsInviting(true)
    setError("")

    try {
      // In a real app, this would send an invitation email
      // For demo purposes, we'll add the member directly
      const updatedTeam = addTeamMember(team.id, inviteEmail, inviteEmail, inviteRole)
      onTeamUpdate(updatedTeam)

      setInviteEmail("")
      setInviteRole("viewer")
      setInviteDialogOpen(false)
    } catch (error: any) {
      setError(error.message || "Failed to invite member")
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = (memberId: string) => {
    if (!isAdmin) return

    if (window.confirm("Are you sure you want to remove this member from the team?")) {
      try {
        const updatedTeam = removeTeamMember(team.id, memberId)
        onTeamUpdate(updatedTeam)
      } catch (error: any) {
        alert(error.message || "Failed to remove member")
      }
    }
  }

  const handleUpdateRole = (memberId: string, newRole: TeamMember["role"]) => {
    if (!isAdmin) return

    try {
      const updatedTeam = updateMemberRole(team.id, memberId, newRole)
      onTeamUpdate(updatedTeam)
    } catch (error: any) {
      alert(error.message || "Failed to update member role")
    }
  }

  const getRoleBadge = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return (
          <Badge className="bg-purple-500">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Owner
          </Badge>
        )
      case "admin":
        return (
          <Badge className="bg-blue-500">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        )
      case "editor":
        return (
          <Badge variant="outline">
            <Shield className="h-3 w-3 mr-1" />
            Editor
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Viewer
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Team Members</h3>

        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!isAdmin}>
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>Invite someone to join the {team.name} team</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as TeamMember["role"])}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {isOwner && <SelectItem value="admin">Admin</SelectItem>}
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {inviteRole === "admin"
                    ? "Admins can manage team members and all workflows"
                    : inviteRole === "editor"
                      ? "Editors can edit workflows but cannot manage the team"
                      : "Viewers can only view workflows"}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember} disabled={!inviteEmail.includes("@") || isInviting}>
                {isInviting ? "Inviting..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted p-3 grid grid-cols-12 gap-4 text-sm font-medium">
          <div className="col-span-5">Member</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3">Joined</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y">
          {team.members.map((member) => (
            <div key={member.id} className="p-3 grid grid-cols-12 gap-4 items-center hover:bg-muted/50">
              <div className="col-span-5 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{member.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.email}</div>
                  {member.id === user?.email && <div className="text-xs text-muted-foreground">You</div>}
                </div>
              </div>

              <div className="col-span-3">{getRoleBadge(member.role)}</div>

              <div className="col-span-3 text-sm text-muted-foreground">
                {new Date(member.joinedAt).toLocaleDateString()}
              </div>

              <div className="col-span-1 flex justify-end">
                {isAdmin && member.id !== team.ownerId && member.id !== user?.email && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {isOwner && member.role !== "admin" && (
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleUpdateRole(member.id, "admin")}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                      )}

                      {member.role !== "editor" && (
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleUpdateRole(member.id, "editor")}
                        >
                          <Shield className="h-4 w-4" />
                          Make Editor
                        </DropdownMenuItem>
                      )}

                      {member.role !== "viewer" && (
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleUpdateRole(member.id, "viewer")}
                        >
                          <Shield className="h-4 w-4" />
                          Make Viewer
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-500"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove from Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isAdmin && (
        <p className="text-sm text-muted-foreground italic">Only team owners and admins can manage team members</p>
      )}
    </div>
  )
}

