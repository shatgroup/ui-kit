import { IconPlus } from "@tabler/icons-react"

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
        <IconPlus />
      </Button>
    </ButtonGroup>
  )
}
