import { Inline, Stack, Text } from "@/components/layout/index.ts"

type Transaction = {
  title: string
  detail: string
  amount: string
  date: string
}

function TransactionList({ items }: { items: Transaction[] }) {
  return (
    <Stack gap={3}>
      {items.map((item) => (
        <Inline key={item.title} gap={3} align="center" justify="between">
          <Stack gap={1}>
            <Text size="sm" weight="medium">{item.title}</Text>
            <Text size="sm" tone="muted">{item.detail}</Text>
          </Stack>
          <Stack gap={1} align="end">
            <Text size="sm" weight="medium" tone="success">{item.amount}</Text>
            <Text size="xs" tone="muted">{item.date}</Text>
          </Stack>
        </Inline>
      ))}
    </Stack>
  )
}

export { TransactionList }
export type { Transaction }
