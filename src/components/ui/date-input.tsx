import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "./button.tsx"
import { Calendar } from "./calendar.tsx"
import { InputGroup } from "./input-group.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "./popover.tsx"
import type { ControlSize } from "./control.ts"

function DateInput({
  value,
  onValueChange,
  size = "default",
  placeholder = "Chọn ngày",
}: {
  value?: Date
  onValueChange: (value: Date | undefined) => void
  size?: ControlSize
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <span>
            <InputGroup
              size={size}
              readOnly
              value={value ? format(value, "dd/MM/yyyy") : ""}
              placeholder={placeholder}
              aria-label={placeholder}
              suffix={<CalendarIcon className="size-4" />}
            />
          </span>
        }
      />
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
          Xoá
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export { DateInput }
