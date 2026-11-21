# Changelog

## 1.1.0

- Component chuyển sang style **radix-nova**. Màu vẫn là Future Teal, font vẫn là Be Vietnam Pro.
- Trang `/components` có 64 trang shadcn, gồm form và combobox. Mỗi trang giữ khung xem trước từ docs gốc.
- Sidebar chia nhóm **Components**, **Kit**, **Flow**, **Patterns**.
- Gỡ component kit trùng shadcn. Chỗ đang dùng chuyển sang bản shadcn.
- Thêm `vercel.json`: build `npm run build`, output `dist`, rewrite mọi đường dẫn không có file tĩnh về `/index.html`.
