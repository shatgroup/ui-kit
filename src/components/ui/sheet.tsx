import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils.ts"
import { FormSurface } from "@/components/patterns/form-layout.tsx"
import { Button } from "./button.tsx"

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop data-slot="sheet-overlay" className={cn("fixed inset-0 z-50 bg-foreground/20", className)} {...props} />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex h-dvh w-72 max-w-full flex-col gap-4 border border-border bg-popover p-4 text-popover-foreground outline-none",
          side === "left" && "inset-y-0 left-0 border-r border-border",
          side === "right" && "inset-y-0 right-0 border-l border-border",
          side === "top" && "inset-x-0 top-0 h-auto max-h-dvh w-full border-b border-border",
          side === "bottom" && "inset-x-0 bottom-0 h-auto max-h-dvh w-full border-t border-border",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={<Button variant="ghost" size="sm" className="absolute top-2 right-2 w-8 px-0" aria-label="Đóng" />}
          >
            <XIcon />
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex shrink-0 flex-col gap-1 pr-8", className)} {...props} />
}

function SheetBody({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="sheet-body" className={cn("min-h-0 flex-1 overflow-y-auto", className)} {...props}>
      <FormSurface>{children}</FormSurface>
    </div>
  )
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("flex shrink-0 flex-wrap items-center gap-2", className)} {...props} />
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("text-lg font-semibold", className)} {...props} />
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}
