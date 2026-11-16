import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils.ts"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-input bg-transparent",
      },
      size: {
        sm: "h-control-sm px-2",
        md: "h-control-md px-3",
        lg: "h-control-lg px-4",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
    },
  },
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive data-slot="toggle" className={cn(toggleVariants({ variant, size }), className)} {...props} />
}

export { Toggle, toggleVariants }
