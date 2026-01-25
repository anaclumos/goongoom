'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Alert02Icon,
  MultiplicationSignCircleIcon,
  Loading03Icon,
} from '@hugeicons/core-free-icons'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="top-center"
      className="toaster group"
      icons={{
        success: <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" />,
        info: <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4" />,
        warning: <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4" />,
        error: <HugeiconsIcon icon={MultiplicationSignCircleIcon} strokeWidth={2} className="size-4" />,
        loading: <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast !bg-popover/80 !backdrop-blur-md !border-border !text-popover-foreground !shadow-lg',
          success:
            '!bg-emerald-600 !border-emerald-700 !text-white dark:!bg-emerald-600 dark:!border-emerald-500 dark:!text-white [&_[data-icon]]:!text-white dark:[&_[data-icon]]:!text-emerald-100',
          error:
            '!bg-red-600 !border-red-700 !text-white dark:!bg-red-600 dark:!border-red-500 dark:!text-white [&_[data-icon]]:!text-white dark:[&_[data-icon]]:!text-red-100',
          warning:
            '!bg-amber-500 !border-amber-600 !text-white dark:!bg-amber-500 dark:!border-amber-400 dark:!text-white [&_[data-icon]]:!text-white dark:[&_[data-icon]]:!text-amber-100',
          info: '!bg-blue-600 !border-blue-700 !text-white dark:!bg-blue-600 dark:!border-blue-500 dark:!text-white [&_[data-icon]]:!text-white dark:[&_[data-icon]]:!text-blue-100',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
