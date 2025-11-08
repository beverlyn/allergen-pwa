import { useTranslation } from 'react-i18next'
import { useFeedingLogs, useDeleteFeedingLog } from '../../hooks/useDatabase'
import { useApp } from '../../contexts/AppContext'
import { Button } from '../common'
import { formatDate } from '../../utils/date'
import type { AllergenType } from '../../types'

interface FeedingHistoryProps {
  allergenType: AllergenType
}

export function FeedingHistory({ allergenType }: FeedingHistoryProps) {
  const { t, i18n } = useTranslation()
  const { data: logs, isLoading } = useFeedingLogs(allergenType)
  const deleteFeedingLog = useDeleteFeedingLog()
  const { showToast } = useApp()

  const handleDelete = (id: string) => {
    if (confirm(t('history.deleteConfirm'))) {
      deleteFeedingLog.mutate(id, {
        onSuccess: () => {
          showToast(t('feeding.deleted'), 'success')
        },
        onError: () => {
          showToast(t('errors.saveFailed'), 'error')
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading history...
      </div>
    )
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('history.noLogsForAllergen')}
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {formatDate(log.date, i18n.language)}
              </p>
              {log.amount && (
                <p className="text-sm text-gray-600">Amount: {log.amount}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(log.id)}
            >
              🗑️
            </Button>
          </div>

          {log.hasReaction && (
            <div className="bg-red-50 border border-red-200 rounded px-2 py-1 mb-2">
              <p className="text-sm text-red-800">
                ⚠️ Reaction: {log.reactionSeverity}
              </p>
            </div>
          )}

          {log.notes && (
            <p className="text-sm text-gray-600 mt-2">{log.notes}</p>
          )}
        </div>
      ))}
    </div>
  )
}
