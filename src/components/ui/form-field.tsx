import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Label } from "./label.tsx"

type Wired = {
  id: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

type FormFieldProps = {
  label: string
  required?: boolean
  hint?: string
  error?: string
  choice?: boolean
  children: ReactElement<Wired> | ((field: Wired) => ReactNode)
}

function FormField({ label, required = false, hint, error, choice = false, children }: FormFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error || hint || ""
  const field: Wired = {
    id,
    "aria-describedby": message ? messageId : undefined,
    "aria-invalid": error ? true : undefined,
  }
  const control = typeof children === "function" ? children(field) : isValidElement(children) ? cloneElement(children, field) : children
  const labelNode = (
    <Label htmlFor={id}>
      {label}
      {required ? (
        <Text as="span" tone="destructive">
          *
        </Text>
      ) : null}
    </Label>
  )

  return (
    <Stack slot="form-field" gap={1} className="w-full min-w-0">
      {choice ? (
        <Inline gap={2} align="center">
          {control}
          {labelNode}
        </Inline>
      ) : (
        <>
          {labelNode}
          {control}
        </>
      )}
      {message ? (
        <Text id={messageId} as="p" size="sm" tone={error ? "destructive" : "muted"}>
          {message}
        </Text>
      ) : null}
    </Stack>
  )
}

export { FormField }
