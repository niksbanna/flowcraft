"use client"

import type React from "react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Upload, AlertCircle, Copy, Check } from "lucide-react"
import { exportWorkflow, importWorkflow } from "@/lib/workflow-storage"

interface WorkflowExportImportProps {
  workflowId: string
  onImportComplete: (workflowId: string) => void
}

export default function WorkflowExportImport({ workflowId, onImportComplete }: WorkflowExportImportProps) {
  const [activeTab, setActiveTab] = useState("export")
  const [includeVersions, setIncludeVersions] = useState(false)
  const [exportData, setExportData] = useState("")
  const [importData, setImportData] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Handle export
  const handleExport = () => {
    setError(null)
    try {
      const data = exportWorkflow(workflowId, includeVersions)
      if (!data) {
        setError("Failed to export workflow. Please try again.")
        return
      }

      setExportData(data)
    } catch (err) {
      console.error("Error exporting workflow:", err)
      setError("An error occurred while exporting the workflow.")
    }
  }

  // Handle download
  const handleDownload = () => {
    if (!exportData) {
      handleExport()
    }

    try {
      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `workflow-${workflowId}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading workflow:", err)
      setError("An error occurred while downloading the workflow.")
    }
  }

  // Handle copy to clipboard
  const handleCopy = () => {
    if (!exportData) {
      handleExport()
    }

    try {
      navigator.clipboard.writeText(exportData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error copying to clipboard:", err)
      setError("An error occurred while copying to clipboard.")
    }
  }

  // Handle import
  const handleImport = () => {
    setError(null)
    setSuccess(null)

    if (!importData.trim()) {
      setError("Please enter workflow data to import.")
      return
    }

    try {
      const importedWorkflow = importWorkflow(importData)
      if (!importedWorkflow) {
        setError("Failed to import workflow. Please check the data format and try again.")
        return
      }

      setSuccess(`Workflow "${importedWorkflow.name}" imported successfully.`)
      setImportData("")

      // Notify parent component
      onImportComplete(importedWorkflow.id)

      // Close dialog after a delay
      setTimeout(() => {
        setDialogOpen(false)
      }, 2000)
    } catch (err) {
      console.error("Error importing workflow:", err)
      setError("An error occurred while importing the workflow. Please check the data format.")
    }
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        setImportData(content)
      } catch (err) {
        console.error("Error reading file:", err)
        setError("An error occurred while reading the file.")
      }
    }
    reader.onerror = () => {
      setError("An error occurred while reading the file.")
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export/Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Export/Import Workflow</DialogTitle>
          <DialogDescription>
            Export your workflow to share or backup, or import a workflow from a file or JSON
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-versions"
                checked={includeVersions}
                onCheckedChange={(checked) => setIncludeVersions(checked as boolean)}
              />
              <Label htmlFor="include-versions">Include version history</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleExport} className="flex-1">
                Generate Export Data
              </Button>
              <Button variant="outline" onClick={handleDownload} disabled={!exportData}>
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>

            {exportData && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="export-data">Export Data (JSON)</Label>
                  <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="export-data"
                  value={exportData}
                  readOnly
                  className="h-[200px] font-mono text-xs bg-gray-900 border-gray-800"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="import-file">Upload Workflow File</Label>
              <div className="flex items-center gap-2">
                <input id="import-file" type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("import-file")?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-data">Or Paste JSON Data</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste workflow JSON data here..."
                className="h-[200px] font-mono text-xs bg-gray-900 border-gray-800"
              />
            </div>

            <Button onClick={handleImport} disabled={!importData.trim()}>
              Import Workflow
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

