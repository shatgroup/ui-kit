import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { ButtonGroup } from "@/components/ui/button-group.tsx"
import { Input } from "@/components/ui/input.tsx"

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  )
}
