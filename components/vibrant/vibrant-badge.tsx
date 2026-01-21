import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type VibrantColor =
  | "electric-blue"
  | "neon-pink"
  | "lime"
  | "sunset-orange"
  | "purple"

interface VibrantBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant"> {
  color: VibrantColor
}

const colorMap: Record<VibrantColor, string> = {
  "electric-blue": "bg-electric-blue text-electric-blue-foreground",
  "neon-pink": "bg-neon-pink text-neon-pink-foreground",
  lime: "bg-lime text-lime-foreground",
  "sunset-orange": "bg-sunset-orange text-sunset-orange-foreground",
  purple: "bg-purple text-purple-foreground",
}

function VibrantBadge({ className, color, ...props }: VibrantBadgeProps) {
  return (
    <Badge
      className={cn(colorMap[color], className)}
      data-slot="vibrant-badge"
      {...props}
    />
  )
}

export { VibrantBadge, type VibrantBadgeProps, type VibrantColor }
