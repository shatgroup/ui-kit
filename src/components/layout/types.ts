export const SPACES = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] as const

export type Space = (typeof SPACES)[number]

export type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type Columns =
  | ColCount
  | {
      base?: ColCount
      sm?: ColCount
      md?: ColCount
      lg?: ColCount
      xl?: ColCount
    }

export type Align = "start" | "center" | "end" | "stretch"

export type Justify = "start" | "center" | "end" | "between"
