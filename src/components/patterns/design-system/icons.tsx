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
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"

const GROUPS: Array<{ title: string; icons: LucideIcon[] }> = [
  { title: "Navigation", icons: [ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, MoveIcon] },
  { title: "Actions", icons: [PlusIcon, MinusIcon, PencilIcon, Trash2Icon, SaveIcon, CopyIcon, UploadIcon, DownloadIcon, Share2Icon, FilterIcon, ArrowUpDownIcon, SearchIcon] },
  { title: "Files", icons: [FileIcon, FileTextIcon, FolderIcon, FolderOpenIcon, FolderPlusIcon, FilesIcon, ArchiveIcon, PaperclipIcon, ClipboardIcon, BookOpenIcon] },
  { title: "Communication", icons: [MailIcon, MessageCircleIcon, MessageSquareIcon, BellIcon, PhoneIcon, SendIcon, InboxIcon, AtSignIcon, MicIcon] },
  { title: "Users", icons: [UserIcon, UsersIcon, UserPlusIcon, LockIcon, KeyIcon, ShieldIcon, ShieldCheckIcon, EyeIcon, EyeOffIcon, LogInIcon, LogOutIcon] },
  { title: "Status", icons: [CheckIcon, XIcon, CircleCheckIcon, CircleXIcon, CircleAlertIcon, TriangleAlertIcon, InfoIcon, CircleHelpIcon, LoaderIcon, BanIcon] },
  { title: "Media", icons: [ImageIcon, PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon, CameraIcon, MusicIcon, FilmIcon, HeadphonesIcon, ClapperboardIcon] },
  { title: "Commerce", icons: [ShoppingCartIcon, ShoppingBagIcon, TagIcon, CreditCardIcon, PackageIcon, TruckIcon, StoreIcon, ReceiptIcon, WalletIcon, GiftIcon] },
  { title: "Time", icons: [CalendarIcon, CalendarDaysIcon, ClockIcon, TimerIcon, HourglassIcon, AlarmClockIcon, HistoryIcon, CalendarCheckIcon, WatchIcon] },
  { title: "Charts", icons: [ChartColumnIcon, ChartLineIcon, ChartPieIcon, TrendingUpIcon, TrendingDownIcon, ActivityIcon, DatabaseIcon, Table2Icon, SigmaIcon] },
  { title: "Layout", icons: [LayoutDashboardIcon, LayoutGridIcon, ListIcon, PanelLeftIcon, Columns2Icon, Rows3Icon, GalleryHorizontalIcon, AlignLeftIcon, GripVerticalIcon, StretchHorizontalIcon] },
  { title: "Devices", icons: [SettingsIcon, MonitorIcon, SmartphoneIcon, SunIcon, MoonIcon, LaptopIcon, TabletIcon, WifiIcon, BatteryIcon, PowerIcon, PrinterIcon] },
]

const POPULAR = ["Search", "Plus", "X", "Check", "ChevronDown", "ChevronRight", "ChevronLeft", "ChevronUp", "Settings", "User", "Users", "Mail", "Bell", "Trash2", "Pencil", "Copy", "Download", "Upload", "Share2", "Filter", "Eye", "EyeOff", "Lock", "Calendar", "Clock", "Sun", "Moon", "Info", "CircleAlert", "CircleCheck", "CircleX", "Loader", "ArrowLeft", "ArrowRight"]

function iconName(icon: LucideIcon) {
  return icon.displayName?.replace(/Icon$/, "") || "Icon"
}

function kebab(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").toLowerCase()
}

function byPopular(left: LucideIcon, right: LucideIcon) {
  const rank = (icon: LucideIcon) => {
    const index = POPULAR.indexOf(iconName(icon))
    return index === -1 ? POPULAR.length : index
  }
  return rank(left) - rank(right) || iconName(left).localeCompare(iconName(right))
}

function Icons() {
  const [query, setQuery] = useState("")
  const [group, setGroup] = useState("all")
  const total = GROUPS.reduce((sum, item) => sum + item.icons.length, 0)
  const needle = query.trim().toLowerCase()
  const icons = useMemo(() => {
    const source = group === "all" ? GROUPS.flatMap((item) => item.icons) : GROUPS.find((item) => item.title === group)?.icons ?? []
    return [...source].sort(byPopular).filter((icon) => {
      const name = iconName(icon)
      return name.toLowerCase().includes(needle) || kebab(name).includes(needle)
    })
  }, [group, needle])

  function copy(name: string) {
    void navigator.clipboard?.writeText(name).catch(() => undefined)
    toast(`Copied ${name}`)
  }

  return (
    <Stack gap={4}>
      <Text as="h2" id="icons" size="xl" weight="semibold" className="scroll-mt-nav">Icons</Text>
      <Card>
        <CardContent>
          <Stack gap={4}>
            <Grid columns={{ base: 1, md: 3 }} gap={3} className="items-center">
              <Input aria-label="Search icons" placeholder={`Search ${total} icons…`} value={query} onChange={(event) => setQuery(event.target.value)} />
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger aria-label="Icon group"><SelectValue /></SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">All</SelectItem>
                  {GROUPS.map((item) => <SelectItem key={item.title} value={item.title}>{item.title}</SelectItem>)}
                </SelectContent>
              </Select>
              <a href="https://lucide.dev" target="_blank" rel="noreferrer" className="md:justify-self-end">
                <Text size="sm" tone="primary">See all on lucide.dev</Text>
              </a>
            </Grid>
            {icons.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No icons</EmptyTitle>
                  <EmptyDescription>Try another name.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Grid columns={{ base: 4, md: 8, xl: 12 }} gap={2}>
                {icons.map((Icon) => {
                  const name = iconName(Icon)
                  return (
                    <Tooltip key={name}>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="size-14 bg-muted p-0 hover:bg-accent" aria-label={kebab(name)} data-icon-name={name} onClick={() => copy(name)}>
                          <Icon className="size-5 text-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{kebab(name)}</TooltipContent>
                    </Tooltip>
                  )
                })}
              </Grid>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export { Icons }
