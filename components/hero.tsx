import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Automate any workflow
                <span className="block text-primary">with AI</span>
              </h1>
              <p className="text-xl text-muted-foreground">No coding required.</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/workflow">
                <Button size="lg" className="px-8">
                  Create a workflow
                </Button>
              </Link>
              <Link href="/workflow/large-scale">
                <Button size="lg" variant="outline">
                  See large-scale demo
                </Button>
              </Link>
            </div>
            <div className="pt-8">
              <h3 className="text-sm font-medium mb-2">Trusted by</h3>
              <div className="flex gap-6 items-center">
                <div className="text-muted-foreground font-medium">Company 1</div>
                <div className="text-muted-foreground font-medium">Company 2</div>
                <div className="text-muted-foreground font-medium">Company 3</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">*Not just logos, they actually use the platform.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

