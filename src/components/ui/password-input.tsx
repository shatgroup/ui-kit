import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "./button.tsx"
import { InputGroup } from "./input-group.tsx"
import type { ControlSize } from "./control.ts"

function PasswordInput({
  size = "default",
  showPasswordLabel = "Hiện mật khẩu",
  hidePasswordLabel = "Ẩn mật khẩu",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  size?: ControlSize
  showPasswordLabel?: string
  hidePasswordLabel?: string
}) {
  const [shown, setShown] = useState(false)
  return (
    <InputGroup
      {...props}
      size={size}
      type={shown ? "text" : "password"}
      suffix={
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
      }
    />
  )
}

export { PasswordInput }
