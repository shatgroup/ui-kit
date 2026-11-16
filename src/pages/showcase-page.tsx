import { useState, type ReactNode } from "react"
import { Box, Inline, Stack } from "@/components/layout/index.ts"
import { MotionBoard } from "@/components/patterns/motion-board.tsx"
import { PosmBoard } from "@/components/patterns/posm-board.tsx"
import { ShowcaseApplication } from "@/components/patterns/showcase/application.tsx"
import { ShowcaseCards } from "@/components/patterns/showcase/cards/index.tsx"
import { ShowcaseDashboard } from "@/components/patterns/showcase/dashboard/index.tsx"
import { MotionReduceToggle, ThemeToggle } from "@/components/ui/theme-toggle.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"

const TABS = ["cards", "dashboard", "application", "posm", "motion"] as const
type Tab = (typeof TABS)[number]

function initialTab(): Tab {
  const value = new URLSearchParams(window.location.search).get("tab")
  return TABS.includes(value as Tab) ? (value as Tab) : "cards"
}

export function ShowcasePage() {
  const [tab, setTab] = useState<Tab>(initialTab)

  function choose(value: string) {
    const next = TABS.includes(value as Tab) ? (value as Tab) : "cards"
    setTab(next)
    const url = new URL(window.location.href)
    url.pathname = "/showcase"
    url.search = `?tab=${next}`
    window.history.replaceState(null, "", url)
  }

  const tabs = (
    <Tabs value={tab} onValueChange={choose}>
      <TabsList>
        <TabsTrigger value="cards">Cards</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="application">Application</TabsTrigger>
        <TabsTrigger value="posm">POSM</TabsTrigger>
        <TabsTrigger value="motion">Motion</TabsTrigger>
      </TabsList>
    </Tabs>
  )
  const theme = (
    <Inline gap={2} align="center">
      <MotionReduceToggle />
      <ThemeToggle lightLabel="Light" darkLabel="Dark" />
    </Inline>
  )

  if (tab === "dashboard") return <ShowcaseDashboard leading={tabs} topbar={theme} />
  if (tab === "posm") return <PosmBoard leading={tabs} topbar={theme} />
  if (tab === "motion") return <MotionBoard leading={tabs} topbar={theme} />

  return (
    <Stack gap={4}>
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
    <Box padding={4} className="flex w-full justify-center">
      <Box className="w-full max-w-7xl">{children}</Box>
    </Box>
  )
}
