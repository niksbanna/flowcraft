// Workflow storage service to handle saving and loading workflows from localStorage

export interface Workflow {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  nodes: any[]
  edges: any[]
  triggers?: any[]
  version?: number
  parentId?: string
}

export interface WorkflowVersion {
  id: string
  workflowId: string
  version: number
  data: Workflow
  createdAt: string
  createdBy?: string
  comment?: string
}

// Generate a unique ID for new workflows
export const generateWorkflowId = (): string => {
  return `wf-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Get all workflows from localStorage
export const getWorkflows = (): Workflow[] => {
  try {
    const workflowsJson = localStorage.getItem("workflows")
    if (!workflowsJson) return []
    return JSON.parse(workflowsJson)
  } catch (error) {
    console.error("Error loading workflows:", error)
    return []
  }
}

// Get a specific workflow by ID
export const getWorkflowById = (id: string): Workflow | undefined => {
  const workflows = getWorkflows()
  return workflows.find((workflow) => workflow.id === id)
}

// Save a workflow to localStorage with versioning
export const saveWorkflow = (workflow: Workflow, comment?: string): Workflow => {
  try {
    const workflows = getWorkflows()
    const existingIndex = workflows.findIndex((w) => w.id === workflow.id)
    const now = new Date().toISOString()

    // Set or increment version
    const currentVersion = workflow.version || 0
    const newVersion = currentVersion + 1

    // Create updated workflow with new version
    const updatedWorkflow = {
      ...workflow,
      version: newVersion,
      updatedAt: now,
    }

    if (existingIndex >= 0) {
      // Update existing workflow
      workflows[existingIndex] = updatedWorkflow
    } else {
      // Add new workflow
      updatedWorkflow.createdAt = workflow.createdAt || now
      workflows.push(updatedWorkflow)
    }

    localStorage.setItem("workflows", JSON.stringify(workflows))

    // Save version history
    saveWorkflowVersion(updatedWorkflow, comment)

    return updatedWorkflow
  } catch (error) {
    console.error("Error saving workflow:", error)
    return workflow
  }
}

// Save a version of a workflow to history
export const saveWorkflowVersion = (workflow: Workflow, comment?: string): void => {
  try {
    const versions = getWorkflowVersions(workflow.id)
    const versionId = `ver-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`

    const newVersion: WorkflowVersion = {
      id: versionId,
      workflowId: workflow.id,
      version: workflow.version || 1,
      data: { ...workflow },
      createdAt: new Date().toISOString(),
      comment: comment || `Version ${workflow.version || 1}`,
    }

    versions.push(newVersion)
    localStorage.setItem(`workflow_versions_${workflow.id}`, JSON.stringify(versions))
  } catch (error) {
    console.error("Error saving workflow version:", error)
  }
}

// Get all versions of a workflow
export const getWorkflowVersions = (workflowId: string): WorkflowVersion[] => {
  try {
    const versionsJson = localStorage.getItem(`workflow_versions_${workflowId}`)
    if (!versionsJson) return []
    return JSON.parse(versionsJson)
  } catch (error) {
    console.error("Error loading workflow versions:", error)
    return []
  }
}

// Get a specific version of a workflow
export const getWorkflowVersion = (workflowId: string, version: number): WorkflowVersion | undefined => {
  const versions = getWorkflowVersions(workflowId)
  return versions.find((v) => v.version === version)
}

// Restore a workflow to a specific version
export const restoreWorkflowVersion = (workflowId: string, version: number): Workflow | undefined => {
  try {
    const versionData = getWorkflowVersion(workflowId, version)
    if (!versionData) return undefined

    const restoredWorkflow = {
      ...versionData.data,
      version: versionData.data.version,
      updatedAt: new Date().toISOString(),
    }

    // Save the restored workflow
    const workflows = getWorkflows()
    const existingIndex = workflows.findIndex((w) => w.id === workflowId)

    if (existingIndex >= 0) {
      workflows[existingIndex] = restoredWorkflow
      localStorage.setItem("workflows", JSON.stringify(workflows))

      // Add a version entry for the restoration
      saveWorkflowVersion(restoredWorkflow, `Restored to version ${version}`)

      return restoredWorkflow
    }

    return undefined
  } catch (error) {
    console.error("Error restoring workflow version:", error)
    return undefined
  }
}

// Clone a workflow
export const cloneWorkflow = (workflowId: string, newName?: string): Workflow | undefined => {
  try {
    const sourceWorkflow = getWorkflowById(workflowId)
    if (!sourceWorkflow) return undefined

    const newId = generateWorkflowId()
    const now = new Date().toISOString()

    // Create a deep copy of nodes and edges with new IDs
    const nodeIdMap = new Map<string, string>()

    // Create new nodes with new IDs
    const newNodes = sourceWorkflow.nodes.map((node) => {
      const newNodeId = `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      nodeIdMap.set(node.id, newNodeId)

      return {
        ...node,
        id: newNodeId,
      }
    })

    // Create new edges with updated source/target IDs
    const newEdges = sourceWorkflow.edges.map((edge) => {
      const newSourceId = nodeIdMap.get(edge.source) || edge.source
      const newTargetId = nodeIdMap.get(edge.target) || edge.target

      return {
        ...edge,
        id: `edge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        source: newSourceId,
        target: newTargetId,
      }
    })

    // Create the cloned workflow
    const clonedWorkflow: Workflow = {
      id: newId,
      name: newName || `${sourceWorkflow.name} (Copy)`,
      description: sourceWorkflow.description,
      nodes: newNodes,
      edges: newEdges,
      triggers: sourceWorkflow.triggers ? [...sourceWorkflow.triggers] : [],
      createdAt: now,
      updatedAt: now,
      version: 1,
      parentId: workflowId, // Reference to the original workflow
    }

    // Save the cloned workflow
    const workflows = getWorkflows()
    workflows.push(clonedWorkflow)
    localStorage.setItem("workflows", JSON.stringify(workflows))

    // Create initial version history
    saveWorkflowVersion(clonedWorkflow, `Cloned from workflow ${sourceWorkflow.name}`)

    return clonedWorkflow
  } catch (error) {
    console.error("Error cloning workflow:", error)
    return undefined
  }
}

// Export workflow to JSON string
export const exportWorkflow = (workflowId: string, includeVersions = false): string => {
  try {
    const workflow = getWorkflowById(workflowId)
    if (!workflow) return ""

    const exportData: any = { workflow }

    if (includeVersions) {
      const versions = getWorkflowVersions(workflowId)
      exportData.versions = versions
    }

    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error("Error exporting workflow:", error)
    return ""
  }
}

// Import workflow from JSON string
export const importWorkflow = (jsonData: string): Workflow | undefined => {
  try {
    const importData = JSON.parse(jsonData)

    if (!importData.workflow) {
      throw new Error("Invalid workflow data")
    }

    const workflow = importData.workflow

    // Generate new IDs to avoid conflicts
    const newId = generateWorkflowId()
    const now = new Date().toISOString()

    // Create a deep copy of nodes and edges with new IDs
    const nodeIdMap = new Map<string, string>()

    // Create new nodes with new IDs
    const newNodes = workflow.nodes.map((node: any) => {
      const newNodeId = `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      nodeIdMap.set(node.id, newNodeId)

      return {
        ...node,
        id: newNodeId,
      }
    })

    // Create new edges with updated source/target IDs
    const newEdges = workflow.edges.map((edge: any) => {
      const newSourceId = nodeIdMap.get(edge.source) || edge.source
      const newTargetId = nodeIdMap.get(edge.target) || edge.target

      return {
        ...edge,
        id: `edge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        source: newSourceId,
        target: newTargetId,
      }
    })

    // Create the imported workflow
    const importedWorkflow: Workflow = {
      id: newId,
      name: `${workflow.name} (Imported)`,
      description: workflow.description,
      nodes: newNodes,
      edges: newEdges,
      triggers: workflow.triggers ? [...workflow.triggers] : [],
      createdAt: now,
      updatedAt: now,
      version: 1,
    }

    // Save the imported workflow
    const workflows = getWorkflows()
    workflows.push(importedWorkflow)
    localStorage.setItem("workflows", JSON.stringify(workflows))

    // Create initial version history
    saveWorkflowVersion(importedWorkflow, "Imported workflow")

    // Import versions if included
    if (importData.versions && Array.isArray(importData.versions)) {
      const versions = importData.versions.map((version: WorkflowVersion) => {
        return {
          ...version,
          id: `ver-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          workflowId: newId,
          data: {
            ...version.data,
            id: newId,
          },
        }
      })

      localStorage.setItem(`workflow_versions_${newId}`, JSON.stringify(versions))
    }

    return importedWorkflow
  } catch (error) {
    console.error("Error importing workflow:", error)
    return undefined
  }
}

// Delete a workflow from localStorage
export const deleteWorkflow = (id: string): void => {
  try {
    const workflows = getWorkflows()
    const updatedWorkflows = workflows.filter((workflow) => workflow.id !== id)
    localStorage.setItem("workflows", JSON.stringify(updatedWorkflows))

    // Also delete version history
    localStorage.removeItem(`workflow_versions_${id}`)
  } catch (error) {
    console.error("Error deleting workflow:", error)
  }
}

// Clear all workflows from localStorage
export const clearWorkflows = (): void => {
  try {
    localStorage.removeItem("workflows")

    // Clear all version histories
    const allKeys = Object.keys(localStorage)
    const versionKeys = allKeys.filter((key) => key.startsWith("workflow_versions_"))
    versionKeys.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error("Error clearing workflows:", error)
  }
}

