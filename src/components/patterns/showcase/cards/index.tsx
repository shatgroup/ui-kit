/* Nguồn: github.com/jnsahaj/tweakcn components/examples/cards (Apache-2.0).
   Bố cục, class và số liệu giữ từ bản gốc. Import đổi sang component của kit. */
import { CardsActivityGoal } from "./activity-goal.tsx";
import { CardsCalendar } from "./calendar.tsx";
import { CardsChat } from "./chat.tsx";
import { CardsCookieSettings } from "./cookie-settings.tsx";
import { CardsCreateAccount } from "./create-account.tsx";
import { CardsExerciseMinutes } from "./exercise-minutes.tsx";
import { CardsForms } from "./forms.tsx";
import { CardsPayments } from "./payments.tsx";
import { CardsReportIssue } from "./report-issue.tsx";
import { CardsShare } from "./share.tsx";
import { CardsStats } from "./stats.tsx";
import { CardsTeamMembers } from "./team-members.tsx";
import { DatePickerWithRange } from "./date-picker-with-range.tsx";
import { GithubCard } from "./github-card.tsx";

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
