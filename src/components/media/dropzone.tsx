import { useState, type ComponentProps } from "react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Meter } from "./meter.tsx"

type ListedFile = {
  id: string
  name: string
  size: number
  progress: number
  error?: string
}

type DropzoneProps = {
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  title?: string
  removeLabel?: string
  invalidTypeLabel?: string
  tooLargeLabel?: string
  tooManyLabel?: string
}

function HiddenFileInput(props: ComponentProps<"input">) {
  // check-ui-ignore-next-line: react-dropzone bắt buộc thẻ input file ẩn
  return <input {...props} />
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function Dropzone({
  accept,
  maxSize = 2 * 1024 * 1024,
  maxFiles = 4,
  title = "Thả tư liệu vào đây",
  removeLabel = "Xoá",
  invalidTypeLabel = "Sai loại file",
  tooLargeLabel = "Vượt dung lượng tối đa",
  tooManyLabel = "Vượt số file tối đa",
}: DropzoneProps) {
  const errorText: Record<string, string> = {
    "file-invalid-type": invalidTypeLabel,
    "file-too-large": tooLargeLabel,
    "too-many-files": tooManyLabel,
  }
  const [files, setFiles] = useState<ListedFile[]>([])

  function add(accepted: File[], rejected: FileRejection[]) {
    const next: ListedFile[] = [
      ...accepted.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        size: file.size,
        progress: 100,
      })),
      ...rejected.map(({ file, errors }) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-error`,
        name: file.name,
        size: file.size,
        progress: 0,
        error: errors.map((item) => errorText[item.code] ?? item.message).join(", "),
      })),
    ]
    setFiles((current) => [...next, ...current].slice(0, maxFiles + rejected.length))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    maxFiles,
    onDrop: add,
  })

  return (
    <Stack gap={3}>
      <div
        {...getRootProps({
          "aria-label": title,
          className: `flex min-h-24 cursor-pointer items-center justify-center rounded-md border border-dashed p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring ${isDragActive ? "bg-accent" : "bg-muted"}`,
        })}
      >
        <HiddenFileInput {...getInputProps()} />
        <Text size="sm" weight="medium">
          {title}
        </Text>
      </div>
      <Stack gap={2}>
        {files.map((file) => (
          <Stack key={file.id} gap={1} className="rounded-md border border-border p-2">
            <Inline gap={2} align="center" justify="between">
              <Text size="sm" truncate className="min-w-0 flex-1">
                {file.name}
              </Text>
              <Text as="span" size="xs" tone="muted" className="shrink-0">
                {formatSize(file.size)}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))}
              >
                {removeLabel}
              </Button>
            </Inline>
            <Meter value={file.progress} />
            {file.error ? (
              <Text size="sm" tone="destructive">
                {file.error}
              </Text>
            ) : null}
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
