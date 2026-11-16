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

| Token | Cỡ | Line-height | Lần dùng |
| --- | --- | --- | --- |
| text-xs | 0.75rem | 1.333 | 8 |
| text-sm | 0.875rem | 1.429 | 36 |
| text-base | 1rem | 1.5 | 2 |
| text-lg | 1.125rem | 1.556 | 3 |
| text-xl | 1.25rem | 1.4 | 1 |
| text-2xl | 1.5rem | 1.333 | 2 |
| text-3xl | 1.875rem | 1.3 | 3 |

## Breakpoint

| Tên | Rộng | Nơi dùng |
| --- | --- | --- |
| sm | 40rem | layout, cards |
| md | 48rem | layout |
| lg | 64rem | layout |
| xl | 80rem | layout |
| @3xl @5xl @7xl | container | tab Cards |
