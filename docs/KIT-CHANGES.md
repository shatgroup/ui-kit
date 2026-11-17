# Lệch khỏi shadcn new-york

Bản gốc là file CLI ghi đè ngày chuyển Radix. Chỉ các điểm dưới đây khác bản đó.

## Base

`theme.css` — khôi phục base gốc của shadcn trong `@layer base`:

```css
* { @apply border-border outline-ring/50; }
```

Bản chuyển Radix thiếu dòng này. Card và dòng Table chỉ ghi `border` / `border-b`, nên viền lấy màu chữ.

## Kích thước

Control `sm` / `default` / `lg` của Button, Input, Select trùng `docs/STANDARD.md`: `h-8` (32), `h-9` (36), `h-10` (40). Không sửa.

Bản gốc còn size `xs`, `icon`, `icon-xs`, `icon-sm`, `icon-lg` trên Button, và size menu sidebar `sm` `h-7`, `lg` `h-12`. Giữ nguyên vì tweakcn dùng `size="icon"`. Không đưa vào STANDARD.

## Không bóng

Bỏ mọi class `shadow-*` trừ `shadow-none`. Popup đã có `border` sẵn (dialog, sheet, drawer, dropdown, popover, hover-card, select, chart tooltip).

| File | Đã bỏ |
|---|---|
| `button.tsx` | `shadow-xs` ở variant outline |
| `calendar.tsx` | `shadow-xs` ở dropdown tháng |
| `card.tsx` | `shadow-sm` |
| `chart.tsx` | `shadow-xl` ở tooltip |
| `checkbox.tsx` | `shadow-xs` |
| `dialog.tsx` | `shadow-lg` |
| `dropdown-menu.tsx` | `shadow-md`, `shadow-lg` |
| `hover-card.tsx` | `shadow-md` |
| `input.tsx` | `shadow-xs` |
| `popover.tsx` | `shadow-md` |
| `radio-group.tsx` | `shadow-xs` |
| `select.tsx` | `shadow-xs` ở trigger, `shadow-md` ở content |
| `sheet.tsx` | `shadow-lg` |
| `sidebar.tsx` | `shadow-sm` ở floating và inset |
| `slider.tsx` | `shadow-sm` |
| `switch.tsx` | `shadow-xs` |
| `tabs.tsx` | `shadow-sm` ở tab đang chọn |
| `textarea.tsx` | `shadow-xs` |
| `toggle.tsx` | `shadow-xs` |
| `toggle-group.tsx` | `shadow-xs` ở outline; giữ `shadow-none` |

`sidebar.tsx` — variant `outline` của menu button gốc dùng `shadow-[0_0_0_1px_…]` làm viền. Đổi thành `border border-sidebar-border` và `hover:border-sidebar-accent`, vì class `shadow-*` bị cấm. Viền chiếm 1px, bóng gốc không chiếm chỗ.

## Button

`button.tsx` — thêm prop `forceState?: "hover" | "pressed" | "focus"`. Chỉ `/design-system` dùng, để xem trạng thái khi không rê chuột. Class gắn thêm trùng màu hover của variant; `pressed` đậm hơn một nấc. `focus` dùng đúng vòng `focus-visible` của từng variant: `destructive` là `ring-destructive/20` và `dark:ring-destructive/40`; variant còn lại là `ring-ring/50` cùng `border-ring`. Cả hai đều `ring-[3px]`.

`input.tsx` — thêm `forceState?: "focus"`. Class gắn thêm trùng `focus-visible` của Input: `border-ring ring-[3px] ring-ring/50`.

`slider.tsx` — thêm `tip?: string`. Khi có tip, nút kéo bọc trong Tooltip và hiện đúng chuỗi đó.

Nút icon giữ tên tiếng Việt và có prop đổi tên, theo `docs/STANDARD.md`: `Alert.closeLabel`, `NumberInput.decrementLabel` / `incrementLabel`, `PasswordInput.showPasswordLabel` / `hidePasswordLabel`, `TagsInput.removeLabel`, `DateInput.removeLabel`.

Chữ hiện trên kit cũng mặc định tiếng Việt và đổi bằng prop: Dropzone, DataTable, FilterBar, FormLayout, JobStatus, MediaPreview, AudioPlayer, AppShell. `/design-system` truyền tiếng Anh cho chữ nó hiện.

## component thêm mới

| File | Việc |
|---|---|
| `progress-circle.tsx` | Vòng tròn `stroke-primary` trên nền `stroke-muted`, chữ ở giữa. |
| `progress-segments.tsx` | Các đoạn ngắn bằng nhau. Đoạn đã xong dùng `bg-primary`, đoạn còn lại `bg-muted`. |
| `steps-bar.tsx` | Thanh bước dạng mũi tên. Bước xong nền `bg-primary` và có dấu check. Bước đang làm nền `bg-accent`. Bước chưa tới nền `bg-muted`. |

## Checkbox

`checkbox.tsx` — khi `checked="indeterminate"` hiện `MinusIcon` thay vì dấu tick. Radix không có icon riêng cho trạng thái này. DataTable và `/design-system` dùng cho ô chọn cả trang.

## Chart

`chart.tsx` — thêm `overflow-visible` cho `svg` của Recharts. Bản gốc để svg `overflow: hidden`, nhãn trục (ví dụ Chrome) bị cắt khoảng 3px ở mép trái.

## Select

`select.tsx` — `SelectContent` mặc định `position="popper"` thay vì `item-aligned`. Bản gốc căn mục đang chọn đè lên ô bấm. Popper đặt danh sách bên cạnh ô, đúng luật popup không che control.

## Calendar

`calendar.tsx` — không đổi hành vi tuần. Mặc định Chủ nhật, đúng react-day-picker. `weekStartsOn` và `locale` chỉ có hiệu lực khi nơi gọi truyền vào props (DayPicker nhận qua `{...props}`). Tiếng Việt và Thứ 2 không bị ép.

## AppShell

`app-shell.tsx` dựng trên `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger`. Bỏ sidebar tự viết `w-60` / `w-12`.

| Prop | Việc |
| --- | --- |
| Giữ nguyên | `logo`, `mark`, `groups`, `activeId`, `onNavigate`, `leading`, `topbar`, `footer`, `sidebarAction`, `account`, `title`, `children`, `collapseAriaLabel`, `expandLabel`, `menuLabel` |
| `collapseLabel` | Vẫn nhận, không còn hiện chữ. Nút là `SidebarTrigger` chỉ icon. Tên đọc màn hình lấy `collapseAriaLabel`, `expandLabel`, `menuLabel` |
| `maxWidth` | Vẫn mặc định bật. Trần đổi từ `max-w-page` (1440px) sang `max-w-7xl` (1280px), canh giữa |
| `inset` | Vẫn nhận. Trước đây là khung bo góc có lề muted. Giờ shell lấp đầy cha (`contained`), sidebar `absolute` trong khung, không `fixed` theo viewport |
| `bottomNav` | Thêm. Thanh cao 56px, chỉ hiện dưới 768px |

Sidebar rộng 16rem, `collapsible="icon"` còn 3rem. Dưới 1024px sidebar ẩn và mở bằng Sheet. Showcase vẫn dùng ngưỡng 768px của sidebar gốc vì không truyền `mobileBreakpoint`.

`sidebar.tsx` — thêm `mobileBreakpoint` (mặc định 768), `contained` (sidebar absolute trong cha), và `label` trên `SidebarTrigger` để đổi chữ đọc màn hình. Không đổi class khi hai prop này để mặc định.

## Flow

Nguồn: [React Flow UI](https://reactflow.dev/ui) (`ui.reactflow.dev`), giấy phép MIT, trên `@xyflow/react` 13.0.1. Sắp cây bằng `@dagrejs/dagre` 3.1.3. Không cài template Pro.

CSS: `@layer theme, base, xyflow, components, utilities` rồi `@import "@xyflow/react/style.css"` sau stylesheet shadcn, đúng hướng dẫn React Flow 13 (layer `xyflow` nằm sau `base`, trước `utilities`). Không nhét file CSS vào `@layer base` như ghi chú Tailwind 4 cũ, vì bản 13 đã bọc style trong layer riêng.

`colorMode` đã bỏ ở bản 13. Canvas theo class `dark` trên `html` và token của kit. `src/styles/flow.css` đè bóng và màu hex mặc định của thư viện.

File trong `src/components/flow/`, không trộn vào `ui/`:

| File | Nguồn | Đã sửa |
| --- | --- | --- |
| base-node.tsx | base-node | Bỏ bóng và ring. Viền `border-border`, nền `bg-card`, bo `rounded-lg`. Node đang chọn đổi viền primary trong `flow.css` |
| node-status-indicator.tsx | node-status-indicator | Bỏ màu Tailwind và gradient hex. Loading dùng `Spinner`. Đúng `success`, sai `destructive` |
| node-appendix.tsx | node-appendix | Bỏ margin. Viền `border-border`, nền `bg-card` |
| node-tooltip.tsx | node-tooltip | Tooltip nền `bg-card` viền `border-border`, không nền primary |
| base-handle.tsx | base-handle | Bỏ slate. Nền `background`, viền `foreground`, cỡ `size-3` |
| labeled-handle.tsx | labeled-handle | Chữ dùng `Text` |
| button-handle.tsx | button-handle | Bỏ `gray` và giá trị tuỳ ý. Nét nối `bg-border` |
| placeholder-node.tsx | placeholder-node | Bỏ xám, bóng, style ẩn. Nhãn mặc định `Thêm bước` |
| labeled-group-node.tsx | labeled-group-node | Bỏ nền trắng và margin. Nền `bg-muted` |
| database-schema-node.tsx | database-schema-node | Dòng full width trong node `overflow-hidden`. Handle theo dòng, tên trái, kiểu dữ liệu phải màu muted |
| button-edge.tsx | button-edge | Nút giữa dây, nền card đặc, bo full. Transform động có ngoại lệ |
| data-edge.tsx | data-edge | Nhãn nền card đặc, bo full, chữ xs. Transform động có ngoại lệ |
| animated-svg-edge.tsx | animated-svg-edge | Bỏ fill hex. Tắt `animateMotion` khi reduced motion |
| node-search.tsx | node-search | Bỏ bóng và min-width tuỳ ý. Chữ mặc định tiếng Việt |
| zoom-slider.tsx | zoom-slider | Bỏ bề rộng tuỳ ý. Thanh co trong khung hẹp. Nút có tên tiếng Việt. Viền, không bóng |
| zoom-select.tsx | zoom-select | Bỏ margin của đường kẻ. Chữ mặc định tiếng Việt |
| devtools.tsx | devtools | Bỏ bóng và nền trắng. `import.meta.env.DEV` thì mới hiện. Nhãn tiếng Việt |
| flow-canvas.tsx | kit | Khung React Flow: chấm, Controls, MiniMap 160×96, fitView. Appendix được tính vào fitBounds. Từ 768px chừa góc phải-dưới cho MiniMap. Cuộn thường cuộn trang. Zoom bằng Ctrl hoặc Cmd + cuộn |
| mind-map-node.tsx | kit | 3 cấp và nét đứt |
| workflow-node.tsx | kit | Header, hàng muted, trạng thái, handle vào/ra, nhánh đúng/sai |
| use-tree-layout.ts | kit | dagre, khoảng cách `--space-8` và `--space-16` |

Không ghi đè `button`, `slider`, `select`, `table`, `dialog`, `toggle`, `command`, `toggle-group` khi cài registry.
