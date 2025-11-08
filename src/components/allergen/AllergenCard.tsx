import { useTranslation } from 'react-i18next'
import type { Allergen } from '../../types'
import { formatDaysAgo } from '../../utils/date'

interface AllergenCardProps {
  allergen: Allergen
  onClick: () => void
}

export function AllergenCard({ allergen, onClick }: AllergenCardProps) {
  const { t, i18n } = useTranslation()

  const isOverdue = allergen.daysAgo && allergen.daysAgo >= 7

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-lg border-2 transition-all
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        tap-highlight-none
        ${allergen.paused ? 'bg-gray-100 border-gray-300 opacity-60' : 'bg-white border-gray-200 hover:border-primary hover:shadow-md'}
        ${isOverdue && !allergen.paused ? 'border-yellow-400 bg-yellow-50' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">{allergen.emoji}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {allergen.name}
              {allergen.paused && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  ⏸ Paused
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600">
              {!allergen.lastFedAt ? (
                <span className="text-gray-500">{t('common.notYetIntroduced')}</span>
              ) : (
                <span className={isOverdue ? 'text-yellow-700 font-medium' : ''}>
                  {formatDaysAgo(allergen.daysAgo || 0, i18n.language as 'en' | 'ja')}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="text-gray-400">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </button>
  )
}
