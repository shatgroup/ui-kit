# Bộ chuẩn

Nguồn: class và prop đang dùng trong `src/`, đối chiếu `node_modules/tailwindcss/theme.css` (Tailwind v4) và chiều cao control của shadcn (`h-8` / `h-9` / `h-10`). Không có giá trị lệch thang cần gộp (không thấy `gap-7` hay mức khoảng cách ngoài danh sách).

## Khoảng cách

Đơn vị Tailwind, bội số 4px. `Space` và check:ui chỉ cho các mức này.

| Mức | px | Lần dùng (gap prop + class gap/p/px/py) |
| --- | --- | --- |
| 0 | 0 | gap prop 3, p-0 10, px-0 10 |
| 1 | 4 | gap prop 21, gap-1 20, p-1 8, px-1 1, py-1 3 |
| 2 | 8 | gap prop 55, gap-2 29, p-2 5, px-2 10 |
| 3 | 12 | gap prop 31, gap-3 3, p-3 10, px-3 8, py-2 9 |
| 4 | 16 | gap prop 24, gap-4 12, p-4 7, px-4 3, padding prop 4 |
| 5 | 20 | có trong thang, chưa thấy class riêng ngoài token |
| 6 | 24 | p-6 1, padding prop 6 |
| 8 | 32 | gap prop 8, py-8 2 |
| 10 | 40 | token `--space-10` |
| 12 | 48 | token `--space-12` |
| 16 | 64 | token `--space-16` |

## Bo góc

| Mức | Công thức | Lần dùng class |
| --- | --- | --- |
| sm | radius − 4px | rounded-sm 3 |
| md | radius − 2px | rounded-md 25 |
| lg | radius | rounded-lg 6 |
| xl | radius + 4px | rounded-xl 2 |
| full | 9999px | rounded-full 14 |
| none | 0 | rounded-none 1 |

## Control

| size | Cao | Class Tailwind | Token |
| --- | --- | --- | --- |
| sm | 32px | h-8 | --control-sm |
| default | 36px | h-9 | --control-default |
| lg | 40px | h-10 | --control-lg |

## Chữ

Cỡ và line-height mặc định Tailwind. Ngoại lệ tiếng Việt: `--text-3xl--line-height: 1.3` vì mặc định 1.2 thấp hơn 1.3. `--text-2xl` giữ 1.333.

Nhỏ (`text-xs`) và chú thích mô tả (`text-sm`) dùng `muted-foreground`. Các cỡ còn lại trong bảng chữ dùng `foreground`. Cột ÁP DỤNG ghi đúng tên màu đang áp lên chữ mẫu.

Chữ mặc định trong component là tiếng Việt. Đổi ngôn ngữ bằng prop, không sửa chữ mặc định. Trang `/design-system` truyền tiếng Anh cho chữ hiện trên trang. Nút chỉ có icon giữ tên tiếng Việt cho trình đọc, trừ khi nơi gọi truyền prop.

| Component | Prop | Mặc định |
| --- | --- | --- |
| Alert | `closeLabel` | Đóng |
| NumberInput | `decrementLabel`, `incrementLabel` | Giảm, Tăng |
| PasswordInput | `showPasswordLabel`, `hidePasswordLabel` | Hiện mật khẩu, Ẩn mật khẩu |
| TagsInput | `placeholder`, `removeLabel` | Thêm tag; Xoá, kèm tên tag |
| DateInput | `placeholder`, `removeLabel` | Chọn ngày; Xoá |
| Dropzone | `title`, `removeLabel`, `invalidTypeLabel`, `tooLargeLabel`, `tooManyLabel` | Thả tư liệu vào đây; Xoá; Sai loại file; Vượt dung lượng tối đa; Vượt số file tối đa |
| DataTable | `emptyTitle`, `emptyDescription`, `retryLabel`, `selectedLabel` | Không có dữ liệu; Đổi bộ lọc hoặc thêm dòng mới.; Thử lại; Đã chọn {số} |
| FilterBar | `searchPlaceholder`, `searchLabel`, `clearLabel`, `resultLabel`, `activeLabel` | Tìm kiếm; Xoá lọc; {số} kết quả; {số} bộ lọc đang bật |
| FormLayout | `submitLabel`, `cancelLabel` | Lưu; Huỷ |
| JobStatus | `statusLabels`, `cancelLabel`, `retryLabel` | Chờ, Đang chạy, Xong, Lỗi, Đã huỷ; Huỷ; Thử lại |
| MediaPreview | `emptyTitle`, `emptyDescription`, `errorLabel`, `retryLabel`, `playLabel`, `pauseLabel` | Chưa có tư liệu; Thả ảnh hoặc video vào để xem trước.; Không tải được tư liệu.; Thử lại; Phát; Tạm dừng |
| AudioPlayer | `label`, `playLabel`, `pauseLabel`, `seekLabel`, `speedLabel` | Trình phát; Phát; Tạm dừng; Thanh tua; Tốc độ phát |
| AppShell | `collapseLabel`, `collapseAriaLabel`, `expandLabel`, `menuLabel` | Thu gọn; Thu gọn sidebar; Mở sidebar; Mở menu |
| PlaceholderNode | `label` | Thêm bước |
| NodeSearch | `placeholder`, `emptyLabel`, `groupLabel` | Tìm node; Không thấy kết quả; Node |
| ZoomSlider | `zoomOutLabel`, `zoomInLabel`, `resetLabel`, `fitLabel` | Thu nhỏ; Phóng to; Đặt 100%; Vừa khung |
| ZoomSelect | `placeholder`, `fitLabel` | Thu phóng; Vừa khung |
| WorkflowNode | `menuLabel`, `items` | Thêm thao tác; Sửa, Nhân bản, Xoá |
| DevTools | `labels` | Sơ đồ node; Nhật ký đổi; Khung nhìn; Chưa có thay đổi |

| Token | Cỡ | Line-height | Lần dùng |
| --- | --- | --- | --- |
| text-xs | 0.75rem | 1.333 | 8 |
| text-sm | 0.875rem | 1.429 | 36 |
| text-base | 1rem | 1.5 | 2 |
| text-lg | 1.125rem | 1.556 | 3 |
| text-xl | 1.25rem | 1.4 | 1 |
| text-2xl | 1.5rem | 1.333 | 2 |
| text-3xl | 1.875rem | 1.3 | 3 |

## Thanh cuộn

`scrollbar-none` ẩn thanh cuộn nhưng vẫn cuộn được: `scrollbar-width: none` và `::-webkit-scrollbar { display: none }`.

`scroll-mt-nav` là 7rem (112px): 56px của SiteBar cộng 56px của thanh nhảy nhanh, để tiêu đề không bị hai thanh sticky che.

## Breakpoint

| Tên | Rộng | Nơi dùng |
| --- | --- | --- |
| sm | 40rem | layout, cards |
| md | 48rem | layout |
| lg | 64rem | layout |
| xl | 80rem | layout |
| @3xl @5xl @7xl | container | tab Cards |

## Khung app

Mọi app dùng cùng khung. Sidebar dựng bằng `Sidebar` của shadcn trong `AppShell`. Lưới card dùng `Grid` không truyền số cột.

| Thành phần | Desktop (≥1024) | Tablet (768–1023) | Mobile (<768) |
| --- | --- | --- | --- |
| Sidebar | 256px (16rem), thu gọn 48px (3rem), chỉ còn icon | ẩn, mở bằng nút menu (Sheet) | ẩn, mở bằng nút menu (Sheet) |
| Header | 56px (h-14) | 56px | 56px |
| Lề nội dung | 24px (px-6) | 24px (px-6) | 16px (px-4) |
| Gutter | 16px (gap-4) | 16px | 16px |
| Số cột | 12 | 8 | 4 |
| Kiểu cột | Stretch | Stretch | Stretch |
| Nội dung tối đa | 1280px (max-w-7xl), canh giữa | full | full |
| Thanh dưới | không | không | 56px, chỉ khi app truyền `bottomNav` |

`Grid` không có `span` thì là lưới khung: `grid-cols-4 md:grid-cols-8 lg:grid-cols-12`, `gap-4` cố định. Ô con chỉ dùng `span`:

| span | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| quarter | 4/4 | 4/8 | 3/12 |
| third | 4/4 | 4/8 | 4/12 |
| half | 4/4 | 8/8 | 6/12 |
| two-thirds | 4/4 | 8/8 | 8/12 |
| full | 4/4 | 8/8 | 12/12 |

Không thêm kiểu chiếm cột ngoài bảng. Cần kiểu mới thì thêm vào `Grid` và bảng này.

Prop `columns` của `Grid` không dùng cho lưới card. Nó chỉ còn cho lưới specimen bên trong một card (ma trận nút, ô màu, icon, ô form). `src/pages` và `src/components/patterns` không ghi class `grid-cols-*`; showcase và `src/components/ui` không bị cấm này. Lưới card không dùng gap khác `gap-4`.

## Chiều cao khung

Chỉ dùng các mức này khi cần một khung cao cố định. `h-14` là header và thanh dưới. `h-40` là khung flow nhỏ, một component. `h-96` là khung xem trước App shell. `h-120` là khung flow lớn: cao hơn MiniMap để node không chui xuống góc minimap.

| Class | px | Việc |
| --- | --- | --- |
| h-14 | 56 | header, thanh dưới |
| h-40 | 160 | khung flow nhỏ |
| h-96 | 384 | khung App shell |
| h-120 | 480 | khung flow lớn |
