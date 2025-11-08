import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAddFeedingLog } from '../../hooks/useDatabase'
import { useApp } from '../../contexts/AppContext'
import { Button, Input, Select } from '../common'
import { validateFeedingLog } from '../../utils/validation'
import { getToday } from '../../utils/date'
import type { Allergen, ReactionSeverity } from '../../types'

interface FeedingLogFormProps {
  allergen: Allergen
  onSuccess?: () => void
}

export function FeedingLogForm({ allergen, onSuccess }: FeedingLogFormProps) {
  const { t } = useTranslation()
  const addFeedingLog = useAddFeedingLog()
  const { showToast } = useApp()

  const [date, setDate] = useState(getToday())
  const [amount, setAmount] = useState('')
  const [hasReaction, setHasReaction] = useState(false)
  const [reactionSeverity, setReactionSeverity] = useState<ReactionSeverity>('mild')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const logData = {
      allergen: allergen.type,
      date,
      amount: amount || undefined,
      hasReaction,
      reactionSeverity: hasReaction ? reactionSeverity : undefined,
      notes: notes || undefined,
    }

    const validation = validateFeedingLog(logData)

    if (!validation.valid) {
      const errorMap: Record<string, string> = {}
      validation.errors.forEach((error) => {
        errorMap[error.field] = error.message
      })
      setErrors(errorMap)
      return
    }

    addFeedingLog.mutate(logData, {
      onSuccess: () => {
        showToast(t('feeding.saved'), 'success')
        // Reset form
        setDate(getToday())
        setAmount('')
        setHasReaction(false)
        setReactionSeverity('mild')
        setNotes('')
        setErrors({})
        onSuccess?.()
      },
      onError: () => {
        showToast(t('errors.saveFailed'), 'error')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('feeding.date')}
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value)
          setErrors((prev) => ({ ...prev, date: '' }))
        }}
        error={errors.date}
        max={getToday()}
        required
      />

      <Input
        label={t('feeding.amount')}
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={t('feeding.amountPlaceholder')}
      />

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasReaction}
            onChange={(e) => setHasReaction(e.target.checked)}
            className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            {t('feeding.reaction')}
          </span>
        </label>
      </div>

      {hasReaction && (
        <Select
          label={t('feeding.reactionSeverity')}
          value={reactionSeverity}
          onChange={(e) => {
            setReactionSeverity(e.target.value as ReactionSeverity)
            setErrors((prev) => ({ ...prev, reactionSeverity: '' }))
          }}
          options={[
            { value: 'mild', label: t('feeding.mild') },
            { value: 'moderate', label: t('feeding.moderate') },
            { value: 'severe', label: t('feeding.severe') },
          ]}
          error={errors.reactionSeverity}
          required
        />
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          {t('feeding.notes')}
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('feeding.notesPlaceholder')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <Button type="submit" fullWidth disabled={addFeedingLog.isPending}>
        {addFeedingLog.isPending ? 'Saving...' : t('common.save')}
      </Button>
    </form>
  )
}
