import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils.ts"
import { Truncated } from "./truncated.tsx"

const badgeVariants = cva(
  "inline-flex h-5 max-w-full min-w-0 items-center rounded-full px-2 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-badge-neutral text-badge-neutral-foreground",
        primary: "bg-badge-primary text-badge-primary-foreground",
        success: "bg-badge-success text-badge-success-foreground",
        warning: "bg-badge-warning text-badge-warning-foreground",
        info: "bg-badge-info text-badge-info-foreground",
        destructive: "bg-badge-destructive text-badge-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
)

function Badge({
  className,
  variant = "neutral",
  render,
  children,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        children: <Truncated>{children}</Truncated>,
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
