import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/lib/utils.ts"

function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: SliderPrimitive.Root.Props) {
  const values = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("w-full", className)}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center">
        <SliderPrimitive.Track data-slot="slider-track" className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Indicator data-slot="slider-range" className="h-full bg-primary" />
        </SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            className="block size-4 rounded-full border border-input bg-background shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
