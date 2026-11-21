import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { Separator } from "@/components/ui/separator.tsx"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function ScrollAreaRtl() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border" dir="rtl">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">العلامات</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}
