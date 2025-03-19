import { Loader2 } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading FlowCraft...</h2>
      </div>
    </div>
  )
}

