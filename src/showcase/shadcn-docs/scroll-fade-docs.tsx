import type { ReactNode } from "react"

import { HighlightedCode } from "./highlighted-code.tsx"

const items = ["Inbox triage", "Design review", "API contract", "QA pass", "Launch notes", "Metrics follow-up", "Release checklist", "Retro notes"]
const tags = ["Design", "Engineering", "Marketing", "Product", "Research", "Sales", "Support", "Operations", "Finance", "Legal"]

const toc = [
  { title: "Usage", url: "#usage", depth: 2 },
  { title: "Horizontal", url: "#horizontal", depth: 2 },
  { title: "Edges", url: "#edges", depth: 2 },
  { title: "Classes", url: "#classes", depth: 2 },
]

function Row({ children }: { children: string }) {
  return <div className="rounded-lg bg-muted px-3 py-2.5 text-sm">{children}</div>
}

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border">{children}</div>
      <p className="text-center font-mono text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function ScrollFadeDocs() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight">Scroll Fade</h1>
        <p className="text-[1.05rem] text-muted-foreground sm:text-base sm:text-balance md:max-w-[80%]">
          Fade the edges of a scroll area. Classes ship in shadcn/tailwind.css.
        </p>
      </div>
      <div className="typeset w-full flex-1 pb-16 sm:pb-0">
        <div data-not-typeset className="mx-auto mt-4 mb-12 w-full max-w-xs overflow-hidden rounded-2xl border">
          <div className="h-48 scroll-fade scrollbar-none overflow-y-auto">
            <div className="flex flex-col gap-1.5 p-1.5">
              {items.map((item) => <Row key={item}>{item}</Row>)}
            </div>
          </div>
        </div>
        <h2 id="usage">Usage</h2>
        <p>Add <code>scroll-fade</code> or <code>scroll-fade-y</code> to the element that has <code>overflow-y-auto</code>. Nothing fades when the content does not overflow.</p>
        <HighlightedCode code={'<div className="scroll-fade overflow-y-auto">{/* ... */}</div>'} language="tsx" />
        <h2 id="horizontal">Horizontal</h2>
        <p>Horizontal areas use <code>scroll-fade-x</code> together with <code>overflow-x-auto</code>.</p>
        <div data-not-typeset className="mb-12 overflow-hidden rounded-2xl border">
          <div className="scroll-fade-x scrollbar-none overflow-x-auto">
            <div className="flex w-max gap-1.5 p-1.5">
              {tags.map((tag) => <div key={tag} className="shrink-0 rounded-lg bg-muted px-3 py-2.5 text-sm">{tag}</div>)}
            </div>
          </div>
        </div>
        <HighlightedCode code={'<div className="scroll-fade-x overflow-x-auto">{/* ... */}</div>'} language="tsx" />
        <h2 id="edges">Edges</h2>
        <p>One edge at a time: <code>scroll-fade-t</code>, <code>scroll-fade-b</code>, <code>scroll-fade-s</code>, <code>scroll-fade-e</code>. The start edge fades in after you leave the start. The end edge fades out when you reach the end.</p>
        <div data-not-typeset className="mb-12 grid gap-6 md:grid-cols-2">
          <Frame label="scroll-fade-t">
            <div className="h-36 scroll-fade-t scrollbar-none overflow-y-auto">
              <div className="flex flex-col gap-1.5 p-1.5">{items.map((item) => <Row key={item}>{item}</Row>)}</div>
            </div>
          </Frame>
          <Frame label="scroll-fade-b">
            <div className="h-36 scroll-fade-b scrollbar-none overflow-y-auto">
              <div className="flex flex-col gap-1.5 p-1.5">{items.map((item) => <Row key={item}>{item}</Row>)}</div>
            </div>
          </Frame>
          <Frame label="scroll-fade-s">
            <div className="scroll-fade-s scrollbar-none overflow-x-auto">
              <div className="flex w-max gap-1.5 p-1.5">{tags.map((tag) => <div key={tag} className="shrink-0 rounded-lg bg-muted px-3 py-2.5 text-sm">{tag}</div>)}</div>
            </div>
          </Frame>
          <Frame label="scroll-fade-e">
            <div className="scroll-fade-e scrollbar-none overflow-x-auto">
              <div className="flex w-max gap-1.5 p-1.5">{tags.map((tag) => <div key={tag} className="shrink-0 rounded-lg bg-muted px-3 py-2.5 text-sm">{tag}</div>)}</div>
            </div>
          </Frame>
        </div>
        <h2 id="classes">Classes</h2>
        <table>
          <thead>
            <tr><th>Class</th><th>Effect</th></tr>
          </thead>
          <tbody>
            <tr><td><code>scroll-fade</code></td><td>Fades the top and bottom. Put it on the element with <code>overflow-y-auto</code>.</td></tr>
            <tr><td><code>scroll-fade-y</code></td><td>Same as <code>scroll-fade</code>, on the vertical axis.</td></tr>
            <tr><td><code>scroll-fade-x</code></td><td>Fades the inline start and end. Use it with <code>overflow-x-auto</code>.</td></tr>
            <tr><td><code>scroll-fade-t</code> <code>scroll-fade-b</code></td><td>Top edge only, or bottom edge only.</td></tr>
            <tr><td><code>scroll-fade-l</code> <code>scroll-fade-r</code></td><td>Left edge only, or right edge only.</td></tr>
            <tr><td><code>scroll-fade-s</code> <code>scroll-fade-e</code></td><td>Start or end edge. These follow RTL.</td></tr>
            <tr><td><code>scroll-fade-8</code> <code>scroll-fade-[2rem]</code></td><td>Fade size, from the spacing scale or an explicit value.</td></tr>
            <tr><td><code>scroll-fade-t-8</code></td><td>Size for one edge: <code>t</code>, <code>b</code>, <code>s</code>, or <code>e</code>.</td></tr>
            <tr><td><code>scroll-fade-none</code></td><td>Turns the mask off.</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export { ScrollFadeDocs, toc as scrollFadeToc }
