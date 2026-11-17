import { useState } from "react"
import { Box } from "@/components/layout/index.ts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import ApplicationDemo from "@/showcase/tweakcn/application/index.tsx"
import CardsDemo from "@/showcase/tweakcn/cards/index.tsx"
import Dashboard from "@/showcase/tweakcn/dashboard/index.tsx"
import { PreviewFrame } from "@/showcase/tweakcn/preview-frame.tsx"

const TABS = ["cards", "dashboard", "application"] as const
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

  return (
    <Box className="min-w-0">
      <Box padding={4} className="shrink-0">
        <Tabs value={tab} onValueChange={choose}>
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
          </TabsList>
        </Tabs>
      </Box>
      <PreviewFrame wide={tab === "dashboard"}>
        {tab === "dashboard" ? <Dashboard /> : tab === "application" ? <ApplicationDemo /> : <CardsDemo />}
      </PreviewFrame>
    </Box>
  )
}
