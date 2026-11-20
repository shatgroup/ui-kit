import type { CSSProperties, ReactNode } from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button.tsx"
import { SidebarProvider } from "@/components/ui/sidebar.tsx"
import catalog from "./catalog.json"
import { CommandMenu, type NavItem } from "./command-menu.tsx"
import { ComponentPreview } from "./component-preview.tsx"
import { HighlightedCode } from "./highlighted-code.tsx"
import { localGroups, localPages, type LocalPage } from "./local-docs.tsx"
import { DocsSidebar } from "./docs-sidebar.tsx"
import { DocsTableOfContents } from "./docs-toc.tsx"
import "./typeset.css"

type Block =
  | { type: "heading"; level: number; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "preview"; name: string; direction?: string; align?: "center" | "start" | "end"; previewClassName?: string; hideCode?: boolean; block?: boolean; caption?: string }

type Page = { name: string; title: string; description: string; blocks: Block[] }

const pages = catalog.pages as Page[]

type Entry = { kind: "doc"; page: Page } | { kind: "local"; page: LocalPage }

function hrefOf(url: string) {
  const component = url.match(/^\/docs\/components\/(?:radix|base|aria)\/([^/#?]+)/)
  if (component) return `/components/${component[1]}`
  if (url.startsWith("/docs/")) return `https://ui.shadcn.com${url}`
  return url
}

function Inline({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g
  let cursor = 0
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > cursor) nodes.push(text.slice(cursor, index))
    const token = match[0]
    if (token.startsWith("`")) nodes.push(<code key={index}>{token.slice(1, -1)}</code>)
    else if (token.startsWith("**")) nodes.push(<strong key={index}>{token.slice(2, -2)}</strong>)
    else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) nodes.push(<a key={index} href={hrefOf(link[2] ?? "")}>{link[1]}</a>)
    }
    cursor = index + token.length
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return <>{nodes}</>
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, index) => {
    if (block.type === "heading") {
      const Tag = block.level <= 2 ? "h2" : block.level === 3 ? "h3" : "h4"
      return <Tag key={index} id={block.id}><Inline text={block.text} /></Tag>
    }
    if (block.type === "paragraph") return <p key={index}><Inline text={block.text} /></p>
    if (block.type === "code") {
      return <HighlightedCode key={index} code={block.code} language={block.lang || "tsx"} />
    }
    if (block.type === "list") {
      const List = block.ordered ? "ol" : "ul"
      return (
        <List key={index}>
          {block.items.map((item) => <li key={item}><Inline text={item} /></li>)}
        </List>
      )
    }
    if (block.type === "table") {
      return (
        <div key={index} className="max-w-full overflow-x-auto">
          <table>
            <thead>
              <tr>{block.header.map((cell) => <th key={cell}><Inline text={cell} /></th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}><Inline text={cell} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    return (
      <ComponentPreview
        key={`${block.name}-${index}`}
        name={block.name}
        align={block.align}
        previewClassName={block.previewClassName}
        hideCode={block.hideCode}
        block={block.block}
        caption={block.caption}
      />
    )
  })
}

function entryName(entry: Entry) {
  return entry.kind === "doc" ? entry.page.title : entry.page.title
}

function entryHref(entry: Entry) {
  return `/components/${entry.page.name}`
}

function ComponentsDocs() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/"
  const slug = pathname.startsWith("/components/") ? pathname.slice("/components/".length) : ""
  const sequence: Entry[] = [
    ...pages.map((page) => ({ kind: "doc" as const, page })),
    ...localPages.map((page) => ({ kind: "local" as const, page })),
  ]
  const index = sequence.findIndex((entry) => entryHref(entry) === pathname)
  const current = index >= 0 ? sequence[index] : undefined
  const previous = index > 0 ? sequence[index - 1] : undefined
  const next = index >= 0 ? sequence[index + 1] : undefined
  const componentItems: NavItem[] = pages.map((page) => ({
    name: page.title,
    href: `/components/${page.name}`,
    group: "Components",
    component: true,
  }))
  const toc = current?.kind === "doc"
    ? current.page.blocks.flatMap((block) => block.type === "heading" && block.level === 2 ? [{ title: block.text.replace(/[`*]/g, ""), url: `#${block.id}`, depth: 2 }] : [])
    : current?.kind === "local"
      ? [{ title: "Cách dùng", url: "#cach-dung", depth: 2 }]
      : []

  return (
    <div className="[--header-height:calc(var(--spacing)*14)] lg:[--header-height:calc(var(--spacing)*16)]">
      <SidebarProvider
        className="min-h-min flex-1 items-start px-0 [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--top-spacing:calc(var(--spacing)*4)]"
        style={{ "--sidebar-width": "calc(var(--spacing) * 72)" } as CSSProperties}
      >
        <DocsSidebar
          pathname={pathname === "/components" ? "/components" : pathname}
          groups={[
            { name: "Components", items: [{ name: "Components", href: "/components", group: "Components", component: false }, ...componentItems] },
            ...localGroups.map((group) => ({
              name: group.name,
              items: group.pages.map((page) => ({
                name: page.title,
                href: `/components/${page.name}`,
                group: group.name,
                component: false,
              })),
            })),
          ]}
        />
        <div data-slot="docs" className="flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="h-(--top-spacing) shrink-0" />
            <div className="mx-auto flex w-full max-w-160 min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-foreground md:px-0 lg:py-8">
              {slug === "" ? <Index items={componentItems} /> : null}
              {slug !== "" && !current ? <p>Không có trang này.</p> : null}
              {current?.kind === "local" ? <LocalArticle page={current.page} previous={previous} next={next} /> : null}
              {current?.kind === "doc" ? (
                <Article
                  title={current.page.title}
                  description={current.page.description}
                  blocks={current.page.blocks}
                  previous={previous}
                  next={next}
                />
              ) : null}
            </div>
          </div>
          <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[90svh] w-(--sidebar-width) flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
            <div className="h-(--top-spacing) shrink-0" />
            {toc.length ? (
              <div className="flex scroll-fade scrollbar-none flex-col gap-8 overflow-y-auto px-8">
                <DocsTableOfContents toc={toc} />
              </div>
            ) : null}
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}

function Index({ items }: { items: NavItem[] }) {
  const list = items.filter((item) => item.href !== "/components")
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight">Components</h1>
        <p className="text-[1.05rem] text-muted-foreground sm:text-base sm:text-balance md:max-w-[80%]">
          Here you can find all the components available in the library. We are working on adding more components.
        </p>
      </div>
      <div className="typeset">
        <h2>All Components</h2>
        <div data-not-typeset className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
          {list.map((item) => (
            <a key={item.href} href={item.href} className="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base">
              {item.name}
            </a>
          ))}
        </div>
        <p>
          Can't find what you need? Try the <a href="https://ui.shadcn.com/docs/directory">registry directory</a> for community-maintained components.
        </p>
      </div>
    </>
  )
}

function Article({
  title,
  description,
  blocks,
  previous,
  next,
}: {
  title: string
  description: string
  blocks: Block[]
  previous?: Entry
  next?: Entry
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between md:items-start">
          <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight">{title}</h1>
          <Neighbours previous={previous} next={next} compact />
        </div>
        {description ? <p className="text-[1.05rem] text-muted-foreground sm:text-base sm:text-balance md:max-w-[80%]">{description}</p> : null}
      </div>
      <div className="typeset w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0">
        <Blocks blocks={blocks} />
      </div>
      <div className="hidden h-16 w-full items-center gap-2 sm:flex">
        <Neighbours previous={previous} next={next} />
      </div>
    </>
  )
}

function LocalArticle({
  page,
  previous,
  next,
}: {
  page: LocalPage
  previous?: Entry
  next?: Entry
}) {
  const Preview = page.Preview
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between md:items-start">
          <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight">{page.title}</h1>
          <Neighbours previous={previous} next={next} compact />
        </div>
        {page.description ? <p className="text-[1.05rem] text-muted-foreground sm:text-base sm:text-balance md:max-w-[80%]">{page.description}</p> : null}
      </div>
      <div className="typeset w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0">
        <div data-slot="component-preview" data-not-typeset className="group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-2xl border">
          <div data-align="center" className={page.tall ? "preview relative flex min-h-96 w-full items-start justify-center p-10" : "preview relative flex h-72 w-full items-center justify-center p-10"}>
            <div className={page.wide ? "w-full" : "w-full max-w-md"}><Preview /></div>
          </div>
        </div>
        <HighlightedCode code={page.code} language="tsx" />
        <h2 id="cach-dung">Cách dùng</h2>
        <p>{page.usage}</p>
      </div>
      <div className="hidden h-16 w-full items-center gap-2 sm:flex">
        <Neighbours previous={previous} next={next} />
      </div>
    </>
  )
}

function Neighbours({
  previous,
  next,
  compact = false,
}: {
  previous?: Entry
  next?: Entry
  compact?: boolean
}) {
  if (compact) {
    return (
      <div className="ml-auto flex gap-2">
        {previous ? (
          <Button variant="secondary" size="icon" className="size-8 shadow-none md:size-7" asChild>
            <a href={entryHref(previous)}>
              <IconArrowLeft />
              <span className="sr-only">Previous</span>
            </a>
          </Button>
        ) : null}
        {next ? (
          <Button variant="secondary" size="icon" className="size-8 shadow-none md:size-7" asChild>
            <a href={entryHref(next)}>
              <span className="sr-only">Next</span>
              <IconArrowRight />
            </a>
          </Button>
        ) : null}
      </div>
    )
  }
  return (
    <>
      {previous ? (
        <Button variant="secondary" size="sm" className="shadow-none" asChild>
          <a href={entryHref(previous)}><IconArrowLeft /> {entryName(previous)}</a>
        </Button>
      ) : null}
      {next ? (
        <Button variant="secondary" size="sm" className="ml-auto shadow-none" asChild>
          <a href={entryHref(next)}>{entryName(next)} <IconArrowRight /></a>
        </Button>
      ) : null}
    </>
  )
}

function DocsCommandMenu() {
  const componentItems: NavItem[] = pages.map((page) => ({
    name: page.title,
    href: `/components/${page.name}`,
    group: "Components",
    component: true,
  }))
  const localItems: NavItem[] = localPages.map((page) => ({
    name: page.title,
    href: `/components/${page.name}`,
    group: page.group,
    component: false,
  }))
  return <CommandMenu items={[...componentItems, ...localItems]} />
}

export { ComponentsDocs, DocsCommandMenu }
