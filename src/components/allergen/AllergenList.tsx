import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAllergens } from '../../hooks/useDatabase'
import { AllergenCard } from './AllergenCard'
import { FeedingLogModal } from './FeedingLogModal'
import type { Allergen } from '../../types'

export function AllergenList() {
  const { t } = useTranslation()
  const { data: allergens, isLoading } = useAllergens()
  const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sortedAllergens = useMemo(() => {
    if (!allergens) return []

    // Sort by:
    // 1. Paused allergens at the bottom
    // 2. Not yet introduced (no lastFedAt) at the top
    // 3. Then by days ago (oldest first)
    return [...allergens].sort((a, b) => {
      if (a.paused && !b.paused) return 1
      if (!a.paused && b.paused) return -1

      if (!a.lastFedAt && !b.lastFedAt) return 0
      if (!a.lastFedAt) return -1
      if (!b.lastFedAt) return 1

      return (b.daysAgo || 0) - (a.daysAgo || 0)
    })
  }, [allergens])

  const handleAllergenClick = (allergen: Allergen) => {
    setSelectedAllergen(allergen)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAllergen(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading allergens...</div>
      </div>
    )
  }

  if (!allergens || allergens.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🍽️</div>
        <p className="text-gray-600">{t('empty.main')}</p>
      </div>
    )
  }

  const allUpToDate = allergens.every(
    (allergen) => allergen.paused || !allergen.lastFedAt || (allergen.daysAgo || 0) < 7
  )

  return (
    <div className="space-y-3">
      {allUpToDate && allergens.some((a) => a.lastFedAt) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">{t('empty.allUpToDate')}</p>
        </div>
      )}

      <div className="space-y-2">
        {sortedAllergens.map((allergen) => (
          <AllergenCard
            key={allergen.id}
            allergen={allergen}
            onClick={() => handleAllergenClick(allergen)}
          />
        ))}
      </div>

      {selectedAllergen && (
        <FeedingLogModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          allergen={selectedAllergen}
        />
      )}
    </div>
  )
}
