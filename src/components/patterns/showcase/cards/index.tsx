/* Nguồn: github.com/jnsahaj/tweakcn components/examples/cards (Apache-2.0).
   Bố cục, class và số liệu giữ từ bản gốc. Import đổi sang component của kit. */
import { CardsActivityGoal } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsCalendar } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsChat } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsCookieSettings } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsCreateAccount } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsExerciseMinutes } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsForms } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsPayments } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsReportIssue } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsShare } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsStats } from "@/components/patterns/showcase/card-blocks.tsx"
import { CardsTeamMembers } from "@/components/patterns/showcase/card-blocks.tsx"
import { DatePickerWithRange } from "@/components/patterns/showcase/card-blocks.tsx"
import { GithubCard } from "@/components/patterns/showcase/card-blocks.tsx"

export function ShowcaseCards() {
  return <CardsDemo />
}

export default function CardsDemo() {
  return (
    <div data-showcase="" className="@container grid gap-4 p-2 md:p-4">
      <div className="grid gap-4 @5xl:col-span-4 @7xl:col-span-6">
        <CardsStats />
        <div className="grid gap-1 @3xl:hidden">
          <CardsCalendar />
          <div className="@2xl:pt-0 @2xl:pl-3 @7xl:pl-4">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 @2xl:col-span-2 @7xl:pt-4">
            <CardsExerciseMinutes />
          </div>
        </div>
        <div className="grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-1 @7xl:grid-cols-2">
          <div className="flex flex-col gap-4">
            <CardsForms />
            <CardsTeamMembers />
            <CardsCookieSettings />
            <div className="hidden flex-col gap-4 @7xl:flex">
              <GithubCard />
              <DatePickerWithRange />
            </div>
          </div>
          <div className="flex flex-col gap-4 pb-4">
            <CardsCreateAccount />
            <CardsChat />
            <GithubCard />
            <DatePickerWithRange />

            <div className="hidden @7xl:block">
              <CardsReportIssue />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 @5xl:col-span-6 @7xl:col-span-5">
        <div className="hidden gap-1 @3xl:grid">
          <CardsCalendar />
          <div className="pt-3 @2xl:pt-0 @2xl:pl-3 @7xl:pl-4">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 @2xl:col-span-2 @7xl:pt-3">
            <CardsExerciseMinutes />
          </div>
        </div>
        <div className="hidden @3xl:block">
          <CardsPayments />
        </div>
        <CardsShare />
        <div className="@7xl:hidden">
          <CardsReportIssue />
        </div>
      </div>
    </div>
  );
}
