import type { ReactNode } from "react"

export function PreviewFrame({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="@container size-full min-h-0 flex-1 [transform:translateZ(0)]">
      <div data-showcase-scroll className="size-full overflow-auto">
        {wide ? <div className="size-full min-w-[1400px]">{children}</div> : children}
      </div>
    </div>
  )
}
