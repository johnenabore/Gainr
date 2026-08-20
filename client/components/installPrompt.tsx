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
    <div className="p-4 bg-card rounded-xl border border-border">
      <h3 className="text-sm font-medium text-foreground mb-1">
        Install Gainr
      </h3>
      {isIOS ? (
        <p className="text-xs text-muted-foreground">
          Tap the share button ⎋ then "Add to Home Screen" ➕
        </p>
      ) : (
        <button className="text-xs text-blue-500 dark:text-blue-400 underline">
          Add to Home Screen
        </button>
      )}
    </div>
  )
}