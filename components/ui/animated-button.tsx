"use client";

import { cn } from "@/lib/utils";
import type { useRender } from "@base-ui/react/use-render";
import type { VariantProps } from "class-variance-authority";
import { type buttonVariants, Button } from "./button";

interface AnimatedButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  animation?: "tap" | "wiggle" | "bounce" | "none";
  enableRipple?: boolean;
}

function AnimatedButton({
  className,
  variant,
  size,
  animation = "tap",
  enableRipple = false,
  children,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableRipple) {
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className = "ripple";

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    onClick?.(e);
  };

  const animationClass = {
    tap: "tap-scale",
    wiggle: "hover:animate-wiggle",
    bounce: "hover:animate-bounce",
    none: "",
  }[animation];

  return (
    <Button
      className={cn(
        animationClass,
        enableRipple && "relative overflow-hidden",
        className
      )}
      variant={variant}
      size={size}
      onClick={handleClick}
      {...props}
    >
      {children}
      {enableRipple && (
        <style jsx>{`
          .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
          }

          @keyframes ripple-animation {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}</style>
      )}
    </Button>
  );
}

export { AnimatedButton };
