import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import WorkflowDemo from "@/components/workflow-demo"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <WorkflowDemo />
    </main>
  )
}

