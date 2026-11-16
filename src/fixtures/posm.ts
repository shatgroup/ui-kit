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
const STORES = ["Shondo Quận 1", LONG_STORE, "Shondo Thủ Đức"]
const TYPES = ["Standee", "Wobbler", "Poster"]
const STATUS_CYCLE: PosmStatus[] = ["pending", "doing", "done"]

export const posmRequests: PosmRequest[] = Array.from({ length: 40 }, (_, index) => ({
  id: String(index + 1),
  code: `POSM-${2400 + index}`,
  store: index % 5 === 0 ? LONG_STORE : STORES[index % STORES.length] ?? STORES[0],
  type: TYPES[index % TYPES.length] ?? "Standee",
  qty: (index % 9) + 1,
  status: STATUS_CYCLE[index % STATUS_CYCLE.length] ?? "pending",
  date: `${String((index % 27) + 1).padStart(2, "0")}/11/2026`,
}))

export const posmStores = ["Shondo Quận 1", LONG_STORE, "Shondo Thủ Đức"]
export const posmTypes = ["Standee", "Wobbler", "Poster"]
