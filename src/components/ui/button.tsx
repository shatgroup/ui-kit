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

const iconClass = { sm: iconSm, md: iconMd, lg: iconLg }

const buttonVariants = cva(
  [
    "inline-flex min-w-0 max-w-full shrink items-center justify-center gap-2 rounded-md border border-transparent",
    "font-medium whitespace-nowrap select-none",
    "disabled:pointer-events-none disabled:opacity-50",
    focusRing,
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "border-primary bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        outline: "border-input bg-background shadow-xs hover:bg-muted",
        ghost: "hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        link: "text-primary-text underline-offset-4 hover:underline",
      },
      size: {
        sm: BUTTON_SIZE.sm,
        md: BUTTON_SIZE.md,
        lg: BUTTON_SIZE.lg,
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
    size?: ControlSize
  }

function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), iconClass[size], "relative", className)}
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
