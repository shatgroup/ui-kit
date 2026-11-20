import * as React from "react"

type Part =
  | { type: "text"; text: string; state?: string }
  | { type: "reasoning"; text: string; state?: string }
  | { type: "source-url"; url: string; title?: string; sourceId?: string }
  | {
      type: "dynamic-tool"
      toolName: string
      toolCallId: string
      state: "input-available" | "input-streaming" | "output-available" | "output-error" | "output-denied"
      input?: unknown
      output?: unknown
      errorText?: string
    }
  | {
      type: `tool-${string}`
      toolName: string
      toolCallId: string
      state: "input-available" | "input-streaming" | "output-available" | "output-error" | "output-denied"
      input?: unknown
      output?: unknown
      errorText?: string
    }

type UIDataTypes = Record<string, unknown>

type DynamicToolUIPart = Extract<Part, { type: "dynamic-tool" }>

type UIMessage<Metadata = unknown, Data = UIDataTypes, Tools = Record<string, { input: unknown; output: { stdout?: string } }>> = {
  id: string
  role: "user" | "assistant"
  metadata?: Metadata
  parts: Array<
    | { type: "text"; text: string; state?: string }
    | { type: "reasoning"; text: string; state?: string }
    | { type: "source-url"; url: string; title?: string; sourceId?: string }
    | (DynamicToolUIPart)
    | {
        [Name in keyof Tools]: {
          type: `tool-${Name & string}`
          toolName: Name & string
          toolCallId: string
          state: "input-available" | "input-streaming" | "output-available" | "output-error" | "output-denied"
          input?: Tools[Name] extends { input: infer Input } ? Input : unknown
          output: Tools[Name] extends { output: infer Output } ? Output : { stdout: string }
          errorText?: string
        }
      }[keyof Tools]
  >
  data?: Data
}

type ToolCall = {
  type: string
  toolName: string
  toolCallId: string
  state: "input-available" | "input-streaming" | "output-available" | "output-error" | "output-denied"
  input?: unknown
  output?: unknown
  errorText?: string
}

type Writer = {
  text: (text: string) => void
  reasoning: (text: string, options?: { delayMs?: number }) => void
  sourceUrl: (source: { url: string; title?: string }) => void
  sleep: (delayMs?: number) => Writer
  tool: (name: string, options?: { input?: unknown; dynamic?: boolean }) => {
    sleep: (delayMs?: number) => { output: (output: unknown) => void; error: (errorText: string) => void }
    output: (output: unknown) => void
    error: (errorText: string) => void
  }
}

function idOf(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function createChat<Message extends UIMessage = UIMessage>() {
  const messages: Message[] = []

  const api = {
    user(text: string, options?: { id?: string }) {
      messages.push({
        id: options?.id ?? idOf("user"),
        role: "user",
        parts: [{ type: "text", text, state: "done" }],
      } as Message)
      return api
    },
    assistant(content: string | ((context: { writer: Writer }) => void)) {
      const parts: UIMessage["parts"] = []
      if (typeof content === "string") {
        parts.push({ type: "text", text: content, state: "done" })
      } else {
        const writer: Writer = {
          text(text) {
            parts.push({ type: "text", text, state: "done" })
          },
          reasoning(text) {
            parts.push({ type: "reasoning", text, state: "done" })
          },
          sourceUrl(source) {
            parts.push({ type: "source-url", url: source.url, title: source.title, sourceId: idOf("source") })
          },
          sleep() {
            return writer
          },
          tool(name, options) {
            const call: ToolCall = {
              type: options?.dynamic ? "dynamic-tool" : `tool-${name}`,
              toolName: name,
              toolCallId: idOf("tool"),
              state: "input-available",
              input: options?.input,
            }
            parts.push(call as UIMessage["parts"][number])
            const chain = {
              sleep() {
                return chain
              },
              output(output: unknown) {
                call.state = "output-available"
                call.output = output
              },
              error(errorText: string) {
                call.state = "output-error"
                call.errorText = errorText
              },
            }
            return chain
          },
        }
        content({ writer })
      }
      messages.push({ id: idOf("assistant"), role: "assistant", parts } as Message)
      return api
    },
    sleep(delayMs?: number) {
      void delayMs
      return api
    },
    get(count?: number) {
      return (count === undefined ? messages : messages.slice(0, count)) as Message[]
    },
    next(current: Message[]) {
      return messages[current.length]
    },
    transport(options?: { delayMs?: number }) {
      void options
      return {}
    },
  }

  return api
}

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }) {
  return message.parts.reduce((text, part) => (part.type === "text" ? text + (part.text ?? "") : text), "")
}

function useChat<Message extends UIMessage>({ messages: initial = [] as Message[] }: { messages?: Message[]; transport?: unknown } = {}) {
  const [messages, setMessages] = React.useState<Message[]>(initial)
  const [status, setStatus] = React.useState<"ready" | "submitted" | "streaming">("ready")

  function sendMessage(message?: Message) {
    if (!message) return
    setStatus("submitted")
    setMessages((current) => [...current, message])
    setStatus("ready")
  }

  return { messages, sendMessage, setMessages, status }
}

export type { DynamicToolUIPart, UIDataTypes, UIMessage }
export { createChat, getMessageText, useChat }
