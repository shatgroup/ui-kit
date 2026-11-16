export const revenueSeries = [
  { revenue: 10400, subscription: 40 },
  { revenue: 14405, subscription: 90 },
  { revenue: 9400, subscription: 200 },
  { revenue: 8200, subscription: 278 },
  { revenue: 7000, subscription: 89 },
  { revenue: 9600, subscription: 239 },
  { revenue: 11244, subscription: 78 },
  { revenue: 26475, subscription: 89 },
]

export const exerciseSeries = [
  { average: 400, today: 240, day: "Monday" },
  { average: 300, today: 139, day: "Tuesday" },
  { average: 200, today: 980, day: "Wednesday" },
  { average: 278, today: 390, day: "Thursday" },
  { average: 189, today: 480, day: "Friday" },
  { average: 239, today: 380, day: "Saturday" },
  { average: 349, today: 430, day: "Sunday" },
]

export const goalSeries = [
  { goal: 400 },
  { goal: 300 },
  { goal: 200 },
  { goal: 300 },
  { goal: 200 },
  { goal: 278 },
  { goal: 189 },
  { goal: 239 },
  { goal: 300 },
  { goal: 200 },
  { goal: 278 },
  { goal: 189 },
  { goal: 349 },
]

export const payments = [
  { id: "m5gr84i9", amount: 316, status: "success" as const, email: "ken99@example.com" },
  { id: "3u1reuv4", amount: 242, status: "success" as const, email: "Abe45@example.com" },
  { id: "derv1ws0", amount: 837, status: "processing" as const, email: "Monserrat44@example.com" },
  { id: "bhqecj4p", amount: 721, status: "failed" as const, email: "carmella@example.com" },
  { id: "k9f2m3n4", amount: 450, status: "pending" as const, email: "jason78@example.com" },
  { id: "p5q6r7s8", amount: 1280, status: "success" as const, email: "sarah23@example.com" },
]

export const sharePeople = [
  { name: "Olivia Martin", email: "m@example.com", avatar: "/samples/avatars/03.svg" },
  { name: "Isabella Nguyen", email: "b@example.com", avatar: "/samples/avatars/04.svg" },
  { name: "Sofia Davis", email: "p@example.com", avatar: "/samples/avatars/05.svg" },
  { name: "Ethan Thompson", email: "e@example.com", avatar: "/samples/avatars/01.svg" },
]

export const teamMembers = [
  { name: "Sofia Davis", email: "m@example.com", avatar: "/samples/avatars/01.svg", role: "Owner" },
  { name: "Jackson Lee", email: "p@example.com", avatar: "/samples/avatars/02.svg", role: "Developer" },
  { name: "Isabella Nguyen", email: "i@example.com", avatar: "/samples/avatars/03.svg", role: "Billing" },
]

export const teamRoles = [
  { name: "Viewer", description: "Can view and comment." },
  { name: "Developer", description: "Can view, comment and edit." },
  { name: "Billing", description: "Can view, comment and manage billing." },
  { name: "Owner", description: "Admin-level access to all resources." },
]

export const chatUsers = [
  { name: "Olivia Martin", email: "m@example.com", avatar: "/samples/avatars/01.svg" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", avatar: "/samples/avatars/03.svg" },
  { name: "Emma Wilson", email: "emma@example.com", avatar: "/samples/avatars/05.svg" },
  { name: "Jackson Lee", email: "lee@example.com", avatar: "/samples/avatars/02.svg" },
  { name: "William Kim", email: "will@email.com", avatar: "/samples/avatars/04.svg" },
] as const

export const chatMessages = [
  { role: "agent" as const, content: "Hi, how can I help you today?" },
  { role: "user" as const, content: "Hey, I'm having trouble with my account." },
  { role: "agent" as const, content: "What seems to be the problem?" },
  { role: "user" as const, content: "I can't log in." },
]

export const plans = [
  { id: "starter", name: "Starter Plan", description: "Perfect for small businesses.", price: "$10" },
  { id: "pro", name: "Pro Plan", description: "More features and storage.", price: "$20" },
] as const
