import { useHighlightedCode } from "@/hooks/use-highlighted-code.ts"

import { CopyButton } from "./copy-button.tsx"

function HighlightedCode({
  code,
  language = "tsx",
  preview = false,
}: {
  code: string
  language?: string
  preview?: boolean
}) {
  const lines = useHighlightedCode(code, language || "tsx")
  return (
    <figure data-rehype-pretty-code-figure="" className={preview ? undefined : "[&>pre]:max-h-96"}>
      <CopyButton value={code} />
      <pre className="no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none">
        <code data-line-numbers="" data-language={language}>
          {lines.map((line, index) => (
            <span key={index} data-line="">
              {line}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}

export { HighlightedCode }
