# UI Kit

Bộ giao diện dùng chung cho dự án nội bộ. Stack: Vite, React, TypeScript, Tailwind CSS, shadcn new-york (Radix). Theme Future Teal nằm trong `src/styles/theme.lock.json`.

## Tạo dự án mới

Trên trang repo này bấm **Use this template**, rồi tạo repo private mới. Clone repo đó về máy.

## Chạy

```bash
npm i
npm run dev
npm test
```

`npm run dev` mở trang kit. `npm test` chạy kiểm tra giao diện.

## File phải chép khi cài kit sang app

Chép đúng tag đang dùng:

- `src/components/ui`
- `src/components/flow`
- `src/components/layout`
- `src/components/patterns`
- `src/components/media`
- `src/styles`
- `src/lib/utils.ts`
- `src/lib/utils.test.ts`
- `src/hooks/use-mobile.ts`
- `src/index.css`
- `scripts/check-ui-rules.mjs`
- `docs/STANDARD.md`
- `components.json`

`src/components/media` gồm Stepper, SplitPane, MediaPreview, AudioPlayer, Dropzone, JobStatus. Luật UI nằm ở mục 7 của `AGENTS.md`.

## Tài liệu

Quy ước kích thước, khung app và control: [docs/STANDARD.md](docs/STANDARD.md).

# ui-kit
Repo for UI Kit Shodo
