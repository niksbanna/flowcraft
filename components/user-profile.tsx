"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ProfileForm } from "@/components/profile-form"
import { IntegrationsList } from "@/components/integrations-list"
import { ActivityHistory } from "@/components/activity-history"
import { ProfilePreferences } from "@/components/profile-preferences"
import { useAuth } from "@/components/auth-provider"

export function UserProfile() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState(authUser || { name: "", email: "", role: "" })
  const [activeTab, setActiveTab] = useState("profile")

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
        <Avatar className="h-24 w-24 border-4 border-background">
          <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.email} />
          <AvatarFallback className="text-2xl">{user.email.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800"
              >
                Admin
              </Badge>
              <Badge
                variant="outline"
                className="text-purple-500 border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800"
              >
                Pro Plan
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-muted-foreground">Product Manager at Acme Inc.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and how others see you on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} setUser={setUser} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Integrations</CardTitle>
              <CardDescription>Manage the services and tools connected to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationsList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>View your recent actions and changes to workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityHistory />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilePreferences />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

