"use client";

import { useInView } from "@/hooks/use-animation";
import { cn } from "@/lib/utils";
import type { useRender } from "@base-ui/react/use-render";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

interface AnimatedCardProps extends useRender.ComponentProps<"div"> {
  animation?: "fade" | "slide-up" | "scale" | "pop";
  delay?: number;
  triggerOnce?: boolean;
  enableHoverLift?: boolean;
}

function AnimatedCard({
  className,
  animation = "slide-up",
  delay = 0,
  triggerOnce = true,
  enableHoverLift = true,
  children,
  ...props
}: AnimatedCardProps) {
  const { ref, inView } = useInView({ triggerOnce, threshold: 0.1 });

  const animationClass = {
    fade: "animate-fade-in",
    "slide-up": "animate-slide-up-fade",
    scale: "animate-scale-in",
    pop: "animate-pop",
  }[animation];

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "transition-opacity",
        inView ? animationClass : "opacity-0",
        enableHoverLift && "hover-lift"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className={className} {...props}>
        {children}
      </Card>
    </div>
  );
}

export {
  AnimatedCard,
  CardAction as AnimatedCardAction,
  CardContent as AnimatedCardContent,
  CardDescription as AnimatedCardDescription,
  CardFooter as AnimatedCardFooter,
  CardHeader as AnimatedCardHeader,
  CardTitle as AnimatedCardTitle,
};
