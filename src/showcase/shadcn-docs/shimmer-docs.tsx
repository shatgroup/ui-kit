import { HighlightedCode } from "./highlighted-code.tsx"

const toc = [
  { title: "Usage", url: "#usage", depth: 2 },
  { title: "Duration", url: "#duration", depth: 2 },
  { title: "Direction", url: "#direction", depth: 2 },
  { title: "Spread", url: "#spread", depth: 2 },
  { title: "Classes", url: "#classes", depth: 2 },
]

function ShimmerDocs() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight">Shimmer</h1>
        <p className="text-[1.05rem] text-muted-foreground sm:text-base sm:text-balance md:max-w-[80%]">
          A light sweep across text. Classes ship in shadcn/tailwind.css.
        </p>
      </div>
      <div className="typeset w-full flex-1 pb-16 sm:pb-0">
        <p data-not-typeset className="shimmer mt-4 mb-12 text-center text-sm text-muted-foreground">Generating response…</p>
        <h2 id="usage">Usage</h2>
        <p>Add <code>shimmer</code> to text. The highlight uses the current text color. It turns off when the system asks for reduced motion.</p>
        <HighlightedCode code={'<p className="shimmer">Generating response…</p>'} language="tsx" />
        <h2 id="duration">Duration</h2>
        <p><code>shimmer-duration-1000</code> is one 1000ms pass. The default is 2000ms.</p>
        <div data-not-typeset className="mb-12 grid gap-6 text-center text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="shimmer">Generating response…</p>
            <p className="font-mono text-xs">shimmer</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="shimmer shimmer-duration-1000">Generating response…</p>
            <p className="font-mono text-xs">shimmer-duration-1000</p>
          </div>
        </div>
        <h2 id="direction">Direction</h2>
        <p><code>shimmer-reverse</code> sweeps the other way. <code>shimmer-once</code> runs a single pass.</p>
        <div data-not-typeset className="mb-12 grid gap-6 text-center text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="shimmer shimmer-reverse">Generating response…</p>
            <p className="font-mono text-xs">shimmer-reverse</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="shimmer shimmer-once">Generating response…</p>
            <p className="font-mono text-xs">shimmer-once</p>
          </div>
        </div>
        <h2 id="spread">Spread</h2>
        <p>Band width follows the spacing scale. The default is <code>calc(3ch + 40px)</code>.</p>
        <div data-not-typeset className="mb-12 grid gap-6 text-center text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="shimmer shimmer-spread-4">Generating response…</p>
            <p className="font-mono text-xs">shimmer-spread-4</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="shimmer shimmer-spread-24 shimmer-color-primary">Generating response…</p>
            <p className="font-mono text-xs">shimmer-spread-24 shimmer-color-primary</p>
          </div>
        </div>
        <h2 id="classes">Classes</h2>
        <table>
          <thead>
            <tr><th>Class</th><th>Effect</th></tr>
          </thead>
          <tbody>
            <tr><td><code>shimmer</code></td><td>A repeating highlight across the text.</td></tr>
            <tr><td><code>shimmer-once</code></td><td>One pass.</td></tr>
            <tr><td><code>shimmer-reverse</code></td><td>Reverses the sweep.</td></tr>
            <tr><td><code>shimmer-none</code></td><td>Turns the effect off and restores the text color.</td></tr>
            <tr><td><code>shimmer-duration-1000</code></td><td>Length of one pass, in milliseconds.</td></tr>
            <tr><td><code>shimmer-spread-24</code></td><td>Band width from the spacing scale, or <code>shimmer-spread-[3rem]</code>.</td></tr>
            <tr><td><code>shimmer-angle-40</code></td><td>Band angle in degrees. The default is 20.</td></tr>
            <tr><td><code>shimmer-color-primary</code></td><td>Highlight color. Accepts a theme color or a color value.</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export { ShimmerDocs, toc as shimmerToc }
