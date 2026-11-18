import { cn } from "@/lib/utils.ts"

export type ReadingKind = "speech" | "question"

export type ReadingSentence = {
  id: string
  text: string
  kind?: ReadingKind
}

type ReadingTextProps = {
  sentences: ReadingSentence[]
  selectedId?: string
  onSelect: (id: string) => void
  className?: string
}

const KIND = {
  speech: "italic",
  question: "font-bold",
} as const

export function ReadingText({ sentences, selectedId, onSelect, className }: ReadingTextProps) {
  const items = sentences.filter((sentence) => sentence.text.trim())

  return (
    <p data-slot="reading-text" className={cn("min-w-0 max-w-full text-base wrap-anywhere text-foreground", className)}>
      {items.map((sentence, index) => {
        const selected = sentence.id === selectedId
        return (
          <span key={sentence.id}>
            {index > 0 ? " " : null}
            <button
              type="button"
              aria-pressed={selected}
              data-kind={sentence.kind}
              data-state={selected ? "selected" : undefined}
              className={cn(
                "inline cursor-pointer rounded-sm text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                sentence.kind ? KIND[sentence.kind] : null,
                selected ? "bg-accent text-accent-foreground" : "hover:bg-muted",
              )}
              onClick={() => onSelect(sentence.id)}
            >
              {sentence.text.trim()}
            </button>
          </span>
        )
      })}
    </p>
  )
}
