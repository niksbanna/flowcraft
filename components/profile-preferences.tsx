"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

type NotificationSetting = {
  id: string
  title: string
  description: string
  enabled: boolean
}

type NotificationChannel = {
  id: string
  name: string
  enabled: boolean
}

export function ProfilePreferences() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: "workflow-runs",
      title: "Workflow Runs",
      description: "Get notified when your workflows start or complete",
      enabled: true,
    },
    {
      id: "workflow-errors",
      title: "Workflow Errors",
      description: "Get notified when your workflows encounter errors",
      enabled: true,
    },
    {
      id: "team-invites",
      title: "Team Invitations",
      description: "Get notified when you're invited to join a team",
      enabled: true,
    },
    {
      id: "workflow-shares",
      title: "Workflow Shares",
      description: "Get notified when someone shares a workflow with you",
      enabled: true,
    },
    {
      id: "comments",
      title: "Comments",
      description: "Get notified when someone comments on your workflows",
      enabled: false,
    },
  ])

  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([
    { id: "email", name: "Email", enabled: true },
    { id: "in-app", name: "In-app Notifications", enabled: true },
    { id: "slack", name: "Slack", enabled: false },
  ])

  const [timezone, setTimezone] = useState("America/Los_Angeles")
  const [language, setLanguage] = useState("en")

  const toggleNotificationSetting = (id: string) => {
    setNotificationSettings(
      notificationSettings.map((setting) => {
        if (setting.id === id) {
          return { ...setting, enabled: !setting.enabled }
        }
        return setting
      }),
    )
  }

  const toggleNotificationChannel = (id: string) => {
    setNotificationChannels(
      notificationChannels.map((channel) => {
        if (channel.id === id) {
          return { ...channel, enabled: !channel.enabled }
        }
        return channel
      }),
    )
  }

  const savePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <div className="font-medium">{setting.title}</div>
                <div className="text-sm text-muted-foreground">{setting.description}</div>
              </div>
              <Switch
                checked={setting.enabled}
                onCheckedChange={() => toggleNotificationSetting(setting.id)}
                aria-label={`Toggle ${setting.title} notifications`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Channels</h3>
        <div className="space-y-4">
          {notificationChannels.map((channel) => (
            <div key={channel.id} className="flex items-center justify-between space-x-2">
              <div className="font-medium">{channel.name}</div>
              <Switch
                checked={channel.enabled}
                onCheckedChange={() => toggleNotificationChannel(channel.id)}
                aria-label={`Toggle ${channel.name} notifications`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Regional Settings</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="timezone">
              Timezone
            </label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="language">
              Language
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={savePreferences}>Save Preferences</Button>
      </div>
    </div>
  )
}

