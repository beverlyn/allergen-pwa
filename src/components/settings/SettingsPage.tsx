import { useTranslation } from 'react-i18next'
import { BabyProfileSection } from './BabyProfileSection'
import { NotificationSection } from './NotificationSection'
import { ThemeSection } from './ThemeSection'
import { LanguageSection } from './LanguageSection'
import { DataSection } from './DataSection'

export function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('settings.title')}
        </h1>
      </div>

      <div className="space-y-4">
        <BabyProfileSection />
        <NotificationSection />
        <ThemeSection />
        <LanguageSection />
        <DataSection />

        {/* About */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('settings.about')}
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('settings.version')}</span>
              <span className="font-medium">1.0.0</span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-gray-600 leading-relaxed">
                {t('settings.privacy')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
