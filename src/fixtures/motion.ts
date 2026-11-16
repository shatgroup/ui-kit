export const motionClips = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: index === 2 ? "Cảnh khai trương Shondo Nguyễn Ảnh Thủ, máy quay đi ngang quầy" : `Đoạn ${index + 1}`,
  duration: `0:${String(8 + index).padStart(2, "0")}`,
  status: (["queued", "running", "done", "failed", "cancelled"] as const)[index % 5] ?? "queued",
  progress: 20 + index * 5,
}))
