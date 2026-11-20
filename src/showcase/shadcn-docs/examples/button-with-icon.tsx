import { GitBranchIcon } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"

export default function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <GitBranchIcon /> New Branch
    </Button>
  )
}
