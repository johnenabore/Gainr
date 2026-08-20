'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '@/app/actions'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] =
    useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    await subscribeUser(JSON.parse(JSON.stringify(sub)))
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }

  if (!isSupported) return null

  return (
    <div className="p-4 bg-card rounded-xl border border-border">
      <h3 className="text-sm font-medium text-foreground mb-2">
        Notifications
      </h3>
      {subscription ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Notifications enabled
          </p>
          <button
            onClick={unsubscribeFromPush}
            className="text-xs text-red-500 dark:text-red-400 underline text-left"
          >
            Disable
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Get reminders to log your workouts
          </p>
          <button
            onClick={subscribeToPush}
            className="text-xs text-blue-500 dark:text-blue-400 underline text-left"
          >
            Enable notifications
          </button>
        </div>
      )}
    </div>
  )
}