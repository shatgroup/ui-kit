/* Nguồn: https://github.com/jnsahaj/tweakcn — components/examples/application/featured-icon.tsx
   Apache License 2.0. Xem src/showcase/tweakcn/LICENSE.
   Bản đối chiếu gốc: không sửa giao diện.
*/

import * as React from "react";

import { cn } from "@/lib/utils";

export function FeaturedIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-muted [&_svg:not([class*='text-'])]:text-primary flex size-12 shrink-0 items-center justify-center rounded-md border [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}
