import { useState } from "react"
import { ClapperboardIcon, FilmIcon, MicIcon, PackageIcon, ScrollTextIcon } from "lucide-react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { AudioPlayer } from "@/components/media/audio-player.tsx"
import { Dropzone } from "@/components/media/dropzone.tsx"
import { JobStatus, type JobState } from "@/components/media/job-status.tsx"
import { MediaPreview } from "@/components/media/media-preview.tsx"
import { SplitPane } from "@/components/media/split-pane.tsx"
import { Stepper, type StepItem } from "@/components/media/stepper.tsx"
import { AppShell } from "@/components/patterns/app-shell.tsx"
import { PageHeader } from "@/components/patterns/page-header.tsx"
import { Button } from "@/components/ui/button.tsx"
import { toast } from "sonner"

const LONG = "Cảnh khai trương Shondo Nguyễn Ảnh Thủ, máy quay đi ngang quầy"

const STATUSES: JobState[] = ["queued", "running", "done", "failed", "cancelled"]

const CLIPS = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: index === 2 ? LONG : `Đoạn ${index + 1}`,
  duration: `0:${String(8 + index).padStart(2, "0")}`,
  status: STATUSES[index % STATUSES.length] ?? "queued",
  progress: 20 + index * 5,
}))

export function PreviewMotionPage() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))
  const [menu, setMenu] = useState("project")
  const [step, setStep] = useState(2)
  const [clipId, setClipId] = useState("3")
  const [job, setJob] = useState<JobState>("running")
  const clip = CLIPS.find((item) => item.id === clipId) ?? CLIPS[0]

  const steps: StepItem[] = [
    { id: "script", label: "Kịch bản", status: step > 0 ? "done" : step === 0 ? "current" : "todo" },
    { id: "voice", label: "Giọng đọc cho video khai trương Shondo Nguyễn Ảnh Thủ", status: step > 1 ? "done" : step === 1 ? "current" : "todo" },
    { id: "motion", label: "Motion", status: step > 2 ? "done" : step === 2 ? "current" : "todo" },
    { id: "pack", label: "Đóng gói", status: step > 3 ? "done" : step === 3 ? "current" : "todo" },
  ]

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    setDark(next)
  }

  return (
    <AppShell
      logo={
        <Text as="span" size="lg" weight="bold" tone="primary">
          Motion
        </Text>
      }
      groups={[
        {
          label: "Dự án",
          items: [
            { id: "project", label: "Dự án này", icon: ClapperboardIcon },
            { id: "script", label: "Kịch bản", icon: ScrollTextIcon },
            { id: "voice", label: "Giọng", icon: MicIcon },
            { id: "motion", label: "Motion", icon: FilmIcon },
            { id: "pack", label: "Đóng gói", icon: PackageIcon },
          ],
        },
      ]}
      activeId={menu}
      onNavigate={setMenu}
      topbar={
        <Button variant="secondary" onClick={toggleTheme}>
          {dark ? "Sáng" : "Tối"}
        </Button>
      }
    >
      <Stack gap={4}>
        <PageHeader title="Khai trương Shondo" description="Đang ở bước Motion. Có thể quay lại bước đã xong." />
        <Stepper
          steps={steps}
          onSelect={(id) => {
            const index = steps.findIndex((item) => item.id === id)
            if (index >= 0 && index < step) setStep(index)
          }}
        />
        <SplitPane
          start={
            <Stack gap={2} className="p-2">
              {CLIPS.map((item) => (
                <Stack key={item.id} gap={1} className="rounded-md border border-border p-2">
                  <Button
                    variant={item.id === clipId ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setClipId(item.id)}
                  >
                    {item.name}
                  </Button>
                  <Inline justify="between" align="center">
                    <Text size="xs" tone="muted">
                      {item.duration}
                    </Text>
                  </Inline>
                  <JobStatus compact name={item.name} status={item.status} progress={item.progress} />
                </Stack>
              ))}
            </Stack>
          }
          end={
            <Stack gap={3} className="p-3">
              <Text weight="semibold">{clip?.name}</Text>
              <MediaPreview kind="video" ratio="16/9" src="/samples/clip.mp4" />
              <AudioPlayer src="/samples/tone.mp3" label={`Giọng ${clip?.name}`} />
              <Dropzone title="Thả tư liệu vào đây" accept={{ "image/png": [".png"], "image/jpeg": [".jpg"], "video/mp4": [".mp4"] }} maxSize={5 * 1024 * 1024} maxFiles={4} />
              <JobStatus
                name={clip?.name ?? "Đoạn"}
                status={job}
                progress={64}
                startedAt={Date.now() - 75000}
                error="Máy dựng không phản hồi"
                onCancel={() => setJob("cancelled")}
                onRetry={() => setJob("running")}
              />
              <Inline justify="end">
                <Button
                  onClick={() => {
                    setJob("failed")
                    toast("Đã gửi yêu cầu tạo lại")
                  }}
                >
                  Tạo lại
                </Button>
              </Inline>
            </Stack>
          }
        />
      </Stack>
    </AppShell>
  )
}
