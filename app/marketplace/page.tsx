"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, Download, ExternalLink, ThumbsUp } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

// Sample marketplace integrations
const integrations = [
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Connect and manipulate Google Sheets data",
    category: "Data",
    author: "FlowCraft",
    verified: true,
    stars: 4.8,
    reviews: 124,
    installs: 5600,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Sheets_logo_%282014-2020%29.svg/1498px-Google_Sheets_logo_%282014-2020%29.svg.png",
    price: "Free",
    tags: ["spreadsheet", "google", "data"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send messages and interact with Slack channels",
    category: "Communication",
    author: "FlowCraft",
    verified: true,
    stars: 4.7,
    reviews: 98,
    installs: 4800,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
    price: "Free",
    tags: ["messaging", "notification", "team"],
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Integrate AI capabilities with GPT models",
    category: "AI",
    author: "FlowCraft",
    verified: true,
    stars: 4.9,
    reviews: 203,
    installs: 7200,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1024px-OpenAI_Logo.svg.png",
    price: "Free",
    tags: ["ai", "gpt", "machine learning"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Process payments and manage subscriptions",
    category: "Finance",
    author: "FlowCraft",
    verified: true,
    stars: 4.6,
    reviews: 87,
    installs: 3900,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
    price: "Free",
    tags: ["payment", "subscription", "finance"],
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Connect to Airtable bases and manage records",
    category: "Data",
    author: "Community",
    verified: false,
    stars: 4.5,
    reviews: 62,
    installs: 2800,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Airtable_Logo.svg/2560px-Airtable_Logo.svg.png",
    price: "Free",
    tags: ["database", "spreadsheet", "records"],
  },
  {
    id: "twitter",
    name: "Twitter/X",
    description: "Post tweets and monitor Twitter activity",
    category: "Social Media",
    author: "Community",
    verified: true,
    stars: 4.4,
    reviews: 76,
    installs: 3200,
    icon: "https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png",
    price: "Free",
    tags: ["social media", "tweets", "monitoring"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Manage contacts and marketing campaigns",
    category: "CRM",
    author: "Community",
    verified: false,
    stars: 4.3,
    reviews: 54,
    installs: 2100,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png",
    price: "Free",
    tags: ["crm", "marketing", "contacts"],
  },
  {
    id: "aws-s3",
    name: "AWS S3",
    description: "Store and retrieve files from Amazon S3",
    category: "Storage",
    author: "FlowCraft",
    verified: true,
    stars: 4.7,
    reviews: 91,
    installs: 4100,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Amazon-S3-Logo.svg/1200px-Amazon-S3-Logo.svg.png",
    price: "Free",
    tags: ["storage", "aws", "cloud"],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "Connect to MongoDB databases and collections",
    category: "Database",
    author: "FlowCraft",
    verified: true,
    stars: 4.6,
    reviews: 83,
    installs: 3800,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/2560px-MongoDB_Logo.svg.png",
    price: "Free",
    tags: ["database", "nosql", "collections"],
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect FlowCraft to thousands of apps via Zapier",
    category: "Integration",
    author: "Community",
    verified: true,
    stars: 4.8,
    reviews: 112,
    installs: 5200,
    icon: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
    price: "Free",
    tags: ["integration", "automation", "apps"],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Automate GitHub workflows and repository management",
    category: "Development",
    author: "FlowCraft",
    verified: true,
    stars: 4.7,
    reviews: 95,
    installs: 4500,
    icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    price: "Free",
    tags: ["git", "development", "code"],
  },
  {
    id: "custom-code",
    name: "Custom Code",
    description: "Run custom JavaScript, Python, or Node.js code",
    category: "Development",
    author: "FlowCraft",
    verified: true,
    stars: 4.9,
    reviews: 187,
    installs: 6800,
    icon: "/placeholder.svg?height=80&width=80",
    price: "Free",
    tags: ["code", "javascript", "python", "node"],
  },
]

// Sample community nodes
const communityNodes = [
  {
    id: "pdf-extractor",
    name: "PDF Data Extractor",
    description: "Extract structured data from PDF documents",
    author: "DataWizard",
    stars: 4.6,
    reviews: 42,
    installs: 1800,
    icon: "/placeholder.svg?height=80&width=80",
    price: "Free",
    tags: ["pdf", "extraction", "data"],
  },
  {
    id: "sentiment-analyzer",
    name: "Sentiment Analyzer",
    description: "Analyze text sentiment using NLP techniques",
    author: "AIExpert",
    stars: 4.7,
    reviews: 38,
    installs: 2100,
    icon: "/placeholder.svg?height=80&width=80",
    price: "Free",
    tags: ["nlp", "sentiment", "analysis"],
  },
  {
    id: "image-processor",
    name: "Image Processor",
    description: "Process and transform images with various filters",
    author: "VisualPro",
    stars: 4.5,
    reviews: 29,
    installs: 1500,
    icon: "/placeholder.svg?height=80&width=80",
    price: "Free",
    tags: ["image", "processing", "filters"],
  },
  {
    id: "csv-transformer",
    name: "CSV Transformer",
    description: "Advanced CSV data transformation and cleaning",
    author: "DataCleanser",
    stars: 4.4,
    reviews: 31,
    installs: 1700,
    icon: "/placeholder.svg?height=80&width=80",
    price: "Free",
    tags: ["csv", "data", "transformation"],
  },
  {
    id: "regex-tools",
    name: "Regex Tools",
    description: "Powerful regular expression operations for text",
    author: "TextMaster",
    stars: 4.8,
    reviews: 45,
    installs: 2300,
    icon: "/placeholder.svg?height=80&width=80",
    price: "Free",
    tags: ["regex", "text", "pattern"],
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "Real-time currency conversion with historical rates",
    author: "FinanceTools",
    stars: 4.3,
    reviews: 27,
    installs: 1400,
    icon: "/placeholder.svg?height=80&width=80",
    price: "Free",
    tags: ["currency", "finance", "conversion"],
  },
]

export default function MarketplacePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("integrations")
  const [category, setCategory] = useState("All")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  // Filter integrations based on search and category
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = category === "All" || integration.category === category

    return matchesSearch && matchesCategory
  })

  // Filter community nodes based on search
  const filteredNodes = communityNodes.filter((node) => {
    return (
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  // Get unique categories
  const categories = ["All", ...new Set(integrations.map((i) => i.category))]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Integration Marketplace</h1>
              <p className="text-muted-foreground mt-1">Discover integrations and community-built nodes</p>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="integrations" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="integrations">Service Integrations</TabsTrigger>
              <TabsTrigger value="nodes">Community Nodes</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <TabsContent value="integrations" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIntegrations.map((integration) => (
                    <Card key={integration.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <img
                                src={integration.icon || "/placeholder.svg"}
                                alt={integration.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {integration.name}
                                {integration.verified && (
                                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                    Verified
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription>By {integration.author}</CardDescription>
                            </div>
                          </div>
                          <Badge>{integration.price}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{integration.description}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-medium">{integration.stars}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({integration.reviews} reviews)</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {integration.installs.toLocaleString()} installs
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {integration.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Details
                        </Button>
                        <Button size="sm" className="gap-1">
                          <Download className="h-3 w-3" />
                          Install
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {filteredIntegrations.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No integrations found matching your search criteria.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="nodes" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNodes.map((node) => (
                    <Card key={node.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <img
                                src={node.icon || "/placeholder.svg"}
                                alt={node.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{node.name}</CardTitle>
                              <CardDescription>By {node.author}</CardDescription>
                            </div>
                          </div>
                          <Badge>{node.price}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{node.description}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-medium">{node.stars}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({node.reviews} reviews)</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {node.installs.toLocaleString()} installs
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {node.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          Like
                        </Button>
                        <Button size="sm" className="gap-1">
                          <Download className="h-3 w-3" />
                          Install
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {filteredNodes.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No community nodes found matching your search criteria.</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

