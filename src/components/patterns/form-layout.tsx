import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Box, Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"

export type FormSection = {
  title: string
  description?: string
  children: ReactNode
}

const FormSurfaceContext = createContext(false)

export function FormSurface({ children }: { children: ReactNode }) {
  return <FormSurfaceContext.Provider value={true}>{children}</FormSurfaceContext.Provider>
}

type FormLayoutProps = {
  sections: FormSection[]
  columns?: 1 | 2
  saving?: boolean
  onSubmit: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
}

export function FormLayout({
  sections,
  columns = 1,
  saving = false,
  onSubmit,
  onCancel,
  submitLabel = "Lưu",
  cancelLabel = "Huỷ",
}: FormLayoutProps) {
  function submit(event: FormEvent) {
    event.preventDefault()
    onSubmit()
  }

  const formRef = useRef<HTMLFormElement>(null)
  const [pin, setPin] = useState(false)

  useEffect(() => {
    function update() {
      const node = formRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const tall = node.offsetHeight > window.innerHeight
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight
      setPin(tall && onScreen && rect.bottom > window.innerHeight)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const overlay = useContext(FormSurfaceContext)
  const fieldColumns = overlay ? 1 : columns

  return (
    <form ref={formRef} onSubmit={submit}>
      <Stack gap={overlay ? 4 : 6}>
        {sections.map((section) => (
          <Stack key={section.title} gap={4} className={overlay ? undefined : "md:flex-row md:items-start"}>
            {overlay ? (
              <Stack gap={1}>
                <Text as="h2" size="lg" weight="semibold">
                  {section.title}
                </Text>
                {section.description ? <Text size="sm" tone="muted">{section.description}</Text> : null}
              </Stack>
            ) : (
              <Stack gap={1} className="md:w-60 md:shrink-0">
                <Text as="h2" size="lg" weight="semibold">
                  {section.title}
                </Text>
                {section.description ? <Text size="sm" tone="muted">{section.description}</Text> : null}
              </Stack>
            )}
            <Box className="min-w-0 flex-1">
              <Grid columns={fieldColumns === 2 ? { base: 1, md: 2 } : 1} gap={3}>
                {section.children}
              </Grid>
            </Box>
          </Stack>
        ))}
        {overlay ? (
          <Inline gap={2} justify="end">
            {onCancel ? (
              <Button type="button" variant="outline" onClick={onCancel}>
                {cancelLabel}
              </Button>
            ) : null}
            <Button type="submit" loading={saving}>
              {submitLabel}
            </Button>
          </Inline>
        ) : (
          <Box tone="background" border className={pin ? "sticky bottom-0 p-3" : "p-3"}>
            <Inline gap={2} justify="end">
              {onCancel ? (
                <Button type="button" variant="outline" onClick={onCancel}>
                  {cancelLabel}
                </Button>
              ) : null}
              <Button type="submit" loading={saving}>
                {submitLabel}
              </Button>
            </Inline>
          </Box>
        )}
      </Stack>
    </form>
  )
}
