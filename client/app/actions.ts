'use server'

import webpush, { PushSubscription } from 'web-push'

webpush.setVapidDetails(
  'mailto:you@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub

  // TODO: save to PostgreSQL later

  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null

  // TODO: remove from PostgreSQL later

  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title: 'Gainr',
      body: message,
    })
  )

  return { success: true }
}