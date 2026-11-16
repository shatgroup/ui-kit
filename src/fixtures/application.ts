export const ticker = [
  { symbol: "SDCN", avatar: "SH", price: "$120,748.00", change: "1.25%", up: true },
  { symbol: "ACME", avatar: "AC", price: "$84,231.50", change: "-0.42%", up: false },
  { symbol: "TWKN", avatar: "TW", price: "$45,019.75", change: "2.18%", up: true },
  { symbol: "VEGA", avatar: "VE", price: "$9,874.20", change: "-1.07%", up: false },
]

export const stockMonths = [
  { month: "Jan", price: 46 },
  { month: "Feb", price: 78 },
  { month: "Mar", price: 52 },
  { month: "Apr", price: 28 },
  { month: "May", price: 86 },
  { month: "Jun", price: 74 },
]

export const transactions = {
  completed: [
    { title: "Tax Refund", detail: "2026 Income Tax Refund", amount: "+$542.00", date: "Dec 20" },
    { title: "Freelance Payment", detail: "Payment for Invoice #INV-4421 – Website redesign project", amount: "+$800.00", date: "Dec 14" },
    { title: "Salary Payment", detail: "Monthly salary – Acme Corporation SRL, Payroll November 2025", amount: "+$2500.00", date: "Dec 01" },
  ],
  pending: [],
  cancelled: [],
}

export const activity = [
  { name: "Nathaniel Caldwell", time: "2 mins ago", initials: "NC", photo: "/samples/avatars/02.svg", text: "booked a call tomorrow at 4:00 PM – 5:00 PM", chip: "Team meeting", kind: "meet" },
  { name: "Lucy Aristion", time: "9 mins ago", initials: "LA", photo: "/samples/avatars/03.svg", text: "completed Sprint 12", chip: "", kind: "task" },
  { name: "Lucy Aristion", time: "10 mins ago", initials: "LA", photo: "/samples/avatars/03.svg", text: "uploaded a file to Legal folder", chip: "Report.pdf", kind: "file" },
  { name: "Jackson Lee", time: "24 mins ago", initials: "JL", photo: "/samples/avatars/04.svg", text: "uploaded a file to Design assets", chip: "Homepage_v3.fig", kind: "file" },
  { name: "Emma Wilson", time: "1 hour ago", initials: "EW", photo: "/samples/avatars/05.svg", text: "scheduled a review on Friday at 10:00 AM – 11:00 AM", chip: "Quarterly review", kind: "meet" },
  { name: "William Kim", time: "2 hours ago", initials: "WK", photo: "/samples/avatars/01.svg", text: "completed Onboarding flow", chip: "All tasks completed", kind: "task" },
]

export const appMessages = [
  { from: "them" as const, name: "Alex Rivera", time: "8:56 AM", text: "Hey! Did you get a chance to look at the Q4 campaign deck I sent yesterday?" },
  { from: "me" as const, name: "You", time: "9:01 AM", text: "Give me 30–40 min and I'll go through it properly. Anything you want my eyes on?", reaction: "♥" },
  { from: "them" as const, name: "Alex Rivera", time: "9:22 AM", text: "Mainly the pricing page and the new color palette. Marketing thinks the green is too “crypto looking” lol" },
  { from: "me" as const, name: "You", time: "10:28 AM", text: "Q4_Campaign_Deck_Revised.pdf", file: "4.0 MB" },
  { from: "them" as const, name: "Alex Rivera", time: "10:28 AM", text: "Perfect! I see you updated the color scheme. This looks way better!" },
]
