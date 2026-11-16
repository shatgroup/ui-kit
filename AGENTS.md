# AGENTS.md — LUẬT LÀM VIỆC CHO AI AGENT

**Áp dụng cho: Cursor, Claude Code, và mọi AI agent làm việc trên repo này.**
Đây là văn bản gốc. `CLAUDE.md` và `.cursor/rules/` trỏ về file này.

Khung lấy từ `~/Projects/_mau/khung/AGENTS.md` vì `~/Projects/_mau/AGENTS.md` không có.

---

## 0. Tuyên bố ngắn về dự án

**UI Kit** — Bộ giao diện dùng chung cho mọi dự án. Phase 1 là nền móng: theme, token, khung bố cục và luật chống chữ lệch, control dính nhau, chữ tràn khung.

**Stack đã chốt:** Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui (style mặc định `base-nova`, base color neutral, thư viện Base UI). Phase 1 chưa cài component shadcn (Button, Input…).

**Mô hình truy cập:** thư viện giao diện phía client. Không có backend.

**Hai trang:** `/design-system` (token, chữ, component) và `/showcase` (Cards, Dashboard, Application, POSM, Motion). `/tokens` và `/kit` chuyển tới `/design-system`. `/preview` và `/preview-motion` chuyển tới `/showcase`.

**Lớp code:**
- `src/components/ui/` — component lõi, giữ class gốc shadcn. Chỉ thư mục này được giá trị tuỳ ý.
- `src/components/patterns/` và `src/components/media/` — khối ráp sẵn. Kiểu dáng nằm ở đây, nhãn chữ truyền qua props.
- `src/pages/` — chỉ ráp primitive, component và pattern. Không class trang trí (`bg-*`, `border-*`, `rounded-*`, `shadow-*`, màu chữ, giá trị tuỳ ý). Bố cục dùng `Stack`, `Inline`, `Grid`, `Box`.
- `src/fixtures/` — dữ liệu mẫu.
- Không dùng `shadow-*` (trừ `shadow-none`). Popup dùng viền 1px `--border`. Không sửa biến `--shadow-*` trong `theme.css`.

Trao đổi và giải thích với người dùng bằng **tiếng Việt**.

---

## 1. QUY TRÌNH BẮT BUỘC MỖI PHIÊN

### Trước khi viết dòng code đầu tiên
1. Đọc `TRANG_THAI_DU_AN.md` — đang ở phase nào, việc gần nhất là gì, có gì đang dở.
2. Đọc `LO_TRINH.md` — việc tiếp theo **được phép** làm là việc nào.
3. Đọc `YEU_CAU.md` phần liên quan — đặc tả chính xác của tính năng đó.
4. Đọc `KIEN_TRUC.md` + `QUY_UOC.md` — làm theo cách nào.

### Trong khi làm
5. Chỉ làm **đúng việc được giao**. Thấy chỗ khác cần sửa → ghi vào mục "Việc phát sinh" của `TRANG_THAI_DU_AN.md`, **không tự sửa**.
6. Trước khi tạo file mới: kiểm tra file tương tự đã tồn tại chưa. Ưu tiên sửa file có sẵn.
7. Tính năng mới có màn hình mới hoặc đụng > 3 file → **đề xuất chạy Spec Kit** (xem mục 4) trước khi code. Người dùng đồng ý mới chạy.
8. Cần tra tài liệu thư viện (API, cú pháp, phiên bản mới) → dùng **Context7**, không đoán theo trí nhớ.

### Sau khi làm xong
9. Chạy build + lint của dự án, sửa hết lỗi.
10. **Chạy thử thực tế.** Nếu có **Playwright MCP**: tự mở trang, bấm thử luồng chính, đọc trang dạng chữ (snapshot). Không chụp màn hình để kiểm luồng. Sửa giao diện thì chụp ảnh đối chiếu theo mục Giao diện.
11. Chạy qua checklist cuối `QUY_UOC.md`.
12. **Cập nhật `TRANG_THAI_DU_AN.md`** — bắt buộc, không được bỏ qua.
13. Báo cáo theo mẫu ở mục 6.

---

## 2. ĐIỀU CẤM TUYỆT ĐỐI

| # | Cấm | Vì sao |
|---|---|---|
| C1 | Đổi stack, thay thư viện đã chốt trong `KIEN_TRUC.md` | Phá vỡ toàn bộ nền tảng |
| C2 | Cài thêm dependency mà chưa hỏi người dùng | Phình dự án, rủi ro bảo mật |
| C3 | Nhảy phase — code tính năng của phase sau | Làm dở dang mọi thứ, không nghiệm thu được |
| C4 | Thêm tính năng không có trong `YEU_CAU.md` | Phình phạm vi |
| C5 | Tự ý đổi mô hình dữ liệu / xóa cột đang dùng | Mất dữ liệu |
| C6 | Lệnh xoá/reset database khi DB có dữ liệu thật | Mất dữ liệu |
| C7 | Xóa hoặc viết đè file mà không đọc nội dung hiện tại trước | Mất công sức đã làm |
| C8 | Dùng dữ liệu giả (mock/hard-code) rồi báo là đã xong | Tạo ảo giác hoàn thành |
| C9 | Dùng `any`, `@ts-ignore`, `catch {}` rỗng để làm hết lỗi | Giấu lỗi |
| C10 | Commit `.env`, mật khẩu, hash, khóa bí mật, dump database | Rò rỉ bảo mật |
| C11 | Refactor hàng loạt file không liên quan đến việc đang làm | Không review nổi, dễ vỡ |
| C12 | Cấu hình server / Docker / CI/CD trước phase deploy | Chưa tới lúc, làm phức tạp giai đoạn đầu |
| C13 | Tự trả lời các "Câu hỏi chưa chốt" trong `YEU_CAU.md` bằng giả định | Làm sai hướng ngay từ gốc |
| C14 | Báo "đã hoàn thành" khi chưa chạy thử thực tế | Sai sự thật |
| C15 | Xoá file người dùng tải lên (ảnh, video, tài liệu) khi thay thế | Mất file gốc — muốn dọn thì hỏi |
| C16 | Đưa mật khẩu, token, key vào code, chat hay commit | Chỉ đặt ở biến môi trường của nơi deploy |
| C17 | Ghi đè `theme.css` bằng theme từ nguồn ngoài (tweakcn, shadcn, block) | Màu đã duyệt nằm trong `src/styles/theme.lock.json`. Muốn đổi màu phải sửa file khoá và được người dùng duyệt |

KHÔNG ghi đè `theme.css` bằng theme từ nguồn ngoài (tweakcn, shadcn, block). Muốn đổi màu phải sửa `theme.lock.json` và được tôi duyệt.

---

## 3. KHI NÀO PHẢI DỪNG LẠI VÀ HỎI

Dừng, hỏi người dùng, **không tự quyết** khi:

- Yêu cầu mơ hồ hoặc có từ hai cách hiểu.
- Việc cần làm chạm vào một "Câu hỏi chưa chốt" trong `YEU_CAU.md`.
- Chuẩn bị bước vào phase deploy.
- Cần thêm thư viện mới.
- Cần đổi mô hình dữ liệu đã có dữ liệu thật.
- Việc được giao mâu thuẫn với `YEU_CAU.md` / `LO_TRINH.md`.
- Sửa cùng một lỗi 2 lần không xong → dừng, mô tả đã thử gì, hỏi hướng.
- Việc lớn hơn dự kiến đáng kể (đụng > 10 file) → trình bày kế hoạch trước, làm sau.
- Thiếu component hoặc token của UI kit → dừng và báo, không tự chế.

Câu hỏi phải **cụ thể và có 2–3 phương án**, không hỏi kiểu "anh muốn làm thế nào?".

---

## 4. CÁCH LÀM VIỆC MONG MUỐN

**Chia nhỏ.** Một lần làm một việc hoàn chỉnh, chạy được, rồi mới sang việc kế tiếp.

**Đọc trước, sửa sau.** Luôn đọc file hiện tại trước khi sửa. Không đoán nội dung.

**Sửa tối thiểu.** Chỉ đụng vào phần liên quan tới việc đang làm.

**Trung thực.** Chưa chạy thử thì nói là chưa chạy thử. Không chắc thì nói không chắc.

**Không tự khen.** Báo cáo nêu sự việc, không nêu tính từ.

### Giao diện
- Bố cục chỉ dùng `Box`, `Stack`, `Inline`, `Grid`, `Container` trong `src/components/layout/`.
- Chữ chỉ dùng `Text` hoặc component của kit.
- Không margin. Không giá trị tuỳ ý. Không mã màu trong file `.tsx`. Không inline style.
- Chữ và link màu thương hiệu dùng `text-primary-text`. Không dùng `text-primary` cho chữ.
- Control trong cùng một hàng phải cùng `size`. Form luôn dùng `FormField`. Danh sách trống luôn dùng `EmptyState`.
- Wireframe/thiết kế đã duyệt là nguồn sự thật. Thiếu gì → dừng và hỏi.
- Viền focus chỉ hiện với `:focus-visible`.

---

## 5. BẢN ĐỒ TÀI LIỆU

| File | Trả lời câu hỏi | Khi nào đọc |
|---|---|---|
| `TRANG_THAI_DU_AN.md` | Đang ở đâu? Làm gì tiếp? | **Đầu mỗi phiên** |
| `YEU_CAU.md` | Làm cái gì? Đúng là gì? | Trước khi làm tính năng |
| `LO_TRINH.md` | Được phép làm gì lúc này? | Đầu mỗi phase |
| `KIEN_TRUC.md` | Làm theo cấu trúc nào? | Khi tạo file/model mới |
| `QUY_UOC.md` | Viết code theo kiểu gì? | Luôn luôn |
| `AGENTS.md` | Luật làm việc và luật UI | Luôn luôn |
| `.cursor/rules/ui-kit.mdc` | Luật UI luôn áp dụng | Khi sửa giao diện |

**Thứ tự ưu tiên khi có mâu thuẫn:**
`Chỉ đạo trực tiếp của người dùng` > `YEU_CAU.md` > `KIEN_TRUC.md` > `QUY_UOC.md` > `AGENTS.md` > phán đoán của agent.

Phát hiện mâu thuẫn giữa các file → **báo cho người dùng**, đừng tự chọn bên.

---

## 6. MẪU BÁO CÁO SAU KHI XONG MỘT VIỆC

Báo cáo đầy đủ ghi vào `docs/bao-cao/<tên-đợt>.md` khi thư mục đó đã có.

Cuối câu trả lời trong chat in khối ngắn để copy:

```
BÁO CÁO CHO CLAUDE
- Đợt: <tên> · Commit: <mã đầu> → <mã cuối>
- Xong: <mỗi mục 1 dòng ngắn>
- Chưa xong: <mục + lý do 1 câu> (không có thì "không")
- Số đo: build · check:ui · Playwright
- Cần tôi quyết: <câu hỏi> (không có thì "không")
```

---

## 7. LUẬT UI KIT

1. Bố cục chỉ dùng `Box`, `Stack`, `Inline`, `Grid`, `Container`. Chữ chỉ dùng `Text` hoặc component của kit.
2. Không margin. Không giá trị tuỳ ý. Không mã màu. Không inline style.
3. Chữ và link màu thương hiệu dùng `text-primary-text`, không dùng `text-primary`.
4. Control (input, button, select) trong cùng một hàng phải cùng `size` (`sm` | `default` | `lg`). Chỉ dùng giá trị trong `docs/STANDARD.md`. Cần mức mới thì dừng lại hỏi, không tự thêm.
5. Form luôn dùng `FormField`. Không tự xếp label và input.
6. Danh sách trống luôn dùng `EmptyState`.
7. Thiếu component hoặc token thì dừng và báo, không tự chế.
8. Xong việc phải chạy `npm run check:ui` và `npm run build`. Cả hai pass mới tính là xong.
9. Chuyển động chỉ dùng `opacity`, `transform`, `clip-path`, màu, bóng. Không chuyển động width, height, top, left, margin, padding, trừ sidebar. Không `transition-all`. Thời lượng và easing chỉ lấy token CSS.

Component kit, mỗi cái một việc:

- `Button` — hành động. Cạnh input/select thì cùng `size`.
- `Input` — một dòng chữ hoặc số.
- `Textarea` — nhiều dòng.
- `Label` — nhãn của control, thường nằm trong `FormField`.
- `Select` — chọn một mục trong danh sách.
- `Checkbox` / `CheckboxField` — chọn bật tắt, luôn có label cạnh ô.
- `RadioGroup` / `RadioField` — chọn một trong vài mục, mỗi mục có label.
- `Switch` / `SwitchField` — bật tắt ngay, luôn có label cạnh nút.
- `Badge` — trạng thái ngắn, một dòng. Nhãn phân loại dùng `outline`.
- `StatusBadge` — trạng thái chuẩn, nền nhạt: `pending` warning, `in_progress` info, `done` success, `failed` destructive, `draft` neutral.
- `Alert` — thông báo info, success, warning, error, có nút đóng.
- `InputGroup` — ô chữ có tiền tố hoặc hậu tố.
- `PasswordInput` — mật khẩu, nút ẩn/hiện.
- `DateInput` — ngày, icon lịch mở Calendar.
- `NumberInput` — số, nút giảm và tăng.
- `TagsInput` — danh sách tag, Enter để thêm, nút x để xoá.
- `Card` — khối nội dung có viền.
- `Table` — bảng dữ liệu. Cột số dùng `numeric`. Cột cần xuống dòng dùng `wrap`.
- `Dialog` — hộp thoại giữa màn hình. Nội dung dài để trong `DialogBody`.
- `Sheet` — bảng trượt từ mép màn hình. Nội dung dài để trong `SheetBody`.
- `Tabs` — chuyển nhóm nội dung trên cùng một trang.
- `DropdownMenu` — menu thao tác của một dòng.
- `Tooltip` — chú thích khi đưa chuột vào.
- `Popover` — nội dung phụ khi bấm.
- `Avatar` — ảnh hoặc chữ viết tắt người dùng.
- `Skeleton` — chỗ chờ khi đang tải.
- `Separator` — đường kẻ ngăn vùng.
- `Toaster` — gắn một lần ở gốc app. Gọi `toast` khi cần báo kết quả.
- `FormField` — label, control, ghi chú hoặc lỗi.
- `EmptyState` — danh sách hoặc tab không có dữ liệu.
- `Spinner` — vòng xoay trong nút đang xử lý.

Pattern dựng sẵn:

- `AppShell` — khung app: sidebar, topbar, nội dung. Dưới 768px sidebar mở bằng Sheet.
- `PageHeader` — tiêu đề trang, mô tả, breadcrumb, nút bên phải.
- `FilterBar` — ô tìm, select lọc, xoá lọc, số kết quả. Mọi control size md.
- `FormLayout` — form chia section, nút Lưu/Huỷ dính đáy.
- `StatCard` — số liệu: nhãn, số, Badge xu hướng, dòng chính, dòng phụ.
- `DataTable` — bảng có sắp xếp, phân trang, chọn nhiều dòng. Phân trang ghi số dòng đã chọn, số dòng mỗi trang, số trang và 4 nút.
- `ChartCard` — tiêu đề, mô tả, biểu đồ, dòng cuối.
- `Ticker` — một dòng mã, giá, phần trăm.
- `ActivityTimeline` — mốc hoạt động.
- `ChatPanel` — hội thoại.
- `TransactionList` — danh sách giao dịch.
- `RepoCard` — thẻ kho mã.
- `ShareList` — danh sách chia sẻ.
- `StatusTimeline` — các mốc trạng thái theo thời gian.

Component cho motion-video:

- `Stepper` — các bước của một quy trình.
- `SplitPane` — hai vùng kéo đổi tỉ lệ.
- `MediaPreview` — khung xem ảnh hoặc video.
- `AudioPlayer` — phát audio.
- `Dropzone` — kéo thả file.
- `JobStatus` — trạng thái một tác vụ dựng.

Cách chọn:

- Trang danh sách dùng `AppShell` + `PageHeader` + `FilterBar` + `DataTable`.
- Trang form dùng `FormLayout`.
- Không tự dựng bảng có phân trang hoặc sắp xếp bằng `Table` thô. Dùng `DataTable`.
- Không tự dựng thanh bước, khung kéo, upload, trình phát, trạng thái tác vụ.
