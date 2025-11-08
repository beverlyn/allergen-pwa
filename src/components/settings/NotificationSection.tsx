import { useTranslation } from 'react-i18next'
import { useSettings, useUpdateSettings } from '../../hooks/useDatabase'
import { useApp } from '../../contexts/AppContext'

export function NotificationSection() {
  const { t } = useTranslation()
  const { data: settings } = useSettings()
  const updateSettings = useUpdateSettings()
  const { showToast } = useApp()

  const handleToggleNotifications = async () => {
    if (!settings) return

    if (!settings.notificationsEnabled) {
      // Request permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()

        if (permission === 'granted') {
          updateSettings.mutate(
            { notificationsEnabled: true },
            {
              onSuccess: () => {
                showToast('Notifications enabled', 'success')
              },
            }
          )
        } else {
          showToast('Notification permission denied', 'error')
        }
      } else {
        showToast('Notifications not supported', 'error')
      }
    } else {
      updateSettings.mutate({ notificationsEnabled: false })
    }
  }

  const handleThresholdChange = (days: number) => {
    updateSettings.mutate({ notificationThresholdDays: days })
  }

  if (!settings) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t('settings.notifications')}
      </h2>

      <div className="space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-gray-700">
            {t('settings.notificationsEnabled')}
          </span>
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={handleToggleNotifications}
            className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
          />
        </label>

        {settings.notificationsEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.thresholdDays')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="3"
                max="14"
                value={settings.notificationThresholdDays}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 min-w-[60px]">
                {settings.notificationThresholdDays} {t('settings.thresholdDaysUnit')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
