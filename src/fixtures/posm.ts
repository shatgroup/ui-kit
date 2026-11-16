export type PosmStatus = "pending" | "doing" | "done"

export type PosmRequest = {
  id: string
  code: string
  store: string
  type: string
  qty: number
  status: PosmStatus
  date: string
}

const LONG_STORE = "Shondo 22 Nguyễn Ảnh Thủ – Trung Mỹ Tây, Quận 12, TP. Hồ Chí Minh"
export const posmStores = ["Shondo Quận 1", LONG_STORE, "Shondo Thủ Đức"]
export const posmTypes = ["Standee", "Wobbler", "Poster"]
const STATUS_CYCLE: PosmStatus[] = ["pending", "doing", "done"]

export const posmRequests: PosmRequest[] = Array.from({ length: 40 }, (_, index) => ({
  id: String(index + 1),
  code: `POSM-${2400 + index}`,
  store: index % 5 === 0 ? LONG_STORE : posmStores[index % posmStores.length] ?? posmStores[0],
  type: posmTypes[index % posmTypes.length] ?? "Standee",
  qty: (index % 9) + 1,
  status: STATUS_CYCLE[index % STATUS_CYCLE.length] ?? "pending",
  date: `${String((index % 27) + 1).padStart(2, "0")}/11/2026`,
}))
