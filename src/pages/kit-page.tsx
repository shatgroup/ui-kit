import { useState } from "react"
import { Box, Container, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ThemeToggle } from "@/components/ui/theme-toggle.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { CheckboxField } from "@/components/ui/checkbox.tsx"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { EmptyState } from "@/components/ui/empty-state.tsx"
import { FormField } from "@/components/ui/form-field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { RadioField, RadioGroup } from "@/components/ui/radio-group.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Spinner } from "@/components/ui/spinner.tsx"
import { SwitchField } from "@/components/ui/switch.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { KitPatterns } from "@/pages/kit-patterns.tsx"
import { InboxIcon } from "lucide-react"
import { toast } from "sonner"

const LONG =
  "Yêu cầu in standee khai trương cửa hàng Shondo Nguyễn Ảnh Thủ đã được phê duyệt"

const SIZES = ["sm", "md", "lg"] as const
const BADGES = ["neutral", "primary", "success", "warning", "info", "destructive"] as const
const BUTTONS = ["primary", "secondary", "outline", "ghost", "destructive", "link"] as const

function go(path: string) {
  window.location.assign(path)
}

export function KitPage() {
  const [choice, setChoice] = useState("a")

  return (
    <Container size="xl">
      <Stack gap={8} className="py-8">
        <Inline justify="between" align="center" gap={3}>
          <Stack gap={1}>
            <Text as="h1" size="3xl" weight="semibold">
              Kit
            </Text>
            <Text tone="muted">Catalog component, variant, size và trạng thái.</Text>
          </Stack>
          <Inline gap={2} align="center">
            <Button variant="link" onClick={() => go("/tokens")}>
              Token
            </Button>
            <Button variant="link" onClick={() => go("/preview")}>
              Xem trước
            </Button>
            <ThemeToggle />
          </Inline>
        </Inline>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Căn hàng
          </Text>
          {SIZES.map((size) => (
            <Inline key={size} gap={2} align="center">
              <Input size={size} placeholder={`Input ${size}`} className="w-40" aria-label={`Input ${size}`} />
              <Select defaultValue="mot">
                <SelectTrigger size={size} className="w-40" aria-label={`Select ${size}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mot">Một</SelectItem>
                  <SelectItem value="hai">Hai</SelectItem>
                </SelectContent>
              </Select>
              <Button size={size}>Lưu</Button>
              <Button size={size} variant="outline">
                Huỷ
              </Button>
            </Inline>
          ))}
        </Stack>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Chữ dài
          </Text>
          <Box border radius="md" padding={3} className="w-60 max-w-full">
            <Stack gap={3}>
              <Button className="w-full">{LONG}</Button>
              <Badge variant="primary">{LONG}</Badge>
              <Select defaultValue="long">
                <SelectTrigger className="w-full" aria-label="Chọn nhãn dài">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">{LONG}</SelectItem>
                </SelectContent>
              </Select>
              <Tabs defaultValue="a">
                <TabsList>
                  <TabsTrigger value="a">{LONG}</TabsTrigger>
                  <TabsTrigger value="b">Ngắn</TabsTrigger>
                </TabsList>
              </Tabs>
            </Stack>
          </Box>
        </Stack>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Button
          </Text>
          {BUTTONS.map((variant) => (
            <Stack key={variant} gap={2}>
              {SIZES.map((size) => (
                <Inline key={size} gap={2} align="center">
                  <Button variant={variant} size={size}>
                    {variant} {size}
                  </Button>
                  <Button variant={variant} size={size} disabled>
                    disabled
                  </Button>
                  <Button variant={variant} size={size} loading>
                    loading
                  </Button>
                </Inline>
              ))}
            </Stack>
          ))}
        </Stack>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Input và Textarea
          </Text>
          {SIZES.map((size) => (
            <Inline key={size} gap={2} align="center">
              <Input size={size} placeholder={size} aria-label={`Ô ${size}`} className="w-40" />
              <Input size={size} placeholder="disabled" disabled aria-label={`Ô tắt ${size}`} className="w-40" />
              <Input size={size} placeholder="read-only" readOnly value="Chỉ đọc" aria-label={`Ô chỉ đọc ${size}`} className="w-40" />
              <Input size={size} placeholder="lỗi" aria-invalid aria-label={`Ô lỗi ${size}`} className="w-40" />
            </Inline>
          ))}
          <Textarea placeholder="Ghi chú" aria-label="Ghi chú" />
          <Textarea placeholder="Lỗi" aria-invalid aria-label="Ghi chú lỗi" />
          <Textarea readOnly value="Chỉ đọc" aria-label="Ghi chú chỉ đọc" />
        </Stack>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Select
          </Text>
          {SIZES.map((size) => (
            <Inline key={size} gap={2} align="center">
              <Select defaultValue="a">
                <SelectTrigger size={size} className="w-40" aria-label={`Select ${size}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Đang mở</SelectItem>
                  <SelectItem value="b" disabled>
                    Đã khoá
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select disabled defaultValue="a">
                <SelectTrigger size={size} className="w-40" aria-label={`Select tắt ${size}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Tắt</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="a">
                <SelectTrigger size={size} aria-invalid className="w-40" aria-label={`Select lỗi ${size}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Lỗi</SelectItem>
                </SelectContent>
              </Select>
            </Inline>
          ))}
        </Stack>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Badge
          </Text>
          <Inline gap={2} align="center">
            {BADGES.map((variant) => (
              <Badge key={variant} variant={variant}>
                {variant}
              </Badge>
            ))}
          </Inline>
        </Stack>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Form
          </Text>
          <FormField label="Tên cửa hàng" required hint="Tên in trên biên bản">
            <Input placeholder="Shondo" />
          </FormField>
          <FormField label="Số lượng" error="Nhập số lớn hơn 0">
            <Input type="number" aria-label="Số lượng lỗi" />
          </FormField>
          <CheckboxField label="Đã đối soát" defaultChecked />
          <CheckboxField label="Đang khoá" disabled />
          <RadioGroup value={choice} onValueChange={setChoice} aria-label="Ca làm">
            <RadioField value="a" label="Ca sáng" />
            <RadioField value="b" label="Ca chiều" />
          </RadioGroup>
          <SwitchField label="Gấp" defaultChecked />
          <SwitchField label="Tắt" disabled />
          <Label htmlFor="kit-note">Nhãn đứng riêng</Label>
          <Input id="kit-note" placeholder="Gắn với nhãn phía trên" />
        </Stack>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Card, Table, Empty, Skeleton
          </Text>
          <Card>
            <CardHeader>
              <CardTitle>Ca sáng</CardTitle>
              <CardDescription>3 yêu cầu đang mở</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead numeric>Số lượng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>POSM-001</TableCell>
                    <TableCell numeric>12</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <EmptyState
            icon={<InboxIcon className="size-8 text-muted-foreground" />}
            title="Chưa có yêu cầu"
            description="Tạo yêu cầu mới khi cửa hàng cần POSM."
            action={<Button>Tạo yêu cầu</Button>}
          />
          <Inline gap={2}>
            <Skeleton className="h-control-md w-40" />
            <Spinner />
          </Inline>
          <Separator />
        </Stack>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Tabs
          </Text>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="open">Đang mở</TabsTrigger>
              <TabsTrigger value="done" disabled>
                Đã khoá
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Text>Nội dung tất cả.</Text>
            </TabsContent>
            <TabsContent value="open">
              <Text>Nội dung đang mở.</Text>
            </TabsContent>
          </Tabs>
        </Stack>

        <Stack gap={3}>
          <Text as="h2" size="xl" weight="semibold">
            Overlay
          </Text>
          <Inline gap={2} align="center">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>Mở dialog</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nội dung dài</DialogTitle>
                  <DialogDescription>Header và footer đứng yên, phần giữa cuộn.</DialogDescription>
                </DialogHeader>
                <DialogBody>
                  <Stack gap={3}>
                    {Array.from({ length: 12 }, (_, index) => (
                      <Text key={index}>Dòng {index + 1}. {LONG}</Text>
                    ))}
                  </Stack>
                </DialogBody>
                <DialogFooter>
                  <Button variant="outline">Huỷ</Button>
                  <Button>Lưu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>Mở sheet</SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <SheetBody>
                  <Stack gap={2}>
                    {Array.from({ length: 8 }, (_, index) => (
                      <Text key={index}>Mục {index + 1}. {LONG}</Text>
                    ))}
                  </Stack>
                </SheetBody>
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>Menu</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Xem chi tiết yêu cầu đã duyệt</DropdownMenuItem>
                <DropdownMenuItem>Sửa</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Xoá</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" />}>Chú thích</TooltipTrigger>
              <TooltipContent>In standee trước ngày khai trương</TooltipContent>
            </Tooltip>
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
              <PopoverContent>
                <Text size="sm">Ghi chú nội bộ, không gửi cửa hàng.</Text>
              </PopoverContent>
            </Popover>
            <Button variant="secondary" onClick={() => toast.success("Đã lưu nháp")}>
              Toast
            </Button>
          </Inline>
          <Avatar>
            <AvatarFallback>QT</AvatarFallback>
          </Avatar>
        </Stack>
        <KitPatterns />
      </Stack>
    </Container>
  )
}
