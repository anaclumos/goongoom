"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "@/lib/utils";
import type { GradientVariant } from "@/lib/gradients";

interface GradientCardProps extends useRender.ComponentProps<"div"> {
  gradient: GradientVariant;
}

function GradientCard({
  className,
  gradient,
  render,
  ...props
}: GradientCardProps) {
  const defaultProps = {
    className: cn(
      "relative flex flex-col gap-6 rounded-2xl border border-white/10 py-6 shadow-xs/5 overflow-hidden transition-all duration-300",
      "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)]",
      "hover:shadow-lg hover:scale-[1.02] hover:border-white/20",
      "dark:border-white/5 dark:hover:border-white/10",
      className,
    ),
    style: {
      background: `var(--gradient-${gradient})`,
      color: "oklch(0.98 0 0)",
    },
    "data-slot": "gradient-card",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function GradientCardHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      className,
    ),
    "data-slot": "card-header",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function GradientCardTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("font-semibold text-lg leading-none text-white", className),
    "data-slot": "card-title",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function GradientCardDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("text-white/80 text-sm", className),
    "data-slot": "card-description",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function GradientCardAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      className,
    ),
    "data-slot": "card-action",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function GradientCardPanel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("px-6", className),
    "data-slot": "card-content",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function GradientCardFooter({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("flex items-center px-6 [.border-t]:pt-6", className),
    "data-slot": "card-footer",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export {
  GradientCard,
  GradientCardAction,
  GradientCardDescription,
  GradientCardFooter,
  GradientCardHeader,
  GradientCardPanel,
  GradientCardPanel as GradientCardContent,
  GradientCardTitle,
};
