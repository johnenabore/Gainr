'use client'

import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream
    )
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches
    )
  }, [])

  if (isStandalone) return null

  return (
    <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
      <h3 className="text-sm font-medium text-white mb-1">
        Install Gainr
      </h3>
      {isIOS ? (
        <p className="text-xs text-zinc-400">
          Tap the share button ⎋ then "Add to Home Screen" ➕
        </p>
      ) : (
        <button className="text-xs text-blue-400 underline">
          Add to Home Screen
        </button>
      )}
    </div>
  )
}