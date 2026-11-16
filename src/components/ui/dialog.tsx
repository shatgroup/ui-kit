import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils.ts"
import { FormSurface } from "@/components/patterns/form-layout.tsx"
import { Button } from "./button.tsx"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-foreground/20", className)}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & { showCloseButton?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed z-50 flex min-h-0 w-auto flex-col gap-4 overflow-hidden rounded-lg border border-border bg-popover p-4 text-popover-foreground outline-none",
          "inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2",
          // check-ui-ignore-next-line: popup cần trần cao theo viewport, không có token chiều cao
          "max-h-[calc(100dvh-2rem)]",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={<Button variant="ghost" size="sm" className="absolute top-2 right-2 w-8 px-0" aria-label="Đóng" />}
          >
            <XIcon />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex shrink-0 flex-col gap-1 pr-8", className)} {...props} />
}

function DialogBody({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="dialog-body" className={cn("min-h-0 flex-1 overflow-y-auto", className)} {...props}>
      <FormSurface>{children}</FormSurface>
    </div>
  )
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="dialog-footer" className={cn("flex shrink-0 flex-wrap items-center justify-end gap-2", className)} {...props} />
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-lg font-semibold", className)} {...props} />
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
