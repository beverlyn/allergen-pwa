import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../common'

interface DisclaimerProps {
  onNext: () => void
  onBack: () => void
}

export function Disclaimer({ onNext, onBack }: DisclaimerProps) {
  const { t } = useTranslation()
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">⚕️</div>
        <h2 className="text-2xl font-bold text-gray-900">Medical Disclaimer</h2>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 leading-relaxed">
          {t('onboarding.disclaimer')}
        </p>
      </div>

      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <span className="text-sm text-gray-700">
          {t('onboarding.disclaimerAccept')}
        </span>
      </label>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} fullWidth>
          {t('common.back')}
        </Button>
        <Button onClick={onNext} fullWidth disabled={!accepted}>
          {t('common.next')}
        </Button>
      </div>
    </div>
  )
}
