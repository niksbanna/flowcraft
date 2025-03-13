import { memo } from "react"
import { type EdgeProps, getBezierPath } from "reactflow"

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
}

export default memo(CustomEdge)

