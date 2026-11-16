import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "./button.tsx"
import { InputGroup } from "./input-group.tsx"
import type { ControlSize } from "./control.ts"

function NumberInput({
  size = "md",
  value,
  onValueChange,
  min,
  max,
  step = 1,
}: {
  size?: ControlSize
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}) {
  function set(next: number) {
    const low = min ?? next
    const high = max ?? next
    onValueChange(Math.min(high, Math.max(low, next)))
  }
  return (
    <InputGroup
      size={size}
      inputMode="numeric"
      value={String(value)}
      aria-label="Số"
      onChange={(event) => {
        const next = Number(event.target.value)
        if (!Number.isNaN(next)) set(next)
      }}
      prefix={
        <Button type="button" variant="ghost" size="sm" className="size-8 p-0" aria-label="Giảm" onClick={() => set(value - step)}>
          <MinusIcon />
        </Button>
      }
      suffix={
        <Button type="button" variant="ghost" size="sm" className="size-8 p-0" aria-label="Tăng" onClick={() => set(value + step)}>
          <PlusIcon />
        </Button>
      }
    />
  )
}

export { NumberInput }
