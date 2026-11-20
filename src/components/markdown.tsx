import type { ComponentProps, ReactNode } from "react"
import { cn } from "cn"

import { useHighlightedCode } from "@/hooks/use-highlighted-code.ts"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block.tsx"

type ExtraProps = { node?: unknown }

function useIsCodeFenceIncomplete() {
  return false
}

function MarkdownCode({
  className,
  children,
  node: _node,
  ...props
}: ComponentProps<"code"> & ExtraProps) {
  if (!("data-block" in props)) {
    return <code className={cn("font-mono", className)} {...props}>{children}</code>
  }
  const code = typeof children === "string" ? children : ""
  const language = /language-(\S+)/.exec(className ?? "")?.[1] ?? ""
  const lines = useHighlightedCode(code, language)
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{language || "text"}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => <CodeBlockLine key={index}>{line}</CodeBlockLine>)}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function Streamdown({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
  components?: { code?: typeof MarkdownCode }
  controls?: boolean
  isAnimating?: boolean
}) {
  return <div className={cn("w-full min-w-0 whitespace-pre-wrap", className)}>{children}</div>
}

function Markdown({ className, children }: { className?: string; children?: ReactNode }) {
  const text = typeof children === "string" ? children : ""
  const blocks = text.split(/\n\n+/)
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-3 whitespace-pre-wrap", className)}>
      {blocks.map((block) => <p key={block}>{inline(block)}</p>)}
    </div>
  )
}

function inline(text: string) {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*)|(`[^`]+`)/g
  let cursor = 0
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > cursor) nodes.push(text.slice(cursor, index))
    const token = match[0]
    if (token.startsWith("**")) nodes.push(<strong key={index}>{token.slice(2, -2)}</strong>)
    else nodes.push(<code key={index} className="font-mono">{token.slice(1, -1)}</code>)
    cursor = index + token.length
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

export type { ExtraProps }
export { Markdown, Streamdown, useIsCodeFenceIncomplete }
