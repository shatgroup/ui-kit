
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"

export function AspectRatioSquare() {
  return (
    <div className="w-full max-w-[12rem]">
      <AspectRatio ratio={1 / 1} className="rounded-lg bg-muted">
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          className="rounded-lg object-cover grayscale dark:brightness-20 absolute inset-0 size-full"
        />
      </AspectRatio>
    </div>
  )
}
