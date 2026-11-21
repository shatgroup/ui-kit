const ANIMATIONS = [
  { id: "fade", name: "Fade" },
  { id: "slide-up", name: "Slide Up" },
  { id: "slide-side", name: "Slide Side" },
  { id: "pop", name: "Pop" },
  { id: "spring-bounce", name: "Spring Bounce" },
  { id: "blur-fade", name: "Blur Fade" },
  { id: "scale-fade", name: "Scale Fade" },
] as const

type MessageAnimationPreset = (typeof ANIMATIONS)[number]
type MessageAnimationId = MessageAnimationPreset["id"]

const MESSAGE_ANIMATIONS = ANIMATIONS.reduce(
  (acc, preset) => {
    acc[preset.id] = preset
    return acc
  },
  {} as Record<MessageAnimationId, MessageAnimationPreset>,
)

export { MESSAGE_ANIMATIONS, type MessageAnimationId, type MessageAnimationPreset }
