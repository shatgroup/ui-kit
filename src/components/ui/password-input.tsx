import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "cn"
import { Button } from "./button.tsx"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group.tsx"
import { CONTROL_SIZE, type ControlSize } from "./control.ts"

function PasswordInput({
  size = "default",
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  size?: ControlSize
  showPasswordLabel?: string
  hidePasswordLabel?: string
}) {
  const [shown, setShown] = useState(false)
  return (
    <InputGroup className={cn(size === "default" ? undefined : CONTROL_SIZE[size], className)}>
      <InputGroupInput {...props} type={shown ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          aria-label={shown ? hidePasswordLabel : showPasswordLabel}
          onClick={() => setShown((value) => !value)}
        >
          {shown ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { PasswordInput }
