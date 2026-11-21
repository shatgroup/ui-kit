import { Button } from "@/components/ui/button.tsx"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group.tsx"

export default function ButtonGroupSeparatorDemo() {
  return (
    <ButtonGroup>
      <Button variant="secondary" size="sm">
        Copy
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="sm">
        Paste
      </Button>
    </ButtonGroup>
  )
}
