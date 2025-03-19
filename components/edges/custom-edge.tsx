import { memo } from "react"
import { type EdgeProps, getBezierPath, EdgeLabelRenderer } from "reactflow"

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
  data,
  selected,
  sourceHandleId,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // Determine edge color based on source handle (for condition nodes)
  let edgeColor = "rgba(255, 255, 255, 0.5)"
  let edgeLabel = ""

  if (sourceHandleId === "true") {
    edgeColor = "rgba(74, 222, 128, 0.8)" // green
    edgeLabel = "True"
  } else if (sourceHandleId === "false") {
    edgeColor = "rgba(248, 113, 113, 0.8)" // red
    edgeLabel = "False"
  } else if (sourceHandleId === "body") {
    edgeColor = "rgba(129, 140, 248, 0.8)" // indigo
    edgeLabel = "Loop"
  } else if (sourceHandleId === "exit") {
    edgeColor = "rgba(74, 222, 128, 0.8)" // green
    edgeLabel = "Exit"
  }

  // Apply selected state styling
  const strokeWidth = selected ? 3 : 2
  const opacity = selected ? 1 : 0.8

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth,
          stroke: edgeColor,
          opacity,
          transition: "stroke-width 0.2s, opacity 0.2s",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />

      {/* Edge label */}
      {edgeLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 10,
              pointerEvents: "all",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "2px 4px",
              borderRadius: 4,
              color: edgeColor,
              fontWeight: 500,
            }}
            className="nodrag nopan"
          >
            {edgeLabel}
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Data transfer animation */}
      {data?.transferring && (
        <circle
          r={4}
          fill="#fff"
          className="animate-edge-flow"
          style={{
            offsetPath: `path("${edgePath}")`,
            offsetRotate: "0deg",
            offsetDistance: "0%",
            animation: "flow 1.5s linear infinite",
          }}
        />
      )}
    </>
  )
}

export default memo(CustomEdge)

