import { Field, FieldLabel } from "@/components/ui/field.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"

export function TextareaDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor="textarea-disabled">Message</FieldLabel>
      <Textarea
        id="textarea-disabled"
        placeholder="Type your message here."
        disabled
      />
    </Field>
  )
}
