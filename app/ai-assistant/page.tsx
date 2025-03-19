import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AIAssistantPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">AI Workflow Assistant</h1>
              <p className="text-muted-foreground mt-1">
                Describe what you want to build and let AI create a workflow for you
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            <Card className="bg-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Describe Your Workflow
                </CardTitle>
                <CardDescription>
                  Tell us what you want to automate and our AI will generate a workflow for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Example: I want to scrape product data from an e-commerce website, analyze pricing trends, and send me a daily report by email."
                  className="min-h-[200px] bg-gray-900 border-gray-800 text-white"
                />
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                <Button variant="outline">See Examples</Button>
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                  Generate Workflow <Sparkles className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card className="bg-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-purple-900/30 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Describe Your Needs</h3>
                      <p className="text-sm text-muted-foreground">
                        Explain what you want to automate in plain language
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-purple-900/30 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">AI Generates Workflow</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI creates a workflow with the right nodes and connections
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-purple-900/30 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Customize & Deploy</h3>
                      <p className="text-sm text-muted-foreground">Fine-tune the generated workflow and deploy it</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle>Example Prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-900/70">
                    <p className="text-sm">"Monitor Twitter for mentions of my brand and send alerts to Slack"</p>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-900/70">
                    <p className="text-sm">"Extract data from PDF invoices and add them to a Google Sheet"</p>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-900/70">
                    <p className="text-sm">
                      "Generate weekly sales reports from my Shopify store and email them to my team"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results preview (would be shown after generation) */}
          <div className="hidden">
            <Card className="bg-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle>Generated Workflow</CardTitle>
                <CardDescription>Here's the workflow our AI has created based on your description</CardDescription>
              </CardHeader>
              <CardContent>
                {/* This would contain a preview of the generated workflow */}
                <div className="h-[400px] bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                <Button variant="outline">Regenerate</Button>
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                  Open in Editor <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

