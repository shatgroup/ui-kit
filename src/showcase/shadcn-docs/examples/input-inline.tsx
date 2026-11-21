import { Button } from "@/components/ui/button.tsx"
import { Field } from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
