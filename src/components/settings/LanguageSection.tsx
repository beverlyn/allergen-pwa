import { useTranslation } from 'react-i18next'
import { useApp } from '../../contexts/AppContext'
import { Select } from '../common'

export function LanguageSection() {
  const { t } = useTranslation()
  const { language, setLanguage } = useApp()

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t('settings.language')}
      </h2>

      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'ja')}
        options={[
          { value: 'en', label: t('settings.english') },
          { value: 'ja', label: t('settings.japanese') },
        ]}
      />
    </div>
  )
}
