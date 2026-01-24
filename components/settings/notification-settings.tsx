'use client'

import { Alert01Icon, Notification03Icon, NotificationOff01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useIsClient } from 'usehooks-ts'
import {
  getPushSubscriptions,
  sendTestPushNotification,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/lib/actions/push'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

type PermissionState = 'granted' | 'denied' | 'default'

function checkPushSupport(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window && window.isSecureContext
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function NotificationHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

export function NotificationSettings({ clerkId }: { clerkId: string }) {
  const t = useTranslations('settings')
  const isClient = useIsClient()
  const [permission, setPermission] = useState<PermissionState>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const hasInitialized = useRef(false)

  const isSupported = isClient && checkPushSupport()

  useEffect(() => {
    if (!isClient || hasInitialized.current) {
      return
    }

    hasInitialized.current = true
    let cancelled = false

    async function initialize() {
      if (!checkPushSupport()) {
        if (!cancelled) {
          setIsLoading(false)
        }
        return
      }

      if (!cancelled) {
        setPermission(Notification.permission as PermissionState)
      }

      try {
        const subscriptions = await getPushSubscriptions(clerkId)
        if (!cancelled) {
          setIsSubscribed(subscriptions.length > 0)
          setIsLoading(false)
        }
      } catch {
        if (!cancelled) {
          setIsSubscribed(false)
          setIsLoading(false)
        }
      }
    }

    initialize()

    return () => {
      cancelled = true
    }
  }, [isClient, clerkId])

  const handleSubscribe = useCallback(async () => {
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission()
      setPermission(result as PermissionState)
      if (result !== 'granted') {
        toast.error(t('notificationSettings.permissionDenied'))
        return
      }
    } else if (Notification.permission === 'denied') {
      toast.error(t('notificationSettings.permissionBlocked'))
      return
    }

    startTransition(async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready

        if (!VAPID_PUBLIC_KEY) {
          toast.error(t('notificationSettings.configError'))
          return
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
        })

        const subscriptionJson = subscription.toJSON()
        if (subscriptionJson.endpoint && subscriptionJson.keys) {
          await subscribeToPush({
            endpoint: subscriptionJson.endpoint,
            keys: {
              p256dh: subscriptionJson.keys.p256dh ?? '',
              auth: subscriptionJson.keys.auth ?? '',
            },
          })
          setIsSubscribed(true)
          toast.success(t('notificationSettings.subscribeSuccess'))
        }
      } catch {
        toast.error(t('notificationSettings.subscribeError'))
      }
    })
  }, [t])

  const handleUnsubscribe = useCallback(() => {
    startTransition(async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          const subscription = await registration.pushManager.getSubscription()
          if (subscription) {
            await subscription.unsubscribe()
            await unsubscribeFromPush(subscription.endpoint)
          }
        }
        setIsSubscribed(false)
        toast.success(t('notificationSettings.unsubscribeSuccess'))
      } catch {
        toast.error(t('notificationSettings.unsubscribeError'))
      }
    })
  }, [t])

  const handleToggle = useCallback(
    (checked: boolean) => {
      if (checked) {
        handleSubscribe()
      } else {
        handleUnsubscribe()
      }
    },
    [handleSubscribe, handleUnsubscribe]
  )

  const handleTestNotification = useCallback(() => {
    startTransition(async () => {
      const result = await sendTestPushNotification()
      if (result.success) {
        toast.success(t('notificationSettings.testSuccess'))
      } else {
        toast.error(result.error ?? t('notificationSettings.testError'))
      }
    })
  }, [t])

  const headerTitle = t('notificationSettings.title')
  const headerDescription = t('notificationSettings.description')

  if (!isClient) {
    return (
      <div className="space-y-4">
        <NotificationHeader description={headerDescription} title={headerTitle} />
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted/50">
              <HugeiconsIcon className="size-4 text-muted-foreground" icon={Notification03Icon} strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <p className="font-medium text-foreground text-sm">{t('notificationSettings.enableLabel')}</p>
              <p className="text-muted-foreground text-xs">{t('notificationSettings.enableDescription')}</p>
            </div>
          </div>
          <Switch checked={false} disabled />
        </div>
      </div>
    )
  }

  if (!isSupported) {
    return (
      <div className="space-y-4">
        <NotificationHeader description={headerDescription} title={headerTitle} />
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <HugeiconsIcon className="size-5 shrink-0 text-amber-500" icon={Alert01Icon} strokeWidth={2} />
          <p className="text-muted-foreground text-sm">{t('notificationSettings.unsupported')}</p>
        </div>
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div className="space-y-4">
        <NotificationHeader description={headerDescription} title={headerTitle} />
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <HugeiconsIcon className="size-5 shrink-0 text-destructive" icon={NotificationOff01Icon} strokeWidth={2} />
          <p className="text-muted-foreground text-sm">{t('notificationSettings.blocked')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <NotificationHeader description={headerDescription} title={headerTitle} />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted/50">
              <HugeiconsIcon className="size-4 text-muted-foreground" icon={Notification03Icon} strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <p className="font-medium text-foreground text-sm">{t('notificationSettings.enableLabel')}</p>
              <p className="text-muted-foreground text-xs">{t('notificationSettings.enableDescription')}</p>
            </div>
          </div>
          <Switch checked={isSubscribed} disabled={isLoading || isPending} onCheckedChange={handleToggle} />
        </div>

        {isSubscribed && (
          <Button className="w-full" disabled={isPending} onClick={handleTestNotification} variant="outline">
            {isPending ? t('notificationSettings.testSending') : t('notificationSettings.testButton')}
          </Button>
        )}
      </div>
    </div>
  )
}
