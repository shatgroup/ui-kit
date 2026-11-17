import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "./button.tsx"
import { InputGroup } from "./input-group.tsx"
import type { ControlSize } from "./control.ts"

function NumberInput({
  size = "default",
  value,
  onValueChange,
  min,
  max,
  step = 1,
  id,
  label = "Số",
  decrementLabel = "Giảm",
  incrementLabel = "Tăng",
}: {
  size?: ControlSize
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  id?: string
  label?: string
  decrementLabel?: string
  incrementLabel?: string
}) {
  function set(next: number) {
    const low = min ?? next
    const high = max ?? next
    onValueChange(Math.min(high, Math.max(low, next)))
  }
  return (
    <InputGroup
      size={size}
      id={id}
      inputMode="numeric"
      value={String(value)}
      aria-label={label}
      onChange={(event) => {
        const next = Number(event.target.value)
        if (!Number.isNaN(next)) set(next)
      }}
      prefix={
        <Button type="button" variant="ghost" size="sm" className="size-8 p-0" aria-label={decrementLabel} onClick={() => set(value - step)}>
          <MinusIcon />
        </Button>
      }
      suffix={
        <Button type="button" variant="ghost" size="sm" className="size-8 p-0" aria-label={incrementLabel} onClick={() => set(value + step)}>
          <PlusIcon />
        </Button>
      }
    />
  )
}

export { NumberInput }
