import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group.tsx"

export default function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button size="icon" variant="secondary">
        <PlusIcon />
      </Button>
    </ButtonGroup>
  )
}
