/* Nguồn: shadcn/ui apps/v4/registry/bases/base/ui/calendar.tsx (MIT).
   Bố cục caption/nav, ô ngày và dải range giữ theo bản gốc. Class phức tạp nằm ở tokens.css. */
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
    <DayPicker
      weekStartsOn={weekStartsOn}
      locale={locale}
      showOutsideDays
      className={cn("w-full", className)}
      classNames={{
        root: "w-full",
        months: "flex w-full flex-col gap-4 md:flex-row",
        month: "calendar-month flex w-full flex-col gap-2",
        month_caption: "calendar-caption",
        caption_label: "text-sm font-medium",
        nav: "calendar-nav",
        button_previous: "calendar-nav-button",
        button_next: "calendar-nav-button",
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full",
        weekday: "calendar-weekday",
        week: "calendar-week flex w-full",
        day: "calendar-day",
        range_start: "is-range-start",
        range_middle: "is-range-middle",
        range_end: "is-range-end",
        today: "is-today",
        outside: "is-outside",
      }}
      components={{
        Root: ({ className: rootClass, rootRef, ...rootProps }) => (
          <div data-slot="calendar" ref={rootRef} className={rootClass} {...rootProps} />
        ),
        Chevron: ({ orientation }) =>
          orientation === "left" ? <ChevronLeftIcon className="size-4" /> : <ChevronRightIcon className="size-4" />,
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({ day, modifiers, className, ...props }: ComponentProps<typeof DayButton>) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])
  const edge = modifiers.range_start || modifiers.range_end || (modifiers.selected && !modifiers.range_middle)
  return (
    <Button
      ref={ref}
      variant={edge ? "primary" : "ghost"}
      size="sm"
      className={cn("calendar-day-button px-0", modifiers.range_middle && "calendar-day-middle", className)}
      {...props}
    >
      {day.date.getDate()}
    </Button>
  )
}

export { Calendar }
