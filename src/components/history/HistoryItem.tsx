import { useTranslation } from 'react-i18next'
import { useDeleteFeedingLog } from '../../hooks/useDatabase'
import { useApp } from '../../contexts/AppContext'
import { Button } from '../common'
import { formatDate } from '../../utils/date'
import type { FeedingLog, Allergen } from '../../types'

interface HistoryItemProps {
  log: FeedingLog
  allergen?: Allergen
}

export function HistoryItem({ log, allergen }: HistoryItemProps) {
  const { t, i18n } = useTranslation()
  const deleteFeedingLog = useDeleteFeedingLog()
  const { showToast } = useApp()

  const handleDelete = () => {
    if (confirm(t('history.deleteConfirm'))) {
      deleteFeedingLog.mutate(log.id, {
        onSuccess: () => {
          showToast(t('feeding.deleted'), 'success')
        },
        onError: () => {
          showToast(t('errors.saveFailed'), 'error')
        },
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          {allergen && <span className="text-2xl">{allergen.emoji}</span>}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-gray-900">{allergen?.name}</p>
              <span className="text-sm text-gray-500">
                {formatDate(log.date, i18n.language)}
              </span>
            </div>

            {log.amount && (
              <p className="text-sm text-gray-600 mb-1">
                Amount: {log.amount}
              </p>
            )}

            {log.hasReaction && (
              <div className="bg-red-50 border border-red-200 rounded px-2 py-1 mb-2 inline-block">
                <p className="text-sm text-red-800">
                  ⚠️ Reaction: {log.reactionSeverity}
                </p>
              </div>
            )}

            {log.notes && (
              <p className="text-sm text-gray-600 italic mt-2">
                "{log.notes}"
              </p>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          aria-label="Delete log"
        >
          🗑️
        </Button>
      </div>
    </div>
  )
}
