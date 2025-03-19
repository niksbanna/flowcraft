import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, CheckCircle, Clock, HelpCircle, Repeat } from "lucide-react"

function LoopNode({ data, selected }: NodeProps) {
  // Determine node status styling
  const getStatusIndicator = () => {
    if (!data.status) return null

    switch (data.status) {
      case "success":
        return (
          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
        )
      case "error":
        return (
          <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
        )
      case "running":
        return (
          <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
            <Clock className="h-3 w-3 text-white animate-pulse" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div
        className={`px-4 py-3 min-w-[220px] relative transition-all duration-200 ${selected ? "ring-2 ring-primary" : ""} border-2 border-dashed border-indigo-600`}
      >
        {getStatusIndicator()}

        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500 border-2 border-background" />

        <div className="flex items-center gap-2 mb-2">
          <Repeat className="h-5 w-5 text-indigo-400" />
          <div className="font-medium flex-1">{data.label}</div>
          <Badge variant="outline" className="bg-indigo-900 text-indigo-300 border-indigo-700 text-xs">
            loop
          </Badge>
        </div>

        {data.description && <div className="text-xs text-muted-foreground mt-1 mb-2">{data.description}</div>}

        {/* Loop configuration */}
        <div className="mt-2 pt-2 border-t border-gray-800 grid gap-1">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-indigo-400 font-medium">Type:</span>
            <span className="text-muted-foreground">{data.loopType || "For Each"}</span>
          </div>

          {data.loopConfig && <div className="text-xs font-mono bg-gray-800/50 p-1 rounded">{data.loopConfig}</div>}

          {data.currentIteration !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-indigo-400 font-medium">Current:</span>
              <span className="text-white">
                {data.currentIteration} / {data.totalIterations || "∞"}
              </span>
            </div>
          )}
        </div>

        {/* Help tooltip */}
        {data.help && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-1 right-1 text-muted-foreground cursor-help">
                <HelpCircle className="h-3 w-3" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{data.help}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Loop body handle */}
        <Handle
          id="body"
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-indigo-500 border-2 border-background left-[30%] translate-x-[-50%]"
        />

        {/* Loop exit handle */}
        <Handle
          id="exit"
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-green-500 border-2 border-background left-[70%] translate-x-[-50%]"
        />

        {/* Labels for handles */}
        <div className="flex justify-between mt-2 text-xs absolute w-full left-0 px-4">
          <div className="text-indigo-400 ml-[-10px]">Body</div>
          <div className="text-green-400 mr-[-10px]">Exit</div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default memo(LoopNode)

