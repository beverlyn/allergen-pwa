import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUpdateSettings } from '../../hooks/useDatabase'
import { useApp } from '../../contexts/AppContext'
import { Button } from '../common'

interface NotificationSetupProps {
  onBack: () => void
}

export function NotificationSetup({ onBack }: NotificationSetupProps) {
  const { t } = useTranslation()
  const updateSettings = useUpdateSettings()
  const { showToast, completeOnboarding } = useApp()
  const [isEnabling, setIsEnabling] = useState(false)

  const handleEnableNotifications = async () => {
    setIsEnabling(true)

    try {
      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()

        if (permission === 'granted') {
          updateSettings.mutate(
            { notificationsEnabled: true },
            {
              onSuccess: () => {
                showToast(t('settings.notificationsEnabled'), 'success')
                completeOnboarding()
              },
            }
          )
        } else {
          showToast('Notification permission denied', 'error')
          setIsEnabling(false)
        }
      } else {
        showToast('Notifications not supported', 'error')
        setIsEnabling(false)
      }
    } catch (error) {
      showToast('Failed to enable notifications', 'error')
      setIsEnabling(false)
    }
  }

  const handleSkip = () => {
    updateSettings.mutate(
      { notificationsEnabled: false },
      {
        onSuccess: () => {
          completeOnboarding()
        },
      }
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🔔</div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t('onboarding.notifications')}
        </h2>
        <p className="text-gray-600 mt-2">
          {t('onboarding.notificationsDesc')}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex gap-2">
            <span>•</span>
            <span>One reminder per allergen, once per week</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Only for allergens that are overdue (7+ days)</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Gentle reminders at 9:00 AM local time</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>You can disable this anytime in settings</span>
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleEnableNotifications}
          fullWidth
          size="lg"
          disabled={isEnabling}
        >
          {isEnabling ? 'Enabling...' : 'Enable Reminders'}
        </Button>

        <Button variant="secondary" onClick={handleSkip} fullWidth>
          Skip for now
        </Button>

        <Button variant="ghost" onClick={onBack} fullWidth size="sm">
          {t('common.back')}
        </Button>
      </div>
    </div>
  )
}
