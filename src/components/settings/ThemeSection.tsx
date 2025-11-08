import { useTranslation } from 'react-i18next'
import { useApp } from '../../contexts/AppContext'
import { Select } from '../common'

export function ThemeSection() {
  const { t } = useTranslation()
  const { theme, setTheme } = useApp()

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t('settings.theme')}
      </h2>

      <Select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
        options={[
          { value: 'light', label: t('settings.light') },
          { value: 'dark', label: t('settings.dark') },
        ]}
      />
    </div>
  )
}
