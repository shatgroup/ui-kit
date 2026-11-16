/* Nguồn: https://github.com/jnsahaj/tweakcn — components/examples/application/index.tsx
   Apache License 2.0. Xem src/showcase/tweakcn/LICENSE.
   Bản đối chiếu gốc: không sửa giao diện.
*/

import { ActivityFeed } from "@/showcase/tweakcn/application/activity-feed";
import { MessagingPanel } from "@/showcase/tweakcn/application/messaging";
import { StockMarket } from "@/showcase/tweakcn/application/stock-market";
import { TickerStrip } from "@/showcase/tweakcn/application/ticker";
import { Transactions } from "@/showcase/tweakcn/application/transactions";

export default function ApplicationDemo() {
  return (
    <div className="flex flex-col gap-4 **:data-[slot=card]:shadow-none">
      <p className="text-muted-foreground text-xs">
        Application blocks from{" "}
        <a
          href="https://shadcncraft.com?atp=tweakcn&src=application-preview"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground underline underline-offset-4"
        >
          shadcncraft Pro
        </a>
      </p>

      <TickerStrip />

      <div className="grid items-start gap-4 @3xl:grid-cols-2 @6xl:grid-cols-3">
        <div className="flex flex-col gap-4">
          <StockMarket />
          <Transactions />
        </div>
        <ActivityFeed />
        <div className="@3xl:col-span-2 @6xl:col-span-1">
          <MessagingPanel />
        </div>
      </div>
    </div>
  );
}
