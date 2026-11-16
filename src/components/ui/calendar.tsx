import { type ComponentProps, useEffect, useRef } from "react"
import { DayPicker, type DayButton, type Locale } from "react-day-picker"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { cn } from "@/lib/utils.ts"

type CalendarProps = ComponentProps<typeof DayPicker> & {
  locale?: Partial<Locale>
}

function Calendar({ className, weekStartsOn = 1, locale, ...props }: CalendarProps) {
  return (
    <div data-slot="calendar">
      <DayPicker
        weekStartsOn={weekStartsOn}
        locale={locale}
        showOutsideDays
        className={cn("p-2", className)}
        classNames={{
          months: "flex flex-col gap-4",
          month: "flex flex-col gap-2",
          month_caption: "flex h-control-sm items-center justify-center text-sm font-medium",
          nav: "flex items-center justify-between",
          button_previous: "inline-flex",
          button_next: "inline-flex",
          weekdays: "flex",
          weekday: "flex size-8 items-center justify-center text-sm text-muted-foreground",
          week: "flex",
          day: "p-0 text-center",
          outside: "text-muted-foreground",
          today: "font-semibold",
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? <ChevronLeftIcon className="size-4" /> : <ChevronRightIcon className="size-4" />,
          DayButton: CalendarDayButton,
        }}
        {...props}
      />
    </div>
  )
}

function CalendarDayButton({ day, modifiers, className, ...props }: ComponentProps<typeof DayButton>) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])
  return (
    <Button
      ref={ref}
      variant={modifiers.selected ? "primary" : "ghost"}
      size="sm"
      className={cn("w-8 px-0", className)}
      {...props}
    >
      {day.date.getDate()}
    </Button>
  )
}

export { Calendar }
