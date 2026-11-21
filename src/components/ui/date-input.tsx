import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "cn"
import { Button } from "./button.tsx"
import { Calendar } from "./calendar.tsx"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "./popover.tsx"
import { CONTROL_SIZE, type ControlSize } from "./control.ts"

function DateInput({
  value,
  onValueChange,
  size = "default",
  placeholder = "Select a date",
  id,
  removeLabel = "Clear",
}: {
  value?: Date
  onValueChange: (value: Date | undefined) => void
  size?: ControlSize
  placeholder?: string
  id?: string
  removeLabel?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          <InputGroup className={cn(size === "default" ? undefined : CONTROL_SIZE[size])}>
            <InputGroupInput
              id={id}
              readOnly
              value={value ? format(value, "dd/MM/yyyy") : ""}
              placeholder={placeholder}
              aria-label={placeholder}
            />
            <InputGroupAddon align="inline-end">
              <CalendarIcon className="size-4" />
            </InputGroupAddon>
          </InputGroup>
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(next) => {
            onValueChange(next)
            setOpen(false)
          }}
        />
        <Button variant="ghost" size="sm" onClick={() => onValueChange(undefined)}>
          {removeLabel}
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export { DateInput }
