import { useState } from "react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AudioPlayer } from "@/components/media/audio-player.tsx"
import { Dropzone } from "@/components/media/dropzone.tsx"
import { JobStatus } from "@/components/media/job-status.tsx"
import { MediaPreview } from "@/components/media/media-preview.tsx"
import { SplitPane } from "@/components/media/split-pane.tsx"
import { Stepper, type StepStatus } from "@/components/media/stepper.tsx"
import { DataTable, type DataColumn } from "@/components/patterns/data-table.tsx"
import { FilterBar, type FilterItem } from "@/components/patterns/filter-bar.tsx"
import { FormLayout } from "@/components/patterns/form-layout.tsx"
import { PageHeader } from "@/components/patterns/page-header.tsx"
import { StatCard } from "@/components/patterns/stat-card.tsx"
import { StatusTimeline } from "@/components/patterns/status-timeline.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { toast } from "sonner"

const LONG = "Yêu cầu in standee khai trương cửa hàng Shondo Nguyễn Ảnh Thủ đã được phê duyệt"

type DemoRow = {
  id: string
  code: string
  store: string
  qty: number
}

const ROWS: DemoRow[] = [
  { id: "1", code: "POSM-01", store: LONG, qty: 12 },
  { id: "2", code: "POSM-02", store: "Shondo Quận 1", qty: 4 },
]

const COLUMNS: DataColumn<DemoRow>[] = [
  { id: "code", header: "Mã", accessor: (row) => row.code, minWidth: 120 },
  { id: "store", header: "Cửa hàng", accessor: (row) => row.store, minWidth: 220, grow: true },
  { id: "qty", header: "Số lượng", accessor: (row) => row.qty, minWidth: 96, numeric: true },
]

export function KitPatterns() {
  const [query, setQuery] = useState("")
  const [store, setStore] = useState("all")
  const [mode, setMode] = useState<StepStatus>("current")
  const filters: FilterItem[] = [
    {
      id: "store",
      label: "Cửa hàng",
      value: store,
      allValue: "all",
      onChange: setStore,
      options: [
        { value: "all", label: "Tất cả" },
        { value: "q12", label: "Shondo Nguyễn Ảnh Thủ, Quận 12" },
      ],
    },
  ]

  return (
    <Stack gap={8}>
      <Stack gap={3}>
        <Text as="h2" size="xl" weight="semibold">
          Pattern
        </Text>
        <PageHeader
          title={LONG}
          description="Mô tả ngắn cho trang danh sách, xuống dòng trên mobile."
          crumbs={[{ label: "POSM", onClick: () => undefined }, { label: "Yêu cầu" }]}
          actions={<Button onClick={() => toast.success("Đã bấm tạo")}>Tạo yêu cầu</Button>}
        />
        <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
          <StatCard label="Đang mở" value="24" delta="+12%" direction="up" description="So với tuần trước" />
          <StatCard label="Giá trị" value="1.250.000.000 ₫" delta="-4%" direction="down" description="Tổng đơn đã duyệt" />
        </Grid>
        <FilterBar query={query} onQueryChange={setQuery} filters={filters} onClear={() => { setQuery(""); setStore("all") }} resultCount={2} />
        <Text size="sm" weight="medium">
          DataTable cuộn ngang
        </Text>
        <DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} stickyFirstColumn selectable />
        <Text size="sm" weight="medium">
          DataTable dạng thẻ dưới 640px
        </Text>
        <DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} mobileMode="cards" />
        <DataTable data={[]} columns={COLUMNS} getRowId={(row) => row.id} />
        <DataTable data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} error="Không tải được danh sách" onRetry={() => toast("Thử lại")} />
        <FormLayout
          columns={2}
          onSubmit={() => toast.success("Đã lưu form")}
          onCancel={() => undefined}
          sections={[
            {
              title: "Thông tin yêu cầu",
              description: LONG,
              children: (
                <>
                  <Input aria-label="Cửa hàng" placeholder="Cửa hàng" />
                  <Input aria-label="Số lượng" placeholder="Số lượng" />
                </>
              ),
            },
          ]}
        />
        <StatusTimeline
          items={[
            { id: "1", title: "Tạo yêu cầu", time: "05/11/2026 09:12", note: "Cửa hàng gửi standee", state: "done" },
            { id: "2", title: "Đang sản xuất", time: "06/11/2026 14:00", note: LONG, state: "current" },
            { id: "3", title: "Bàn giao", time: "Chưa tới", state: "todo" },
          ]}
        />
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Co theo chữ</TabsTrigger>
            <TabsTrigger value="b">Ngắn</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="a">
          <TabsList fullWidth>
            <TabsTrigger value="a">Full</TabsTrigger>
            <TabsTrigger value="b">Width</TabsTrigger>
          </TabsList>
        </Tabs>
      </Stack>

      <Stack gap={3}>
        <Text as="h2" size="xl" weight="semibold">
          Media
        </Text>
        <Stepper
          steps={[
            { id: "script", label: "Kịch bản khai trương rất dài cho video Shondo", status: "done" },
            { id: "voice", label: "Giọng", status: mode },
            { id: "motion", label: "Motion", status: "todo" },
            { id: "pack", label: "Đóng gói", status: "error" },
          ]}
          onSelect={() => setMode("done")}
        />
        <SplitPane
          start={<Text>Danh sách đoạn. Kéo thanh giữa hoặc dùng phím mũi tên khi thanh đang được chọn.</Text>}
          end={<Text>Khung xem trước bên phải, chữ dài không được tràn ra ngoài pane.</Text>}
        />
        <MediaPreview kind="image" src="/samples/still.png" alt="Ảnh mẫu" />
        <MediaPreview kind="video" src="/samples/clip.mp4" />
        <MediaPreview status="empty" />
        <MediaPreview status="error" onRetry={() => toast("Tải lại")} />
        <AudioPlayer src="/samples/tone.mp3" />
        <Dropzone accept={{ "image/png": [".png"], "image/jpeg": [".jpg"] }} maxSize={200 * 1024} maxFiles={3} />
        <Inline gap={2}>
          <JobStatus compact name={LONG} status="running" progress={40} />
        </Inline>
        <JobStatus name="Dựng motion đoạn 3" status="running" progress={62} startedAt={Date.now() - 45000} onCancel={() => toast("Đã huỷ")} />
        <JobStatus name="Dựng motion đoạn 4" status="failed" error="Hết thời gian chờ máy dựng" onRetry={() => toast("Thử lại")} />
        <JobStatus name="Đóng gói" status="done" />
        <JobStatus name="Hàng đợi" status="queued" />
        <JobStatus name="Đã huỷ" status="cancelled" />
      </Stack>
    </Stack>
  )
}
