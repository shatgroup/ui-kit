import { Position, type HandleProps } from "@xyflow/react"
import { BaseHandle } from "@/components/flow/base-handle.tsx"

const wrapperClassNames: Record<Position, string> = {
  [Position.Top]: "flex-col-reverse left-1/2 -translate-x-1/2 -translate-y-full",
  [Position.Bottom]: "flex-col left-1/2 -translate-x-1/2 translate-y-2",
  [Position.Left]: "flex-row-reverse top-1/2 -translate-x-full -translate-y-1/2",
  [Position.Right]: "top-1/2 translate-x-2 -translate-y-1/2",
}

export function ButtonHandle({
  showButton = true,
  position = Position.Bottom,
  children,
  ...props
}: HandleProps & { showButton?: boolean }) {
  const vertical = position === Position.Top || position === Position.Bottom

  return (
    <BaseHandle position={position} id={props.id} {...props}>
      {showButton ? (
        <div className={`pointer-events-none absolute flex items-center ${wrapperClassNames[position]}`}>
          <div className={`bg-border ${vertical ? "h-10 w-px" : "h-px w-10"}`} />
          <div className="nodrag nopan pointer-events-auto">{children}</div>
        </div>
      ) : null}
    </BaseHandle>
  )
}
