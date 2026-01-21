import { Card } from "@/components/ui/card"
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

interface GradientCardProps extends React.ComponentProps<typeof Card> {
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

function GradientCard({ className, variant, ...props }: GradientCardProps) {
  return (
    <Card
      className={cn(gradientMap[variant], "text-white", className)}
      data-slot="gradient-card"
      {...props}
    />
  )
}

export { GradientCard, type GradientCardProps, type GradientVariant }
