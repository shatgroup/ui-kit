import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils.ts"

const avatarSize = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
} as const

type AvatarSize = keyof typeof avatarSize

function Avatar({
  className,
  size = "md",
  ...props
}: AvatarPrimitive.Root.Props & { size?: AvatarSize }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium",
        avatarSize[size],
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("size-full object-cover", className)} {...props} />
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center", className)}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="avatar-badge" className={cn("absolute right-0 bottom-0 size-2 rounded-full bg-success", className)} {...props} />
}

function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="avatar-group" className={cn("flex items-center", className)} {...props} />
}

function AvatarGroupCount({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="avatar-group-count" className={cn("text-xs text-muted-foreground", className)} {...props} />
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage }
