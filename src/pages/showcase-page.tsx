import { useState, type ReactNode } from "react"
import { Box, Inline, Stack } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { ShowcaseApplication } from "@/pages/showcase-application.tsx"
import { ShowcaseCards } from "@/pages/showcase-cards.tsx"
import { ShowcaseDashboard } from "@/pages/showcase-dashboard.tsx"

export function ShowcasePage() {
  const [tab, setTab] = useState("cards")
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    setDark(next)
  }

  const tabs = (
    <Tabs value={tab} onValueChange={(value) => setTab(value)}>
      <TabsList>
        <TabsTrigger value="cards">Cards</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="application">Application</TabsTrigger>
      </TabsList>
    </Tabs>
  )
  const theme = (
    <Button variant="secondary" onClick={toggleTheme}>
      {dark ? "Light" : "Dark"}
    </Button>
  )

  if (tab === "dashboard") return <ShowcaseDashboard leading={tabs} topbar={theme} />

  return (
    <Stack gap={4} className="min-h-dvh py-4">
      <Frame>
        <Inline gap={2} align="center" justify="between">
          {tabs}
          {theme}
        </Inline>
      </Frame>
      <Frame>{tab === "application" ? <ShowcaseApplication /> : <ShowcaseCards />}</Frame>
    </Stack>
  )
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <Box className="flex w-full justify-center px-4">
      <Box className="w-full max-w-7xl">{children}</Box>
    </Box>
  )
}
