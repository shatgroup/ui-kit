import { useState } from "react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"

type ChatMessage = { from: "me" | "them"; text: string; time: string }

function ChatPanel({
  name,
  status,
  photo,
  messages,
}: {
  name: string
  status: string
  photo?: string
  messages: ChatMessage[]
}) {
  const [draft, setDraft] = useState("")
  return (
    <Stack gap={3}>
      <Inline gap={3} align="center">
        <Avatar>
          {photo ? <AvatarImage src={photo} alt="" /> : null}
          <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <Stack gap={1}>
          <Text size="sm" weight="medium">{name}</Text>
          <Text size="xs" tone="success">{status}</Text>
        </Stack>
      </Inline>
      <Stack gap={2}>
        {messages.map((message) => (
          <Text key={message.time + message.text} size="sm" className={message.from === "me" ? "self-end" : undefined}>
            {message.text}
          </Text>
        ))}
      </Stack>
      <Inline gap={2}>
        <Input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Tin nhắn" placeholder="Aa" />
        <Button type="button" onClick={() => setDraft("")}>Gửi</Button>
      </Inline>
    </Stack>
  )
}

export { ChatPanel }
export type { ChatMessage }
