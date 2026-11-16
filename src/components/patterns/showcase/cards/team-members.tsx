/* Nguồn: github.com/jnsahaj/tweakcn components/examples/cards (Apache-2.0).
   Bố cục, class và số liệu giữ từ bản gốc. Import đổi sang component của kit. */
import { ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { teamMembers, teamRoles as roles } from "@/fixtures/cards.ts";

export function CardsTeamMembers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Invite your team members to collaborate.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="border">
                <AvatarImage src={member.avatar} alt="Image" />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="text-sm leading-none font-medium">{member.name}</p>
                <p className="text-muted-foreground text-xs">{member.email}</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="outline" size="sm" className="shadow-none">
                    {member.role} <ChevronDown />
                  </Button>
                }
              />
              <PopoverContent className="p-1" align="end" fit>
                <div className="flex flex-col">
                  {roles.map((role) => (
                    <div key={role.name} className="flex flex-col rounded-md px-2 py-2 hover:bg-accent">
                      <p className="text-sm font-medium">{role.name}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
