// Team workspace service to handle teams and shared workflows

export interface TeamMember {
  id: string
  email: string
  role: "owner" | "admin" | "editor" | "viewer"
  joinedAt: string
}

export interface Team {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  ownerId: string
  members: TeamMember[]
}

export interface SharedWorkflow {
  id: string
  workflowId: string
  teamId: string
  sharedAt: string
  sharedBy: string
  permissions: "view" | "edit" | "manage"
}

export interface WorkflowComment {
  id: string
  workflowId: string
  userId: string
  userEmail: string
  content: string
  createdAt: string
  updatedAt?: string
  parentId?: string
  resolved?: boolean
}

// Generate a unique ID for new teams
export const generateTeamId = (): string => {
  return `team-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Generate a unique ID for new comments
export const generateCommentId = (): string => {
  return `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Get all teams from localStorage
export const getTeams = (): Team[] => {
  try {
    const teamsJson = localStorage.getItem("teams")
    if (!teamsJson) return []
    return JSON.parse(teamsJson)
  } catch (error) {
    console.error("Error loading teams:", error)
    return []
  }
}

// Get a specific team by ID
export const getTeamById = (id: string): Team | undefined => {
  const teams = getTeams()
  return teams.find((team) => team.id === id)
}

// Get teams for a specific user
export const getTeamsForUser = (userId: string): Team[] => {
  const teams = getTeams()
  return teams.filter((team) => team.ownerId === userId || team.members.some((member) => member.id === userId))
}

// Create a new team
export const createTeam = (name: string, description: string, ownerId: string, ownerEmail: string): Team => {
  const teams = getTeams()
  const now = new Date().toISOString()

  const newTeam: Team = {
    id: generateTeamId(),
    name,
    description,
    createdAt: now,
    updatedAt: now,
    ownerId,
    members: [
      {
        id: ownerId,
        email: ownerEmail,
        role: "owner",
        joinedAt: now,
      },
    ],
  }

  teams.push(newTeam)
  localStorage.setItem("teams", JSON.stringify(teams))

  return newTeam
}

// Update a team
export const updateTeam = (team: Team): Team => {
  const teams = getTeams()
  const index = teams.findIndex((t) => t.id === team.id)

  if (index >= 0) {
    teams[index] = {
      ...team,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem("teams", JSON.stringify(teams))
    return teams[index]
  }

  throw new Error("Team not found")
}

// Delete a team
export const deleteTeam = (teamId: string): void => {
  const teams = getTeams()
  const updatedTeams = teams.filter((team) => team.id !== teamId)
  localStorage.setItem("teams", JSON.stringify(updatedTeams))

  // Also delete shared workflows for this team
  const sharedWorkflows = getSharedWorkflows()
  const updatedSharedWorkflows = sharedWorkflows.filter((sw) => sw.teamId !== teamId)
  localStorage.setItem("shared_workflows", JSON.stringify(updatedSharedWorkflows))
}

// Add a member to a team
export const addTeamMember = (
  teamId: string,
  memberId: string,
  email: string,
  role: TeamMember["role"] = "viewer",
): Team => {
  const team = getTeamById(teamId)

  if (!team) {
    throw new Error("Team not found")
  }

  // Check if member already exists
  if (team.members.some((m) => m.id === memberId)) {
    throw new Error("Member already exists in team")
  }

  const updatedTeam: Team = {
    ...team,
    members: [
      ...team.members,
      {
        id: memberId,
        email,
        role,
        joinedAt: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  }

  return updateTeam(updatedTeam)
}

// Remove a member from a team
export const removeTeamMember = (teamId: string, memberId: string): Team => {
  const team = getTeamById(teamId)

  if (!team) {
    throw new Error("Team not found")
  }

  // Cannot remove the owner
  if (team.ownerId === memberId) {
    throw new Error("Cannot remove the team owner")
  }

  const updatedTeam: Team = {
    ...team,
    members: team.members.filter((m) => m.id !== memberId),
    updatedAt: new Date().toISOString(),
  }

  return updateTeam(updatedTeam)
}

// Update a member's role
export const updateMemberRole = (teamId: string, memberId: string, role: TeamMember["role"]): Team => {
  const team = getTeamById(teamId)

  if (!team) {
    throw new Error("Team not found")
  }

  // Cannot change the owner's role
  if (team.ownerId === memberId && role !== "owner") {
    throw new Error("Cannot change the team owner's role")
  }

  const updatedTeam: Team = {
    ...team,
    members: team.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
    updatedAt: new Date().toISOString(),
  }

  return updateTeam(updatedTeam)
}

// Get all shared workflows
export const getSharedWorkflows = (): SharedWorkflow[] => {
  try {
    const sharedWorkflowsJson = localStorage.getItem("shared_workflows")
    if (!sharedWorkflowsJson) return []
    return JSON.parse(sharedWorkflowsJson)
  } catch (error) {
    console.error("Error loading shared workflows:", error)
    return []
  }
}

// Get shared workflows for a team
export const getSharedWorkflowsForTeam = (teamId: string): SharedWorkflow[] => {
  const sharedWorkflows = getSharedWorkflows()
  return sharedWorkflows.filter((sw) => sw.teamId === teamId)
}

// Get teams that a workflow is shared with
export const getTeamsForWorkflow = (workflowId: string): Team[] => {
  const sharedWorkflows = getSharedWorkflows()
  const teamIds = sharedWorkflows.filter((sw) => sw.workflowId === workflowId).map((sw) => sw.teamId)

  const teams = getTeams()
  return teams.filter((team) => teamIds.includes(team.id))
}

// Share a workflow with a team
export const shareWorkflow = (
  workflowId: string,
  teamId: string,
  userId: string,
  permissions: SharedWorkflow["permissions"] = "view",
): SharedWorkflow => {
  const sharedWorkflows = getSharedWorkflows()

  // Check if already shared
  const existingShare = sharedWorkflows.find((sw) => sw.workflowId === workflowId && sw.teamId === teamId)

  if (existingShare) {
    // Update permissions if already shared
    const updatedSharedWorkflows = sharedWorkflows.map((sw) =>
      sw.id === existingShare.id ? { ...sw, permissions } : sw,
    )

    localStorage.setItem("shared_workflows", JSON.stringify(updatedSharedWorkflows))
    return { ...existingShare, permissions }
  }

  // Create new share
  const newShare: SharedWorkflow = {
    id: `share-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    workflowId,
    teamId,
    sharedAt: new Date().toISOString(),
    sharedBy: userId,
    permissions,
  }

  sharedWorkflows.push(newShare)
  localStorage.setItem("shared_workflows", JSON.stringify(sharedWorkflows))

  return newShare
}

// Unshare a workflow from a team
export const unshareWorkflow = (workflowId: string, teamId: string): void => {
  const sharedWorkflows = getSharedWorkflows()
  const updatedSharedWorkflows = sharedWorkflows.filter((sw) => !(sw.workflowId === workflowId && sw.teamId === teamId))

  localStorage.setItem("shared_workflows", JSON.stringify(updatedSharedWorkflows))
}

// Get all comments for a workflow
export const getWorkflowComments = (workflowId: string): WorkflowComment[] => {
  try {
    const commentsJson = localStorage.getItem(`workflow_comments_${workflowId}`)
    if (!commentsJson) return []
    return JSON.parse(commentsJson)
  } catch (error) {
    console.error("Error loading workflow comments:", error)
    return []
  }
}

// Add a comment to a workflow
export const addWorkflowComment = (
  workflowId: string,
  userId: string,
  userEmail: string,
  content: string,
  parentId?: string,
): WorkflowComment => {
  const comments = getWorkflowComments(workflowId)

  const newComment: WorkflowComment = {
    id: generateCommentId(),
    workflowId,
    userId,
    userEmail,
    content,
    createdAt: new Date().toISOString(),
    parentId,
  }

  comments.push(newComment)
  localStorage.setItem(`workflow_comments_${workflowId}`, JSON.stringify(comments))

  return newComment
}

// Update a comment
export const updateWorkflowComment = (
  workflowId: string,
  commentId: string,
  content: string,
): WorkflowComment | undefined => {
  const comments = getWorkflowComments(workflowId)
  const commentIndex = comments.findIndex((c) => c.id === commentId)

  if (commentIndex >= 0) {
    comments[commentIndex] = {
      ...comments[commentIndex],
      content,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(`workflow_comments_${workflowId}`, JSON.stringify(comments))
    return comments[commentIndex]
  }

  return undefined
}

// Delete a comment
export const deleteWorkflowComment = (workflowId: string, commentId: string): void => {
  const comments = getWorkflowComments(workflowId)
  const updatedComments = comments.filter((c) => c.id !== commentId)
  localStorage.setItem(`workflow_comments_${workflowId}`, JSON.stringify(updatedComments))
}

// Resolve/unresolve a comment
export const toggleCommentResolved = (workflowId: string, commentId: string): WorkflowComment | undefined => {
  const comments = getWorkflowComments(workflowId)
  const commentIndex = comments.findIndex((c) => c.id === commentId)

  if (commentIndex >= 0) {
    comments[commentIndex] = {
      ...comments[commentIndex],
      resolved: !comments[commentIndex].resolved,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(`workflow_comments_${workflowId}`, JSON.stringify(comments))
    return comments[commentIndex]
  }

  return undefined
}

