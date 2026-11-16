/* Nguồn: github.com/jnsahaj/tweakcn components/examples/cards (Apache-2.0).
   Bố cục, class và số liệu giữ từ bản gốc. Import đổi sang component của kit. */
import { Circle, Star } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";

export function GithubCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <CardTitle>tweakcn</CardTitle>
            <CardDescription>
              A visual editor for shadcn/ui components with beautiful themes. Accessible.
              Customizable. Open Source.
            </CardDescription>
          </div>
          <Button
            variant="secondary"
            className="flex shrink-0 items-center gap-2 px-3 shadow-none"
            render={<a href="https://github.com/jnsahaj/tweakcn" />}
          >
            <Star />
            Star
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground flex space-x-4 text-sm">
          <div className="flex items-center gap-1">
            <Circle className="size-3 fill-chart-2 text-chart-2" />
            TypeScript
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-3" />
            20k
          </div>
          <div>Updated April 2023</div>
        </div>
      </CardContent>
    </Card>
  );
}
