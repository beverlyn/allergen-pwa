import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFeedingLogs, useAllergens } from '../../hooks/useDatabase'
import { HistoryItem } from './HistoryItem'
import { Select } from '../common'
import type { AllergenType } from '../../types'

export function HistoryView() {
  const { t } = useTranslation()
  const { data: allLogs, isLoading } = useFeedingLogs()
  const { data: allergens } = useAllergens()
  const [filterAllergen, setFilterAllergen] = useState<AllergenType | 'all'>('all')
  const [reactionsOnly, setReactionsOnly] = useState(false)

  const filteredLogs = useMemo(() => {
    if (!allLogs) return []

    let filtered = [...allLogs]

    if (filterAllergen !== 'all') {
      filtered = filtered.filter((log) => log.allergen === filterAllergen)
    }

    if (reactionsOnly) {
      filtered = filtered.filter((log) => log.hasReaction)
    }

    return filtered
  }, [allLogs, filterAllergen, reactionsOnly])

  const allergenOptions = useMemo(() => {
    const options = [{ value: 'all', label: t('history.allAllergens') }]

    if (allergens) {
      allergens.forEach((allergen) => {
        options.push({
          value: allergen.type,
          label: `${allergen.emoji} ${allergen.name}`,
        })
      })
    }

    return options
  }, [allergens, t])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading history...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <Select
          label={t('history.filterBy')}
          value={filterAllergen}
          onChange={(e) => setFilterAllergen(e.target.value as AllergenType | 'all')}
          options={allergenOptions}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={reactionsOnly}
            onChange={(e) => setReactionsOnly(e.target.checked)}
            className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            {t('history.reactionsOnly')}
          </span>
        </label>
      </div>

      {/* History List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-600">
            {filterAllergen !== 'all' || reactionsOnly
              ? t('history.noLogsForAllergen')
              : t('history.noLogs')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <HistoryItem
              key={log.id}
              log={log}
              allergen={allergens?.find((a) => a.type === log.allergen)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
