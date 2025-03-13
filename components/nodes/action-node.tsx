import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

function ActionNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <div className="text-xl">{data.icon}</div>
        <div className="font-medium">{data.label}</div>
      </div>
      {data.description && <div className="text-xs text-muted-foreground mt-1">{data.description}</div>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default memo(ActionNode)

