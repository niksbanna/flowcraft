"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { LayoutDashboard, Play, FileText, Users, Package, Store, User } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  if (!user) return null

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13h2" />
            <path d="M8 17h2" />
            <path d="M14 13h2" />
            <path d="M14 17h2" />
          </svg>
          <span>Workflow Platform</span>
        </Link>
        <div className="flex-1"></div>
        <div className="flex items-center gap-1 md:gap-2">
          <Link href="/dashboard">
            <Button variant={isActive("/dashboard") ? "default" : "ghost"} size="sm" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant={isActive("/") && !isActive("/dashboard") ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              <span className="hidden md:inline">Workflows</span>
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant={isActive("/templates") ? "default" : "ghost"} size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Templates</span>
            </Button>
          </Link>
          <Link href="/teams">
            <Button variant={isActive("/teams") ? "default" : "ghost"} size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Teams</span>
            </Button>
          </Link>
          <Link href="/integrations">
            <Button variant={isActive("/integrations") ? "default" : "ghost"} size="sm" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden md:inline">Integrations</span>
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant={isActive("/marketplace") ? "default" : "ghost"} size="sm" className="gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden md:inline">Marketplace</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant={isActive("/profile") ? "default" : "ghost"} size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </Button>
          </Link>
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

