import * as React from "react"

export function useCopyToClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = React.useCallback((value: string) => {
    if (!navigator.clipboard?.writeText || !value) return
    void navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), timeout)
    })
  }, [timeout])

  return { isCopied, copyToClipboard }
}
