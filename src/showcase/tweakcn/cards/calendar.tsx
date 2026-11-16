/* Nguồn: https://github.com/jnsahaj/tweakcn — components/examples/cards/calendar.tsx
   Apache License 2.0. Xem src/showcase/tweakcn/LICENSE.
   Bản đối chiếu gốc: không sửa giao diện.
*/

import { addDays } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

const start = new Date(2025, 5, 5);

export function CardsCalendar() {
  return (
    <Card className="hidden p-0 @2xl:flex">
      <CardContent className="p-0">
        <Calendar
          numberOfMonths={1}
          mode="range"
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
