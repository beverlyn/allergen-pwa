import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFeedingLogs, useAllergens } from '../../hooks/useDatabase'
import { HistoryItem } from './HistoryItem'
import { Select } from '../common'
import type { AllergenType, AllergenDay, AllergenEntry } from '../../types'
import { AllergenHistory } from '../AllergenHistory'

export function HistoryView() {
  const { t } = useTranslation()
  const { data: allLogs, isLoading } = useFeedingLogs()
  const { data: allergens } = useAllergens()
  const [filterAllergen, setFilterAllergen] = useState<AllergenType | 'all'>('all')
  const [reactionsOnly, setReactionsOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

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

  // Convert feeding logs to AllergenDay format for calendar
  const allergenDays = useMemo(() => {
    if (!filteredLogs) return []

    const daysMap = new Map<string, AllergenEntry[]>()

    filteredLogs.forEach((log) => {
      const date = log.date.split('T')[0] // Get YYYY-MM-DD part
      if (!daysMap.has(date)) {
        daysMap.set(date, [])
      }

      const allergen = allergens?.find((a) => a.type === log.allergen)
      const entry: AllergenEntry = {
        id: log.id,
        allergen: allergen ? `${allergen.emoji} ${allergen.name}` : log.allergen,
        hasReaction: log.hasReaction,
        reactionSeverity: log.reactionSeverity,
        notes: log.notes,
        time: new Date(log.date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      daysMap.get(date)!.push(entry)
    })

    const days: AllergenDay[] = Array.from(daysMap.entries()).map(([date, entries]) => ({
      date,
      entries,
      hasReaction: entries.some((e) => e.hasReaction),
    }))

    return days
  }, [filteredLogs, allergens])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading history...</div>
      </div>
    )
  }

  const selectedAllergenName = useMemo(() => {
    if (filterAllergen === 'all') return 'All Allergens'
    const allergen = allergens?.find((a) => a.type === filterAllergen)
    return allergen ? `${allergen.emoji} ${allergen.name}` : filterAllergen
  }, [filterAllergen, allergens])

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

        <div className="flex items-center justify-between">
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

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              📝 List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'calendar'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              📅 Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Content - Calendar or List View */}
      {viewMode === 'calendar' ? (
        filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-gray-600">
              {filterAllergen !== 'all' || reactionsOnly
                ? t('history.noLogsForAllergen')
                : t('history.noLogs')}
            </p>
          </div>
        ) : (
          <AllergenHistory allergenName={selectedAllergenName} allergenDays={allergenDays} />
        )
      ) : (
        /* List View */
        filteredLogs.length === 0 ? (
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
        )
      )}
    </div>
  )
}
