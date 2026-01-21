import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AnimationType =
  | "fadeIn"
  | "fadeOut"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "slideUpFade"
  | "slideDownFade"
  | "scaleIn"
  | "scaleOut"
  | "bounce"
  | "pulse"
  | "shimmer"
  | "wiggle"
  | "pop"

type Duration = "fast" | "normal" | "slow"
type Easing = "ease-out" | "ease-in-out" | "spring"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  animation?: AnimationType
  duration?: Duration
  easing?: Easing
  delay?: number
}

const durationMap: Record<Duration, string> = {
  fast: "duration-150",
  normal: "duration-250",
  slow: "duration-400",
}

const easingMap: Record<Easing, string> = {
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  spring: "ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
}

function AnimatedButton({
  className,
  animation = "fadeIn",
  duration = "normal",
  easing = "ease-out",
  delay = 0,
  ...props
}: AnimatedButtonProps) {
  return (
    <Button
      className={cn(
        `animate-${animation}`,
        durationMap[duration],
        easingMap[easing],
        className
      )}
      data-slot="animated-button"
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    />
  )
}

export { AnimatedButton, type AnimatedButtonProps, type AnimationType }
