import type { ReactNode } from "react"

export function PreviewFrame({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="@container w-full min-w-0 [transform:translateZ(0)]">
      <div data-showcase-scroll className="w-full min-w-0 overflow-x-auto">
        {wide ? <div className="min-w-[1400px] **:data-[slot=card]:shadow-none">{children}</div> : children}
      </div>
    </div>
  )
}
