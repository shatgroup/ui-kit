import { XIcon } from "lucide-react"
import { useState, type KeyboardEvent } from "react"
import { cn } from "cn"
import { Badge } from "./badge.tsx"
import { InputGroup, InputGroupInput } from "./input-group.tsx"
import { CONTROL_SIZE, type ControlSize } from "./control.ts"

function TagsInput({
  value,
  onValueChange,
  size = "default",
  placeholder = "Add a tag",
  removeLabel = "Remove",
}: {
  value: string[]
  onValueChange: (value: string[]) => void
  size?: ControlSize
  placeholder?: string
  removeLabel?: string
}) {
  const [draft, setDraft] = useState("")
  function add(text: string) {
    const next = text.trim()
    if (!next || value.includes(next)) return
    onValueChange([...value, next])
    setDraft("")
  }
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      add(draft)
    }
    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onValueChange(value.slice(0, -1))
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {value.map((tag, index) => (
          <Badge key={`${tag}-${index}`} variant="outline">
            {tag}
            <button type="button" className="inline-flex size-3 items-center justify-center" aria-label={`${removeLabel} ${tag}`} onClick={() => onValueChange(value.filter((_, itemIndex) => itemIndex !== index))}>
              <XIcon className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <InputGroup className={cn(size === "default" ? undefined : CONTROL_SIZE[size])}>
        <InputGroupInput
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
        />
      </InputGroup>
    </div>
  )
}

export { TagsInput }
