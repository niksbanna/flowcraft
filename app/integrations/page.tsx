"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Switch } from "@/components/ui/switch"
import { AlertCircle, CheckCircle, Plus, RefreshCw, Settings, Trash2, ExternalLink, Key, Lock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Sample connected services
const connectedServices = [
  {
    id: "google",
    name: "Google",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
    status: "connected",
    connectedAt: "2023-11-15T10:30:00Z",
    expiresAt: "2024-11-15T10:30:00Z",
    scopes: ["drive.readonly", "sheets", "gmail.send"],
    email: "user@example.com",
  },
  {
    id: "slack",
    name: "Slack",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
    status: "connected",
    connectedAt: "2023-10-22T14:45:00Z",
    expiresAt: "2024-10-22T14:45:00Z",
    scopes: ["channels:read", "chat:write", "users:read"],
    workspace: "My Workspace",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    status: "connected",
    connectedAt: "2023-12-05T09:15:00Z",
    expiresAt: "2024-12-05T09:15:00Z",
    scopes: ["repo", "user"],
    username: "username",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Dropbox_logo_%282013-2020%29.svg/2560px-Dropbox_logo_%282013-2020%29.svg.png",
    status: "expired",
    connectedAt: "2023-05-18T11:20:00Z",
    expiresAt: "2023-11-18T11:20:00Z",
    scopes: ["files.content.read", "files.content.write"],
    email: "user@example.com",
  },
]

// Sample API keys
const apiKeys = [
  {
    id: "openai",
    name: "OpenAI API",
    key: "sk-••••••••••••••••••••••••",
    createdAt: "2023-09-10T08:30:00Z",
    lastUsed: "2023-11-28T15:45:00Z",
    status: "active",
  },
  {
    id: "stripe",
    name: "Stripe API",
    key: "sk_test_•••••••••••••••••••",
    createdAt: "2023-08-05T14:20:00Z",
    lastUsed: "2023-11-29T10:15:00Z",
    status: "active",
  },
  {
    id: "twilio",
    name: "Twilio API",
    key: "AC••••••••••••••••••••••••",
    createdAt: "2023-07-22T11:10:00Z",
    lastUsed: "2023-10-15T09:30:00Z",
    status: "inactive",
  },
]

// Available services for connection
const availableServices = [
  {
    id: "twitter",
    name: "Twitter/X",
    icon: "https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png",
    description: "Connect to Twitter/X to post tweets and monitor activity",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/800px-LinkedIn_logo_initials.png",
    description: "Connect to LinkedIn for professional networking automation",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
    description: "Connect to Microsoft services including Office 365 and OneDrive",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Dropbox_logo_%282013-2020%29.svg/2560px-Dropbox_logo_%282013-2020%29.svg.png",
    description: "Connect to Dropbox for file storage and sharing",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png",
    description: "Connect to Salesforce CRM for customer data management",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png",
    description: "Connect to HubSpot for marketing and CRM automation",
  },
]

export default function IntegrationsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState(connectedServices)
  const [keys, setKeys] = useState(apiKeys)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyValue, setNewKeyValue] = useState("")
  const [addKeyDialogOpen, setAddKeyDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("oauth")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  const handleDisconnect = (serviceId: string) => {
    if (window.confirm("Are you sure you want to disconnect this service?")) {
      setServices(services.filter((service) => service.id !== serviceId))
    }
  }

  const handleRefreshToken = (serviceId: string) => {
    // In a real app, this would refresh the OAuth token
    setServices(
      services.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: "connected",
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            }
          : service,
      ),
    )
  }

  const handleAddKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return

    const newKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: newKeyValue.substring(0, 4) + "••••••••••••••••••••••••",
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      status: "active",
    }

    setKeys([...keys, newKey])
    setNewKeyName("")
    setNewKeyValue("")
    setAddKeyDialogOpen(false)
  }

  const handleDeleteKey = (keyId: string) => {
    if (window.confirm("Are you sure you want to delete this API key?")) {
      setKeys(keys.filter((key) => key.id !== keyId))
    }
  }

  const handleToggleKeyStatus = (keyId: string) => {
    setKeys(
      keys.map((key) => (key.id === keyId ? { ...key, status: key.status === "active" ? "inactive" : "active" } : key)),
    )
  }

  const handleConnectService = (serviceId: string) => {
    // In a real app, this would initiate the OAuth flow
    alert(`Initiating OAuth flow for ${serviceId}`)

    // For demo purposes, simulate a successful connection
    const newService = availableServices.find((service) => service.id === serviceId)
    if (newService) {
      const connectedService = {
        id: newService.id,
        name: newService.name,
        icon: newService.icon,
        status: "connected",
        connectedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        scopes: ["default"],
        email: "user@example.com",
      }

      setServices([...services, connectedService])
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Integrations & Connections</h1>
              <p className="text-muted-foreground mt-1">Manage your connected services and API keys</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/marketplace">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="oauth" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="oauth">OAuth Connections</TabsTrigger>
              <TabsTrigger value="apikeys">API Keys</TabsTrigger>
            </TabsList>

            <TabsContent value="oauth" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <img
                              src={service.icon || "/placeholder.svg"}
                              alt={service.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <CardDescription>
                              {service.status === "connected" ? (
                                <span className="flex items-center text-green-500">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Connected
                                </span>
                              ) : (
                                <span className="flex items-center text-amber-500">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Expired
                                </span>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">{service.email || service.username || service.workspace}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Connected:</span>
                          <span>{new Date(service.connectedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expires:</span>
                          <span>{new Date(service.expiresAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scopes:</span>
                          <span>{service.scopes.join(", ")}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-500"
                        onClick={() => handleDisconnect(service.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Disconnect
                      </Button>
                      {service.status === "expired" ? (
                        <Button size="sm" className="gap-1" onClick={() => handleRefreshToken(service.id)}>
                          <RefreshCw className="h-3 w-3" />
                          Refresh
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="gap-1">
                          <Settings className="h-3 w-3" />
                          Settings
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}

                {/* Add new connection card */}
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Connect a Service</CardTitle>
                    <CardDescription>Add a new OAuth connection</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {availableServices.slice(0, 4).map((service) => (
                        <Button
                          key={service.id}
                          variant="outline"
                          className="h-auto py-3 px-4 justify-start"
                          onClick={() => handleConnectService(service.id)}
                        >
                          <div className="w-6 h-6 mr-2 flex-shrink-0">
                            <img
                              src={service.icon || "/placeholder.svg"}
                              alt={service.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <span>{service.name}</span>
                        </Button>
                      ))}
                    </div>
                    <Button variant="ghost" className="mt-4" onClick={() => router.push("/marketplace")}>
                      View all services
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="apikeys" className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your API Keys</h2>
                <Dialog open={addKeyDialogOpen} onOpenChange={setAddKeyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New API Key</DialogTitle>
                      <DialogDescription>Add a new API key for external service integration</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="key-name">Service Name</Label>
                        <Input
                          id="key-name"
                          placeholder="e.g., Stripe API"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="key-value">API Key</Label>
                        <Input
                          id="key-value"
                          type="password"
                          placeholder="Enter your API key"
                          value={newKeyValue}
                          onChange={(e) => setNewKeyValue(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Your API key will be encrypted and stored securely
                        </p>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddKeyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddKey} disabled={!newKeyName.trim() || !newKeyValue.trim()}>
                        Add Key
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Alert className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  API keys provide direct access to services. Keep them secure and never share them.
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-3 grid grid-cols-12 gap-4 text-sm font-medium">
                  <div className="col-span-4">Service</div>
                  <div className="col-span-4">API Key</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                <div className="divide-y">
                  {keys.map((key) => (
                    <div key={key.id} className="p-3 grid grid-cols-12 gap-4 items-center hover:bg-muted/50">
                      <div className="col-span-4 font-medium">{key.name}</div>
                      <div className="col-span-4 font-mono text-sm flex items-center">
                        <Key className="h-3 w-3 mr-2 text-muted-foreground" />
                        {key.key}
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </div>
                      <div className="col-span-1">
                        <Switch
                          checked={key.status === "active"}
                          onCheckedChange={() => handleToggleKeyStatus(key.id)}
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteKey(key.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Security Best Practices</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Rotate your API keys regularly</li>
                      <li>Use different API keys for different environments</li>
                      <li>Never expose API keys in client-side code</li>
                      <li>Restrict API key permissions to only what's needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

