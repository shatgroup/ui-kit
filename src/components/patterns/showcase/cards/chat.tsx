/* Nguồn: github.com/jnsahaj/tweakcn components/examples/cards (Apache-2.0).
   Bố cục, class và số liệu giữ từ bản gốc. Import đổi sang component của kit. */
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { cn } from "@/lib/utils.ts";
import { ArrowUpIcon, CheckIcon, PlusIcon } from "lucide-react";
import { chatMessages, chatUsers as users } from "@/fixtures/cards.ts";

type User = (typeof users)[number];

export function CardsChat() {
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);

  const [messages, setMessages] = React.useState(chatMessages.map((item) => ({ ...item })));
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="border">
              <AvatarImage src="/samples/avatars/01.svg" alt="Image" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-none font-medium">Sofia Davis</p>
              <p className="text-muted-foreground text-xs">m@example.com</p>
            </div>
          </div>
          <TooltipProvider delay={0}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button size="sm" variant="secondary" className="size-8 rounded-full" onClick={() => setOpen(true)}>
                    <PlusIcon />
                    <span className="sr-only">New message</span>
                  </Button>
                }
              />
              <TooltipContent sideOffset={10}>New message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-3/4 flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user" ? "self-end bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (inputLength === 0) return;
              setMessages([
                ...messages,
                {
                  role: "user",
                  content: input,
                },
              ]);
              setInput("");
            }}
            className="relative w-full"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1 pr-10"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2 rounded-full"
              disabled={inputLength === 0}
            >
              <ArrowUpIcon className="size-3.5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-full flex-col gap-0">
          <DialogHeader className="p-4 pt-0 sm:pt-5">
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>
              Invite a user to this thread. This will create a new group message.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col overflow-hidden border-t">
            {users.map((user) => (
              <Button
                key={user.email}
                type="button"
                variant="ghost"
                className="h-auto w-full justify-start gap-2 px-3 py-2 data-active:opacity-50"
                data-active={selectedUsers.includes(user)}
                onClick={() => {
                  if (selectedUsers.includes(user)) {
                    setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user))
                    return
                  }
                  setSelectedUsers([...users].filter((item) => [...selectedUsers, user].includes(item)))
                }}
              >
                <Avatar className="size-8 border">
                  <AvatarImage src={user.avatar} alt="Image" />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-sm leading-none font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                {selectedUsers.includes(user) ? <CheckIcon className="size-4 text-primary" /> : null}
              </Button>
            ))}
          </div>
          <DialogFooter className="items-center justify-between border-t p-4">
            {selectedUsers.length > 0 ? (
              <div className="flex gap-1 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar key={user.email} className="inline-block size-8 border">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select users to add to this thread.</p>
            )}
            <Button onClick={() => setOpen(false)} disabled={selectedUsers.length < 2}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
