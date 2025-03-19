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
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, AlertCircle, Check } from "lucide-react"
import { cloneWorkflow } from "@/lib/workflow-storage"

interface WorkflowCloneDialogProps {
  workflowId: string
  workflowName: string
  onCloneComplete: (workflowId: string) => void
}

export default function WorkflowCloneDialog({ workflowId, workflowName, onCloneComplete }: WorkflowCloneDialogProps) {
  const [newName, setNewName] = useState(`${workflowName} (Copy)`)
  const [newDescription, setNewDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isCloning, setIsCloning] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClone = () => {
    if (!newName.trim()) {
      setError("Workflow name is required")
      return
    }

    setError(null)
    setSuccess(null)
    setIsCloning(true)

    try {
      const clonedWorkflow = cloneWorkflow(workflowId, newName)

      if (!clonedWorkflow) {
        setError("Failed to clone workflow. Please try again.")
        setIsCloning(false)
        return
      }

      setSuccess(`Workflow cloned successfully as "${newName}".`)

      // Notify parent component
      onCloneComplete(clonedWorkflow.id)

      // Close dialog after a delay
      setTimeout(() => {
        setDialogOpen(false)
        setIsCloning(false)
      }, 2000)
    } catch (err) {
      console.error("Error cloning workflow:", err)
      setError("An error occurred while cloning the workflow.")
      setIsCloning(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Copy className="h-4 w-4" />
          Clone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Clone Workflow</DialogTitle>
          <DialogDescription>Create a copy of this workflow with a new name</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-900/30 border-green-800">
            <Check className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">New Workflow Name</Label>
            <Input
              id="workflow-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
              placeholder="Enter workflow name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-description">Description (Optional)</Label>
            <Textarea
              id="workflow-description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="bg-gray-900 border-gray-800 text-white min-h-[80px]"
              placeholder="Enter workflow description"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isCloning}>
            Cancel
          </Button>
          <Button onClick={handleClone} disabled={isCloning}>
            {isCloning ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Cloning...
              </>
            ) : (
              <>Clone Workflow</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

