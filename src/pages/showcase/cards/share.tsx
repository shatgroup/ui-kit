/* Nguồn: github.com/jnsahaj/tweakcn components/examples/cards (Apache-2.0).
   Bố cục, class và số liệu giữ từ bản gốc. Import đổi sang component của kit. */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Separator } from "@/components/ui/separator.tsx";

const people = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: "/samples/avatars/03.svg",
  },
  {
    name: "Isabella Nguyen",
    email: "b@example.com",
    avatar: "/samples/avatars/04.svg",
  },
  {
    name: "Sofia Davis",
    email: "p@example.com",
    avatar: "/samples/avatars/05.svg",
  },
  {
    name: "Ethan Thompson",
    email: "e@example.com",
    avatar: "/samples/avatars/01.svg",
  },
];
export function CardsShare() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this document</CardTitle>
        <CardDescription>Anyone with the link can view this document.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input id="link" value="http://example.com/link/to/document" className="h-8" readOnly />
          <Button size="sm" variant="outline" className="shrink-0 shadow-none">
            Copy Link
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium">People with access</div>
          <div className="grid gap-6">
            {people.map((person) => (
              <div key={person.email} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={person.avatar} alt="Image" />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm leading-none font-medium">{person.name}</p>
                    <p className="text-muted-foreground text-sm">{person.email}</p>
                  </div>
                </div>
                <Select defaultValue="edit">
                  <SelectTrigger className="w-28 pr-2" aria-label="Edit">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="edit">Can edit</SelectItem>
                    <SelectItem value="view">Can view</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
