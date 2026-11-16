import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils.ts"
import { BUTTON_SIZE, focusRing, ICON_SIZE, type ControlSize } from "./control.ts"
import { Spinner } from "./spinner.tsx"
import { Truncated } from "./truncated.tsx"

// check-ui-ignore-next-line: selector con của Tailwind cần ngoặc để khoá cỡ icon lucide
const iconSm = "[&_svg]:size-3.5"
// check-ui-ignore-next-line: selector con của Tailwind cần ngoặc để khoá cỡ icon lucide
const iconMd = "[&_svg]:size-4"
// check-ui-ignore-next-line: selector con của Tailwind cần ngoặc để khoá cỡ icon lucide
const iconLg = "[&_svg]:size-4.5"

const iconClass = { sm: iconSm, default: iconMd, lg: iconLg }

const hoverForce = {
  primary: "bg-primary/90",
  secondary: "bg-secondary/80",
  outline: "bg-muted",
  ghost: "bg-muted",
  destructive: "bg-destructive/90",
  link: "underline",
} as const

const pressedForce = {
  primary: "bg-primary/80",
  secondary: "bg-secondary/70",
  outline: "bg-accent",
  ghost: "bg-accent",
  destructive: "bg-destructive/80",
  link: "underline",
} as const

const buttonVariants = cva(
  [
    "inline-flex min-w-0 max-w-full shrink items-center justify-center gap-2 rounded-md border border-transparent",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "font-medium whitespace-nowrap select-none",
    "disabled:pointer-events-none disabled:opacity-50",
    focusRing,
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "border-primary bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        outline: "border-input bg-background hover:bg-muted active:bg-accent",
        ghost: "hover:bg-muted active:bg-accent",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        link: "text-primary-text underline-offset-4 hover:underline active:underline",
      },
      size: {
        sm: BUTTON_SIZE.sm,
        default: BUTTON_SIZE.default,
        lg: BUTTON_SIZE.lg,
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
    size?: ControlSize
    forceState?: "hover" | "pressed" | "focus"
  }

function Button({
  className,
  variant = "primary",
  size = "default",
  loading = false,
  forceState,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const shown = variant ?? "primary"
  return (
    <ButtonPrimitive
      data-slot="button"
      data-force-state={forceState}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ variant, size }),
        iconClass[size],
        "relative",
        forceState === "hover" && hoverForce[shown],
        forceState === "pressed" && pressedForce[shown],
        forceState === "focus" && "border-ring ring-2 ring-ring",
        className,
      )}
      {...props}
    >
      <Truncated className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {children}
      </Truncated>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={ICON_SIZE[size]} />
        </span>
      ) : null}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
