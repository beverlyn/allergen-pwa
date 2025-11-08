import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from '../common'
import { FeedingLogForm } from './FeedingLogForm'
import { FeedingHistory } from './FeedingHistory'
import type { Allergen } from '../../types'
import { useUpdateAllergen } from '../../hooks/useDatabase'

interface FeedingLogModalProps {
  isOpen: boolean
  onClose: () => void
  allergen: Allergen
}

type Tab = 'log' | 'history'

export function FeedingLogModal({ isOpen, onClose, allergen }: FeedingLogModalProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('log')
  const updateAllergen = useUpdateAllergen()

  const handleTogglePause = () => {
    updateAllergen.mutate({
      id: allergen.id,
      updates: { paused: !allergen.paused },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-4">
        {/* Header with allergen info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{allergen.emoji}</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{allergen.name}</h3>
              {allergen.firstIntroducedAt && (
                <p className="text-sm text-gray-500">
                  First introduced: {new Date(allergen.firstIntroducedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <Button
            variant={allergen.paused ? 'secondary' : 'ghost'}
            size="sm"
            onClick={handleTogglePause}
          >
            {allergen.paused ? '▶️ Resume' : '⏸ Pause'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'log'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('feeding.logFeeding')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('history.title')}
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {activeTab === 'log' && (
            <FeedingLogForm allergen={allergen} onSuccess={onClose} />
          )}
          {activeTab === 'history' && <FeedingHistory allergenType={allergen.type} />}
        </div>
      </div>
    </Modal>
  )
}
