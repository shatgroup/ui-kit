import * as React from "react"
import { cn } from "cn"
import { Button } from "./button.tsx"

const forceHover: Record<string, string> = {
  default: "bg-primary/90",
  destructive: "bg-destructive/90",
  outline: "bg-accent text-accent-foreground",
  secondary: "bg-secondary/80",
  ghost: "bg-accent text-accent-foreground",
  link: "underline",
}

const forcePressed: Record<string, string> = {
  default: "bg-primary/80",
  destructive: "bg-destructive/80",
  outline: "bg-accent text-accent-foreground",
  secondary: "bg-secondary/70",
  ghost: "bg-accent text-accent-foreground",
  link: "underline",
}

type ButtonStateProps = React.ComponentProps<typeof Button> & {
  state?: "default" | "hover" | "pressed" | "focus" | "disabled"
}

function ButtonState({
  state = "default",
  variant = "default",
  className,
  disabled,
  ...props
}: ButtonStateProps) {
  const name = variant ?? "default"
  return (
    <Button
      {...props}
      variant={variant}
      disabled={disabled || state === "disabled"}
      data-force-state={state === "default" || state === "disabled" ? undefined : state}
      className={cn(
        state === "hover" && forceHover[name],
        state === "pressed" && forcePressed[name],
        state === "focus" && (name === "destructive"
          ? "border-ring ring-[3px] ring-destructive/20 dark:ring-destructive/40"
          : "border-ring ring-[3px] ring-ring/50"),
        className,
      )}
    />
  )
}

export { ButtonState }
