import type { ComponentProps, ReactNode } from "react"
import { ChevronRightIcon } from "lucide-react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "@/lib/utils.ts"

function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" className={className} {...props} />
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("flex min-w-0 flex-wrap items-center gap-1 text-sm text-muted-foreground", className)} {...props} />
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex min-w-0 items-center gap-1", className)} {...props} />
}

function BreadcrumbLink({ className, render, ...props }: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">({ className: cn("text-sm hover:text-foreground", className) }, props),
    render,
    state: { slot: "breadcrumb-link" },
  })
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn("text-sm font-medium text-foreground", className)} {...props} />
}

function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={className} {...props}>
      {children ?? <ChevronRightIcon className="size-4" />}
    </li>
  )
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator }
export type { ReactNode }
