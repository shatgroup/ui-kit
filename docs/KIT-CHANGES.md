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

Nguồn: bản `npx shadcn@latest add https://ui.reactflow.dev/<tên>` (shadcn 4.23.0), lưu nguyên ở `docs/reference/react-flow-ui-original/` kèm LICENSE MIT của xyflow. `@xyflow/react` 13.0.1. Sắp cây bằng `@dagrejs/dagre` 3.1.3.

`scripts/flow-original.test.ts` so từng file với bản gốc. Dòng khác chỉ được là import, bỏ `shadow-*`, đổi hex hoặc tên màu cứng sang token, hoặc chữ mặc định thành prop. `src/components/flow/` được miễn class tuỳ ý như `src/components/ui/`, vẫn cấm shadow và hex.

`zoom-select.tsx` đổi cách đọc `minZoom`/`maxZoom` sang `useMemo`. Lý do: selector trả mảng mới mỗi lần thì React 19 render lặp. Đây là chỗ sửa logic so với bản gốc React Flow UI.

`node-status-indicator.tsx` đổi tên keyframe `spin` thành `rf-status-spin`. Keyframe gốc trùng `animate-spin` của Tailwind nên vòng xoay của kit bị kéo lên nửa chiều cao.

| File | Dòng khác | Lý do |
| --- | --- | --- |
| base-node.tsx | 1 | Bỏ `in-[.selected]:shadow-lg` |
| node-status-indicator.tsx | 11 | `blue`/`emerald`/`red` và gradient `rgb` sang `info`, `success`, `destructive`. Ba chỗ `rounded-[9px]` sang `calc(var(--radius-md) + 1px)`. Keyframe `spin` đổi tên `rf-status-spin` để không đè `animate-spin` |
| node-appendix.tsx | 0 | Giữ nguyên |
| node-tooltip.tsx | 0 | Giữ nguyên |
| database-schema-node.tsx | 4 | Import `base-node` vào `flow/`. Bỏ import `React` không dùng |
| placeholder-node.tsx | 16 | Import `flow/base-node`. `gray` sang `muted-foreground`. Prop `label` mặc định `Nút` |
| labeled-group-node.tsx | 6 | Import `flow/base-node`. `bg-white bg-opacity-50` sang `bg-card/50`. Bỏ import `React` không dùng |
| base-handle.tsx | 2 | `slate-300`/`slate-100` sang `border`/`muted` |
| labeled-handle.tsx | 4 | Import `flow/base-handle`. Bỏ import `React` không dùng |
| button-handle.tsx | 4 | Import `flow/base-handle`. `bg-gray-300` sang `bg-border` |
| button-edge.tsx | 0 | Giữ nguyên |
| data-edge.tsx | 0 | Giữ nguyên |
| animated-svg-edge.tsx | 4 | `fill`/`stroke` hex sang `var(--primary)`, `var(--muted)`, `var(--foreground)` |
| node-search.tsx | 16 | Bỏ `shadow-md`. Placeholder, câu trống và heading thành prop, mặc định tiếng Việt |
| zoom-slider.tsx | 1 | Bỏ import `React` không dùng |
| zoom-select.tsx | 20 | Placeholder và nhãn Best Fit thành prop, mặc định `Thu phóng` và `Vừa khung`. Bỏ import `React` không dùng. `minZoom`/`maxZoom` đọc riêng rồi tính mức zoom trong `useMemo` |
| devtools.tsx | 61 | Bỏ `shadow-xs`, `shadow-md`, `bg-white` sang `bg-card`. Nhãn công cụ và trạng thái thành prop, mặc định tiếng Việt |

Demo trong card Flow components lấy đúng node, dây và dữ liệu trên reactflow.dev/ui/components. Ô Database Schema là Products, Warehouses, Suppliers và 2 dây. Demo truyền chữ tiếng Anh của trang gốc qua prop. Ô Tooltip đổi `border-gray-300` thành `border-border` vì check:ui. Mỗi canvas có `id` riêng vì một trang có nhiều React Flow.

`flow-canvas.tsx`, `mind-map-node.tsx`, `workflow-node.tsx`, `use-tree-layout.ts` là của kit. Mind map dựng trên `BaseNode` và `BaseHandle` bản gốc. Workflow dựng trên `BaseNode`, `BaseHandle` và `NodeStatusIndicator` bản gốc. Node workflow chỉ đưa `initialWidth` và `initialHeight` cho dagre. Không gán `width`/`height`, vì React Flow ép khung node theo hai số đó và viền trạng thái tràn khỏi thẻ.

Không ghi đè `button`, `slider`, `select`, `table`, `dialog`, `command`, `toggle`, `toggle-group` của kit.

## Trang /components — ví dụ không chép

Style component là `radix-nova`. Màu là token Future Teal trong `theme.css`. Font là Be Vietnam Pro. `shadow-*` của shadcn được giữ trong `src/components/ui`.

Ví dụ docs chỉ khác bản gốc ở đường import, `next/link` thành `<a>`, và `next/image` thành `<img>`. `fill` thành class `absolute inset-0 size-full`. `width` và `height` giữ nguyên. Icon Tabler giữ nguyên.

Bỏ RTL, locale (`calendar-booked-dates`) và `next/font` (`calendar-hijri`, vì `react-day-picker` 10 không có `persian`). Riêng `scroll-area-rtl` vẫn hiện: kit không có `language-selector`, nên ví dụ gắn `dir="rtl"` và nhãn tiếng Ả Rập.

### RTL (53)

`accordion-rtl`, `alert-rtl`, `alert-dialog-rtl`, `aspect-ratio-rtl`, `avatar-rtl`, `badge-rtl`, `breadcrumb-rtl`, `button-rtl`, `button-group-rtl`, `calendar-rtl`, `card-rtl`, `carousel-rtl`, `chart-rtl`, `checkbox-rtl`, `code-block-rtl`, `collapsible-rtl`, `combobox-rtl`, `command-rtl`, `context-menu-rtl`, `dialog-rtl`, `drawer-rtl`, `dropdown-menu-rtl`, `empty-rtl`, `field-rtl`, `hover-card-rtl`, `input-rtl`, `input-group-rtl`, `input-otp-rtl`, `item-rtl`, `kbd-rtl`, `label-rtl`, `menubar-rtl`, `native-select-rtl`, `navigation-menu-rtl`, `pagination-rtl`, `popover-rtl`, `progress-rtl`, `radio-group-rtl`, `resizable-rtl`, `scroll-area-rtl`, `select-rtl`, `separator-rtl`, `sheet-rtl`, `skeleton-rtl`, `slider-rtl`, `spinner-rtl`, `switch-rtl`, `table-rtl`, `tabs-rtl`, `textarea-rtl`, `toggle-rtl`, `toggle-group-rtl`, `tooltip-rtl`

### locale (1)

`calendar-booked-dates`

Không có trong registry Radix của CLI (`new-york-v4` / `radix-nova`): `data-table`, `date-picker`, `typography`, `toast` (Radix dùng Sonner).

`form` giữ vì registry `radix-nova/form.json` không có file, và repo docs không có `form.mdx`. Trang `/components/form` mô tả component `Form` đang cài, với React Hook Form. Chỉ đổi import `new-york-v4` sang `@/components/ui`.

`combobox` cài cùng style `radix-nova`. Trang `/components/combobox` chép từ `combobox.mdx`, bỏ ví dụ RTL. `shadow-*` của component shadcn được giữ.

## Streaming — deepanik/netflix

Nguồn: `github.com/deepanik/netflix`, LICENSE MIT (Copyright 2024 Laxmi Narayan Pandey). Bản gốc giao diện nằm ở `docs/reference/deepanik-netflix-original/` cùng file `LICENSE`. Không chép `Login.tsx`, `services/` hay `api.config.ts`.

| File kit | Chép từ |
|---|---|
| `src/components/streaming/site-header.tsx` | `src/components/Navbar.tsx` |
| `src/components/streaming/hero-banner.tsx` | `src/pages/Home.tsx` (khối hero) |
| `src/components/streaming/movie-row.tsx` | `src/components/MovieRow.tsx` |
| `src/components/streaming/movie-card.tsx` | `src/components/MovieRow.tsx` (card và hover) |
| `src/components/streaming/movie-info.tsx` (`MovieDetail`) | `src/components/MovieModal.tsx` |
| `src/pages/streaming-page.tsx` | `src/pages/Home.tsx` (các hàng) |

`VideoPlayer` và `EpisodeList` không có trong nguồn. Giữ bản kit, thêm nền `tone="card"`, bo `lg`, viền cho cùng khối tối của modal.

Chỗ đổi so với bản gốc:

- Màu `#e50914`, `#141414`, `#181818`, `#e5e5e5`, `green-500`, `gray` → token Future Teal: `background`, `primary`, `card`, `success`, `muted`.
- Font không gắn trong component. Theme kit đã là Be Vietnam Pro.
- Nút thô (Phát, Chi tiết, play/thêm/thích/info, mũi tên cuộn, chuông, menu) → `Button`.
- Nhãn HD và số thông báo → `Badge`.
- Menu hồ sơ tự hiện khi rê → `DropdownMenu`. Menu mobile trượt hết màn hình → `Sheet`.
- `Link` của react-router → `a`. Nguồn không dùng `next/image`; `img` giữ `object-cover` và phủ khung.
- Dữ liệu TMDB → `src/fixtures/movies.ts`. Phần trăm khớp là số ổn định từ tên phim, không gọi API.
- Không chép logo SVG Netflix, ảnh đại diện ngoài, video `/test-video.mp4`, đăng nhập, trang Kids/Account/Sign out.
- Nguồn không có footer và không có ô tìm (chỉ icon). Icon tìm gắn `SearchOverlay`.
- Kích thước lệch thang kit được làm tròn: thanh `h-[68px]` → `h-16`, lề `px-[60px]` → `px-16`, card `140×200` → `w-36 h-52`, `160×240` → `md:w-40 md:h-60`, hero `min-h-[400px]` → `min-h-96`.
- `mb-*` và `-mt-32` bị cấm → `gap` của `Stack`. Hàng phim không kéo đè lên hero.
- `shadow-xl` bỏ. `transition-all` đổi thành `transform` / `opacity` / `colors` với `--duration-*` và `--ease-*`.
- Bỏ kéo-để-cuộn trên hàng phim để nút trong card nhận được click. Vẫn cuộn ngang và có mũi tên.
