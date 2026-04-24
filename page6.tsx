'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import GameNavigation from '@/components/game-navigation'

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    sound_enabled: true,
    music_enabled: true,
    notification_enabled: true,
    language: 'en',
    theme: 'dark',
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/auth/login')
        return
      }
      setUser(data.session.user)

      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', data.session.user.id)
        .single()

      if (userSettings) {
        setSettings(userSettings)
      }
      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  const handleSave = async () => {
    try {
      await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', user.id)

      alert('Settings saved!')
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save settings')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-950">
      <GameNavigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-purple-500/20 px-6 py-4">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Account Section */}
          <Card className="bg-slate-900 border-purple-500/20 p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Account</h2>
            <div className="space-y-2">
              <Label className="text-slate-400">Email</Label>
              <p className="text-slate-300 bg-slate-800 px-3 py-2 rounded">{user?.email}</p>
            </div>
          </Card>

          {/* Audio Settings */}
          <Card className="bg-slate-900 border-purple-500/20 p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Audio</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Sound Effects</Label>
                <Switch
                  checked={settings.sound_enabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, sound_enabled: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Background Music</Label>
                <Switch
                  checked={settings.music_enabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, music_enabled: checked })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-slate-900 border-purple-500/20 p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Notifications</h2>
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Enable Notifications</Label>
              <Switch
                checked={settings.notification_enabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notification_enabled: checked })
                }
              />
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="bg-slate-900 border-purple-500/20 p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Display</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Language</Label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="w-full mt-2 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-300"
                >
                  <option value="en">English</option>
                  <option value="vi">Vietnamese</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div>
                <Label className="text-slate-300">Theme</Label>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings({ ...settings, theme: e.target.value })
                  }
                  className="w-full mt-2 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-300"
                  disabled
                >
                  <option value="dark">Dark (Current)</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              Save Changes
            </Button>
            <Button variant="outline" className="flex-1">
              Reset to Defaults
            </Button>
          </div>

          {/* About */}
          <Card className="bg-slate-900 border-purple-500/20 p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">About</h2>
            <div className="space-y-2 text-slate-400 text-sm">
              <p>Toilet Tower Defense v1.0.0</p>
              <p>Build the ultimate tower defense strategy game</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
