import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  forceState,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    forceState?: "hover" | "pressed" | "focus"
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const name = variant ?? "default"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-force-state={forceState}
      className={cn(
        buttonVariants({ variant, size, className }),
        forceState === "hover" && forceHover[name],
        forceState === "pressed" && forcePressed[name],
        forceState === "focus" && (name === "destructive"
          ? "border-ring ring-[3px] ring-destructive/20 dark:ring-destructive/40"
          : "border-ring ring-[3px] ring-ring/50"),
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
