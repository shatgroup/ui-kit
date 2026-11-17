import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  ActivityIcon, AlarmClockIcon, AlignLeftIcon, ArchiveIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon,
  ArrowUpDownIcon, ArrowUpIcon, AtSignIcon, BanIcon, BatteryIcon, BellIcon, BookOpenIcon, CalendarCheckIcon,
  CalendarDaysIcon, CalendarIcon, CameraIcon, ChartColumnIcon, ChartLineIcon, ChartPieIcon, CheckIcon,
  ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronsUpDownIcon, CircleAlertIcon,
  CircleCheckIcon, CircleHelpIcon, CircleXIcon, ClapperboardIcon, ClipboardIcon, ClockIcon, Columns2Icon,
  CopyIcon, CreditCardIcon, DatabaseIcon, DownloadIcon, EyeIcon, EyeOffIcon, FileIcon, FileTextIcon, FilesIcon,
  FilmIcon, FilterIcon, FolderIcon, FolderOpenIcon, FolderPlusIcon, GalleryHorizontalIcon, GiftIcon, GripVerticalIcon,
  HeadphonesIcon, HistoryIcon, HourglassIcon, ImageIcon, InboxIcon, InfoIcon, KeyIcon, LaptopIcon, LayoutDashboardIcon,
  LayoutGridIcon, ListIcon, LoaderIcon, LockIcon, LogInIcon, LogOutIcon, MailIcon, MessageCircleIcon, MessageSquareIcon,
  MicIcon, MinusIcon, MonitorIcon, MoonIcon, MoveIcon, MusicIcon, PackageIcon, PanelLeftIcon, PaperclipIcon, PauseIcon,
  PencilIcon, PhoneIcon, PlayIcon, PlusIcon, PowerIcon, PrinterIcon, ReceiptIcon, Rows3Icon, SaveIcon, SearchIcon,
  SendIcon, SettingsIcon, Share2Icon, ShieldCheckIcon, ShieldIcon, ShoppingBagIcon, ShoppingCartIcon, SigmaIcon,
  SmartphoneIcon, StoreIcon, StretchHorizontalIcon, SunIcon, Table2Icon, TabletIcon, TagIcon, TimerIcon, Trash2Icon,
  TrendingDownIcon, TrendingUpIcon, TriangleAlertIcon, TruckIcon, UploadIcon, UserIcon, UserPlusIcon, UsersIcon,
  Volume2Icon, VolumeXIcon, WalletIcon, WatchIcon, WifiIcon, XIcon,
  type LucideIcon,
} from "lucide-react"
import { Grid, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { EmptyState } from "@/components/ui/empty-state.tsx"
import { Input } from "@/components/ui/input.tsx"

const GROUPS: Array<{ title: string; icons: LucideIcon[] }> = [
  { title: "Điều hướng và mũi tên", icons: [ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, MoveIcon] },
  { title: "Thao tác", icons: [PlusIcon, MinusIcon, PencilIcon, Trash2Icon, SaveIcon, CopyIcon, UploadIcon, DownloadIcon, Share2Icon, FilterIcon, ArrowUpDownIcon, SearchIcon] },
  { title: "File và thư mục", icons: [FileIcon, FileTextIcon, FolderIcon, FolderOpenIcon, FolderPlusIcon, FilesIcon, ArchiveIcon, PaperclipIcon, ClipboardIcon, BookOpenIcon] },
  { title: "Giao tiếp", icons: [MailIcon, MessageCircleIcon, MessageSquareIcon, BellIcon, PhoneIcon, SendIcon, InboxIcon, AtSignIcon, MicIcon] },
  { title: "Người dùng và bảo mật", icons: [UserIcon, UsersIcon, UserPlusIcon, LockIcon, KeyIcon, ShieldIcon, ShieldCheckIcon, EyeIcon, EyeOffIcon, LogInIcon, LogOutIcon] },
  { title: "Trạng thái", icons: [CheckIcon, XIcon, CircleCheckIcon, CircleXIcon, CircleAlertIcon, TriangleAlertIcon, InfoIcon, CircleHelpIcon, LoaderIcon, BanIcon] },
  { title: "Media", icons: [ImageIcon, PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon, CameraIcon, MusicIcon, FilmIcon, HeadphonesIcon, ClapperboardIcon] },
  { title: "Thương mại", icons: [ShoppingCartIcon, ShoppingBagIcon, TagIcon, CreditCardIcon, PackageIcon, TruckIcon, StoreIcon, ReceiptIcon, WalletIcon, GiftIcon] },
  { title: "Thời gian và lịch", icons: [CalendarIcon, CalendarDaysIcon, ClockIcon, TimerIcon, HourglassIcon, AlarmClockIcon, HistoryIcon, CalendarCheckIcon, WatchIcon] },
  { title: "Biểu đồ và dữ liệu", icons: [ChartColumnIcon, ChartLineIcon, ChartPieIcon, TrendingUpIcon, TrendingDownIcon, ActivityIcon, DatabaseIcon, Table2Icon, SigmaIcon] },
  { title: "Bố cục", icons: [LayoutDashboardIcon, LayoutGridIcon, ListIcon, PanelLeftIcon, Columns2Icon, Rows3Icon, GalleryHorizontalIcon, AlignLeftIcon, GripVerticalIcon, StretchHorizontalIcon] },
  { title: "Thiết bị và hệ thống", icons: [SettingsIcon, MonitorIcon, SmartphoneIcon, SunIcon, MoonIcon, LaptopIcon, TabletIcon, WifiIcon, BatteryIcon, PowerIcon, PrinterIcon] },
]

function iconName(icon: LucideIcon) {
  return icon.displayName?.replace(/Icon$/, "") || "Icon"
}

function Icons() {
  const [query, setQuery] = useState("")
  const needle = query.trim().toLowerCase()
  const groups = useMemo(() => GROUPS.map((group) => ({
    title: group.title,
    icons: group.icons.filter((icon) => iconName(icon).toLowerCase().includes(needle)),
  })).filter((group) => group.icons.length > 0), [needle])

  function copy(name: string) {
    void navigator.clipboard?.writeText(name).catch(() => undefined)
    toast("Đã copy")
  }

  return (
    <Stack gap={4}>
      <Text as="h2" id="icons" size="xl" weight="semibold" className="scroll-mt-16">Icons</Text>
      <Card>
        <CardContent>
          <Stack gap={4}>
            <Grid columns={{ base: 1, md: 2 }} gap={3} className="items-center">
              <Input aria-label="Tìm icon" placeholder="Tìm icon" value={query} onChange={(event) => setQuery(event.target.value)} />
              <a href="https://lucide.dev" target="_blank" rel="noreferrer" className="md:justify-self-end">
                <Text size="sm" tone="primary">Xem đủ 2.000+ icon tại lucide.dev</Text>
              </a>
            </Grid>
            {groups.length === 0 ? <EmptyState title="Không có icon" description="Thử tên khác." /> : null}
            {groups.map((group) => (
              <Stack key={group.title} gap={2}>
                <Text size="sm" weight="medium">{group.title}</Text>
                <Grid columns={{ base: 4, md: 8, xl: 12 }} gap={3}>
                  {group.icons.map((Icon) => {
                    const name = iconName(Icon)
                    return (
                      <Stack key={name} gap={1} align="center">
                        <Button variant="ghost" size="icon" className="size-14" aria-label={name} data-icon-name={name} onClick={() => copy(name)}>
                          <Icon className="size-5 text-foreground" />
                        </Button>
                        <Text size="xs" tone="muted" className="break-all text-center">{name}</Text>
                      </Stack>
                    )
                  })}
                </Grid>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export { Icons }
