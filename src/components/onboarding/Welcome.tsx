import { useTranslation } from 'react-i18next'
import { Button } from '../common'

interface WelcomeProps {
  onNext: () => void
}

export function Welcome({ onNext }: WelcomeProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="text-6xl mb-6">🍽️</div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {t('onboarding.welcome')}
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        {t('onboarding.intro')}
      </p>

      <div className="space-y-4 text-left mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="font-semibold text-gray-900">Track 9 Major Allergens</h3>
            <p className="text-sm text-gray-600">Monitor introduction timing and frequency</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-2xl">🔔</span>
          <div>
            <h3 className="font-semibold text-gray-900">Gentle Reminders</h3>
            <p className="text-sm text-gray-600">Weekly notifications for overdue allergens</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="font-semibold text-gray-900">Privacy First</h3>
            <p className="text-sm text-gray-600">All data stored locally on your device</p>
          </div>
        </div>
      </div>

      <Button onClick={onNext} size="lg" fullWidth>
        {t('common.next')}
      </Button>
    </div>
  )
}
