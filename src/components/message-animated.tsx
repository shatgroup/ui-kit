import type { ReactNode } from "react"

import { getMessageText } from "@/lib/ai.ts"
import type { MessageAnimationPreset } from "@/lib/message-animations.ts"
import { Bubble, BubbleContent } from "@/components/ui/bubble.tsx"
import { Message, MessageContent } from "@/components/ui/message.tsx"
import { MessageScrollerItem } from "@/components/ui/message-scroller.tsx"

function MessageAnimated({
  message,
  scrollAnchor = false,
  userVariant = "muted",
  assistantVariant = "ghost",
  animationPreset,
}: {
  message: { id: string; role: string; parts?: Array<{ type: string; text?: string }>; text?: string }
  scrollAnchor?: boolean
  userVariant?: "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"
  assistantVariant?: "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"
  animationPreset?: MessageAnimationPreset
  children?: ReactNode
}) {
  const text = message.text ?? getMessageText({ parts: message.parts ?? [] })
  const end = message.role === "user"
  return (
    <MessageScrollerItem scrollAnchor={scrollAnchor} data-animation={animationPreset?.id}>
      <Message align={end ? "end" : "start"}>
        <MessageContent>
          <Bubble align={end ? "end" : "start"} variant={end ? userVariant : assistantVariant}>
            <BubbleContent>{text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
}

export { MessageAnimated }
