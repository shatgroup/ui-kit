import { CalendarIcon, CheckIcon, PaperclipIcon } from "lucide-react"

export const ticker = [
  { symbol: "SDCN", avatar: "SH", price: "$120,748.00", change: "1.25%", up: true },
  { symbol: "ACME", avatar: "AC", price: "$84,231.50", change: "-0.42%", up: false },
  { symbol: "TWKN", avatar: "TW", price: "$45,019.75", change: "2.18%", up: true },
  { symbol: "VEGA", avatar: "VE", price: "$9,874.20", change: "-1.07%", up: false },
]

export const prices = [118, 121, 119, 124, 123, 128, 126, 131, 129, 134, 132, 128].map((price, index) => ({ day: index + 1, price }))

export const transactions = {
  completed: [
    { title: "Stripe payout", detail: "Invoice 1042 settled", amount: "+$2,480.00", date: "Apr 12" },
    { title: "Figma", detail: "Team subscription", amount: "+$144.00", date: "Apr 09" },
    { title: "AWS", detail: "Monthly usage", amount: "+$86.20", date: "Apr 02" },
  ],
  pending: [{ title: "Client retainer", detail: "Waiting for bank", amount: "+$1,200.00", date: "Apr 18" }],
  cancelled: [{ title: "Domain renewal", detail: "Cancelled by owner", amount: "+$18.00", date: "Mar 30" }],
}

export const activity = [
  { name: "Sofia Davis", time: "2:14 PM", photo: "/samples/avatars/01.svg", lead: "assigned you", rest: " to Cover page", chip: "Today", icon: CalendarIcon },
  { name: "Jackson Lee", time: "1:02 PM", photo: "", lead: "marked", rest: " Executive summary as done", chip: "Done", icon: CheckIcon },
  { name: "Isabella Nguyen", time: "11:40 AM", photo: "/samples/avatars/03.svg", lead: "attached", rest: " the brand deck", chip: "brand.pdf", icon: PaperclipIcon },
]

export const appMessages = [
  { from: "them" as const, text: "The deck is ready for review.", time: "2:10 PM" },
  { from: "me" as const, text: "I will look after lunch.", time: "2:12 PM" },
]
