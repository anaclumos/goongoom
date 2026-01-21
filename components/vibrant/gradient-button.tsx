import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type GradientVariant =
  | "sunset"
  | "ocean"
  | "forest"
  | "candy"
  | "electric"
  | "neon"
  | "cosmic"
  | "tropical"
  | "fire"
  | "aurora"

interface GradientButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  variant: GradientVariant
}

const gradientMap: Record<GradientVariant, string> = {
  sunset: "bg-gradient-sunset",
  ocean: "bg-gradient-ocean",
  forest: "bg-gradient-forest",
  candy: "bg-gradient-candy",
  electric: "bg-gradient-electric",
  neon: "bg-gradient-neon",
  cosmic: "bg-gradient-cosmic",
  tropical: "bg-gradient-tropical",
  fire: "bg-gradient-fire",
  aurora: "bg-gradient-aurora",
}

function GradientButton({ className, variant, ...props }: GradientButtonProps) {
  return (
    <Button
      className={cn(
        gradientMap[variant],
        "border-none text-white hover:opacity-90",
        className
      )}
      data-slot="gradient-button"
      {...props}
    />
  )
}

export { GradientButton, type GradientButtonProps, type GradientVariant }
