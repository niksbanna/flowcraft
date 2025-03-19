import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, CheckCircle, Clock, HelpCircle } from "lucide-react"

function TransformationNode({ data, selected }: NodeProps) {
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
        className={`px-4 py-3 min-w-[220px] relative transition-all duration-200 ${selected ? "ring-2 ring-primary" : ""}`}
        style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          paddingLeft: "25px",
          paddingRight: "25px",
        }}
      >
        {getStatusIndicator()}

        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500 border-2 border-background" />

        <div className="flex items-center gap-2 mb-2">
          <div className="text-xl">{data.icon}</div>
          <div className="font-medium flex-1">{data.label}</div>
          <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700 text-xs">
            transform
          </Badge>
        </div>

        {data.description && <div className="text-xs text-muted-foreground mt-1 mb-2">{data.description}</div>}

        {/* Transformation details */}
        {data.transformType && (
          <div className="mt-2 pt-2 border-t border-gray-800 grid gap-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-green-400 font-medium">Type:</span>
              <span className="text-muted-foreground">{data.transformType}</span>
            </div>

            {data.transformConfig && (
              <div className="text-xs font-mono bg-gray-800/50 p-1 rounded">{data.transformConfig}</div>
            )}
          </div>
        )}

        {/* Input/Output Parameters */}
        {(data.inputs || data.outputs) && (
          <div className="mt-2 pt-2 border-t border-gray-800 grid gap-1">
            {data.inputs && data.inputs.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-blue-400 font-medium">Inputs:</span>
                <span className="text-muted-foreground">{data.inputs.join(", ")}</span>
              </div>
            )}

            {data.outputs && data.outputs.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-green-400 font-medium">Outputs:</span>
                <span className="text-muted-foreground">{data.outputs.join(", ")}</span>
              </div>
            )}
          </div>
        )}

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

        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500 border-2 border-background" />
      </div>
    </TooltipProvider>
  )
}

export default memo(TransformationNode)

