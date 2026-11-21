import { MinusIcon, PlusIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "./button.tsx"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group.tsx"
import { CONTROL_SIZE, type ControlSize } from "./control.ts"

function NumberInput({
  size = "default",
  value,
  onValueChange,
  min,
  max,
  step = 1,
  id,
  label = "Number",
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
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
    <InputGroup className={cn(size === "default" ? undefined : CONTROL_SIZE[size])}>
      <InputGroupAddon>
        <Button type="button" variant="ghost" size="sm" className="size-8 p-0" aria-label={decrementLabel} onClick={() => set(value - step)}>
          <MinusIcon />
        </Button>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        inputMode="numeric"
        value={String(value)}
        aria-label={label}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (!Number.isNaN(next)) set(next)
        }}
      />
      <InputGroupAddon align="inline-end">
        <Button type="button" variant="ghost" size="sm" className="size-8 p-0" aria-label={incrementLabel} onClick={() => set(value + step)}>
          <PlusIcon />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { NumberInput }
