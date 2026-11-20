import * as React from "react"
import { cn } from "cn"
import { ArrowRightIcon, CornerDownLeftIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { copyToClipboard } from "./copy-button.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import { Separator } from "@/components/ui/separator.tsx"

type NavItem = { name: string; href: string; group: string; component: boolean }

function useMutationObserver(ref: React.RefObject<HTMLElement | null>, callback: MutationCallback) {
  React.useEffect(() => {
    if (!ref.current) return
    const observer = new MutationObserver(callback)
    observer.observe(ref.current, { attributes: true, characterData: true, childList: true, subtree: true })
    return () => observer.disconnect()
  }, [ref, callback])
}

function CommandMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = React.useState(false)
  const [copyPayload, setCopyPayload] = React.useState("")

  React.useEffect(() => {
    function down(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
      if (event.key === "c" && (event.metaKey || event.ctrlKey) && copyPayload) {
        void copyToClipboard(copyPayload)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [copyPayload])

  const groups = items.reduce<Record<string, NavItem[]>>((acc, item) => {
    acc[item.group] = [...(acc[item.group] ?? []), item]
    return acc
  }, {})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-8 w-full justify-start rounded-lg border-none bg-muted pl-3 text-foreground shadow-none transition-colors hover:bg-muted/50 md:w-48 lg:w-40 xl:w-64 dark:bg-card"
          onClick={() => setOpen(true)}
        >
          <span className="hidden xl:inline-flex">Search documentation...</span>
          <span className="inline-flex xl:hidden">Search...</span>
          <kbd className="pointer-events-none absolute top-1.5 right-1.5 hidden h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className="fixed top-[15%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] gap-4 rounded-xl border-none bg-clip-padding p-2 pb-11 ring-4 ring-neutral-200/80 outline-none sm:max-w-lg dark:bg-neutral-900 dark:ring-neutral-800"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search documentation...</DialogTitle>
            <DialogDescription>Search for a command to run...</DialogDescription>
          </DialogHeader>
          <Command
            className="rounded-none bg-transparent **:data-[slot=command-input]:h-9! **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border **:data-[slot=command-input-wrapper]:border-input **:data-[slot=command-input-wrapper]:bg-input/50"
            filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
          >
            <CommandInput placeholder="Search documentation..." />
            <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
              <CommandEmpty className="py-12 text-center text-sm text-muted-foreground">No results found.</CommandEmpty>
              {Object.entries(groups).map(([group, groupItems]) => (
                <CommandGroup
                  key={group}
                  heading={group}
                  className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
                >
                  {groupItems.map((item) => (
                    <CommandMenuItem
                      key={item.href}
                      value={`${group} ${item.name}`}
                      onHighlight={() => setCopyPayload(item.component ? `npx shadcn@latest add ${item.href.split("/").pop()}` : "")}
                      onSelect={() => {
                        setOpen(false)
                        window.location.assign(item.href)
                      }}
                    >
                      {item.component ? (
                        <div className="aspect-square size-4 rounded-full border border-dashed border-muted-foreground" />
                      ) : (
                        <ArrowRightIcon />
                      )}
                      {item.name}
                    </CommandMenuItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
          <div className="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium text-muted-foreground dark:border-t-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-2">
              <CommandMenuKbd>
                <CornerDownLeftIcon />
              </CommandMenuKbd>
              Go to Page
            </div>
            {copyPayload ? (
              <>
                <Separator orientation="vertical" className="h-4!" />
                <div className="flex items-center gap-1">
                  <CommandMenuKbd>⌘</CommandMenuKbd>
                  <CommandMenuKbd>C</CommandMenuKbd>
                  {copyPayload}
                </div>
              </>
            ) : null}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & { onHighlight?: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null)
  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === "aria-selected" && ref.current?.getAttribute("aria-selected") === "true") {
        onHighlight?.()
      }
    }
  })
  return (
    <CommandItem
      ref={ref}
      className={cn(
        "h-9 rounded-md border border-transparent px-3! font-medium data-[selected=true]:border-input data-[selected=true]:bg-input/50",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  )
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 items-center justify-center gap-1 rounded border bg-background px-1 font-sans text-[0.7rem] font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

export { CommandMenu }
export type { NavItem }
