# Lệch khỏi shadcn new-york

Bản gốc là file CLI ghi đè ngày chuyển Radix. Chỉ các điểm dưới đây khác bản đó.

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

`button.tsx` — thêm prop `forceState?: "hover" | "pressed" | "focus"`. Chỉ `/design-system` dùng, để xem trạng thái khi không rê chuột. Class gắn thêm trùng màu hover của variant; `pressed` đậm hơn một nấc; `focus` dùng cùng ring với `focus-visible`.

## Calendar

`calendar.tsx` — không đổi hành vi tuần. Mặc định Chủ nhật, đúng react-day-picker. `weekStartsOn` và `locale` chỉ có hiệu lực khi nơi gọi truyền vào props (DayPicker nhận qua `{...props}`). Tiếng Việt và Thứ 2 không bị ép.
