/* Nguồn: github.com/jnsahaj/tweakcn components/examples/cards (Apache-2.0).
   Bố cục, class và số liệu giữ từ bản gốc. Import đổi sang component của kit. */
import { addDays } from "date-fns";
import { enUS } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

const start = new Date(2025, 5, 5);

export function CardsCalendar() {
  return (
    <Card className="hidden p-0 @2xl:flex">
      <CardContent className="p-0">
        <Calendar
          numberOfMonths={1}
          mode="range"
          weekStartsOn={0}
          locale={enUS}
          defaultMonth={start}
          selected={{
            from: start,
            to: addDays(start, 8),
          }}
        />
      </CardContent>
    </Card>
  );
}
