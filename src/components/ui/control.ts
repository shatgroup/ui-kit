export const CONTROL_SIZE = {
  sm: "h-control-sm px-2 text-sm",
  default: "h-control-default px-3 text-sm",
  lg: "h-control-lg px-4 text-sm",
} as const

export const BUTTON_SIZE = {
  sm: "h-control-sm px-3 text-sm",
  default: "h-control-default px-4 text-sm",
  lg: "h-control-lg px-6 text-sm",
} as const

export const ICON_SIZE = {
  sm: "size-3.5",
  default: "size-4",
  lg: "size-4.5",
} as const

export type ControlSize = keyof typeof CONTROL_SIZE

export const focusRing =
  "outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"

export const fieldClass = [
  "box-border w-full min-w-0 rounded-md border border-input bg-background text-foreground",
  "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
  "aria-invalid:border-destructive",
  focusRing,
].join(" ")
