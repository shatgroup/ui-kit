import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button.tsx"
import { CopyButton } from "./copy-button.tsx"
import { examples } from "./examples/index.ts"

const sources = import.meta.glob("./examples/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function sourceOf(name: string) {
  return sources[`./examples/${name}.tsx`] ?? ""
}

function ComponentPreview({
  name,
  className,
  previewClassName,
  align = "center",
  hideCode = false,
}: {
  name: string
  className?: string
  previewClassName?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
}) {
  const [codeVisible, setCodeVisible] = React.useState(false)
  const Example = examples[name]
  const source = sourceOf(name)
  const previewSource = source.split("\n").slice(0, 3).join("\n")

  if (!Example) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Component <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{name}</code> not found in registry.
      </p>
    )
  }

  return (
    <div
      data-slot="component-preview"
      data-not-typeset
      className={cn("group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-2xl border", className)}
    >
      <div data-slot="preview" dir="ltr">
        <div
          data-align={align}
          className={cn(
            "preview relative flex h-72 w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-start data-[align=start]:items-start sm:data-[align=end]:items-end",
            previewClassName
          )}
        >
          <Example />
        </div>
      </div>
      {!hideCode && (
        <div
          data-slot="code"
          data-mobile-code-visible={codeVisible}
          className="relative overflow-hidden **:data-[slot=copy-button]:right-4 **:data-[slot=copy-button]:hidden data-[mobile-code-visible=true]:**:data-[slot=copy-button]:flex [&_[data-rehype-pretty-code-figure]]:m-0! [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-72"
        >
          {codeVisible ? (
            <figure data-rehype-pretty-code-figure="" className="relative [&>pre]:max-h-96">
              <CopyButton value={source} />
              <pre className="overflow-auto bg-muted p-6 font-mono text-sm text-foreground">
                <code>{source}</code>
              </pre>
            </figure>
          ) : (
            <div className="relative">
              <pre className="max-h-72 overflow-hidden bg-muted p-6 font-mono text-sm text-muted-foreground">
                <code>{previewSource}</code>
              </pre>
              <div className="absolute inset-0 flex items-center justify-center pb-4">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, var(--color-muted), color-mix(in oklab, var(--color-muted) 60%, transparent), transparent)",
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="relative z-10 rounded-lg bg-background text-foreground shadow-none hover:bg-muted dark:bg-background dark:text-foreground dark:hover:bg-muted"
                  onClick={() => setCodeVisible(true)}
                >
                  View Code
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { ComponentPreview }
