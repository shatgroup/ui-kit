import { createContext, useCallback, useContext, useState, type ComponentProps, type MouseEvent } from "react"
import { NodeToolbar, type NodeToolbarProps } from "@xyflow/react"
import { cn } from "@/lib/utils"

type TooltipContextType = {
  isVisible: boolean
  showTooltip: () => void
  hideTooltip: () => void
}

const TooltipContext = createContext<TooltipContextType | null>(null)

export function NodeTooltip({ children }: ComponentProps<"div">) {
  const [isVisible, setIsVisible] = useState(false)
  const showTooltip = useCallback(() => setIsVisible(true), [])
  const hideTooltip = useCallback(() => setIsVisible(false), [])

  return (
    <TooltipContext.Provider value={{ isVisible, showTooltip, hideTooltip }}>
      <div>{children}</div>
    </TooltipContext.Provider>
  )
}

export function NodeTooltipTrigger(props: ComponentProps<"div">) {
  const tooltipContext = useContext(TooltipContext)
  if (!tooltipContext) throw new Error("NodeTooltipTrigger must be used within NodeTooltip")
  const { showTooltip, hideTooltip } = tooltipContext

  const onMouseEnter = useCallback((event: MouseEvent<HTMLDivElement>) => {
    props.onMouseEnter?.(event)
    showTooltip()
  }, [props, showTooltip])

  const onMouseLeave = useCallback((event: MouseEvent<HTMLDivElement>) => {
    props.onMouseLeave?.(event)
    hideTooltip()
  }, [props, hideTooltip])

  return <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...props} />
}

export function NodeTooltipContent({ children, position, className, ...props }: NodeToolbarProps) {
  const tooltipContext = useContext(TooltipContext)
  if (!tooltipContext) throw new Error("NodeTooltipContent must be used within NodeTooltip")

  return (
    <NodeToolbar
      isVisible={tooltipContext.isVisible}
      className={cn("rounded-lg border border-border bg-card p-2 text-card-foreground", className)}
      tabIndex={0}
      position={position}
      {...props}
    >
      {children}
    </NodeToolbar>
  )
}
