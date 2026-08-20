import PushNotificationManager from '@/features/PushNotificationManager'
import InstallPrompt from '@/features/InstallPrompt'

export default function SettingsPage() {
  return (
    <main className="px-4 py-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <PushNotificationManager />
      <InstallPrompt />
    </main>
  )
}
