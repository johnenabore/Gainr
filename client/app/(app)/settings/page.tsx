// No "use client" — Server Component
import PushNotificationManager from '@/components/pushNotificationManager'
import InstallPrompt from '@/components/installPrompt'

export default function SettingsPage() {
  return (
    <main className="px-4 py-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <PushNotificationManager />
      <InstallPrompt />
    </main>
  )
}