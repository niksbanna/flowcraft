"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"

interface ShortcutInfo {
  key: string
  description: string
  action: () => void
}

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false)

  const shortcuts: ShortcutInfo[] = [
    {
      key: "n",
      description: "Create new workflow",
      action: () => (window.location.href = "/workflow/new"),
    },
    {
      key: "d",
      description: "Go to dashboard",
      action: () => (window.location.href = "/dashboard"),
    },
    {
      key: "h",
      description: "Go to home",
      action: () => (window.location.href = "/"),
    },
    {
      key: "?",
      description: "Show keyboard shortcuts",
      action: () => setShowHelp(true),
    },
    {
      key: "t",
      description: "Toggle theme",
      action: () => {
        const html = document.querySelector("html")
        if (html?.classList.contains("dark")) {
          html.classList.remove("dark")
          localStorage.setItem("theme", "light")
        } else {
          html?.classList.add("dark")
          localStorage.setItem("theme", "dark")
        }
      },
    },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Find matching shortcut
      const shortcut = shortcuts.find((s) => s.key === e.key.toLowerCase())
      if (shortcut) {
        e.preventDefault()
        shortcut.action()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setShowHelp(true)} title="Keyboard Shortcuts">
        <Keyboard className="h-5 w-5" />
        <span className="sr-only">Keyboard Shortcuts</span>
      </Button>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>Use these keyboard shortcuts to navigate and control FlowCraft</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between">
                <span>{shortcut.description}</span>
                <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                  {shortcut.key.toUpperCase()}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

