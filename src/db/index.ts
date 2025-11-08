import Dexie, { type EntityTable } from 'dexie'
import type { Baby, Allergen, FeedingLog, Settings } from '../types'
import { DEFAULT_ALLERGENS, DEFAULT_SETTINGS } from '../types'

// Define the database
class AllergenDatabase extends Dexie {
  babies!: EntityTable<Baby, 'id'>
  allergens!: EntityTable<Allergen, 'id'>
  feedingLogs!: EntityTable<FeedingLog, 'id'>
  settings!: EntityTable<Settings & { id: string }, 'id'>

  constructor() {
    super('AllergenTrackerDB')

    this.version(1).stores({
      babies: 'id, name, birthdate, createdAt, modifiedAt',
      allergens: 'id, type, name, paused, firstIntroducedAt, lastFedAt, createdAt, modifiedAt',
      feedingLogs: 'id, allergen, date, hasReaction, createdAt, modifiedAt',
      settings: 'id',
    })
  }
}

export const db = new AllergenDatabase()

// Initialize default data
export async function initializeDatabase() {
  // Check if allergens are already initialized
  const allergenCount = await db.allergens.count()

  if (allergenCount === 0) {
    // Initialize default allergens
    const now = new Date().toISOString()
    const allergens: Allergen[] = DEFAULT_ALLERGENS.map((allergen) => ({
      ...allergen,
      id: `allergen-${allergen.type}`,
      createdAt: now,
      modifiedAt: now,
    }))

    await db.allergens.bulkAdd(allergens)
  }

  // Check if settings exist
  const settingsCount = await db.settings.count()

  if (settingsCount === 0) {
    // Initialize default settings
    await db.settings.add({
      ...DEFAULT_SETTINGS,
      id: 'app-settings',
    })
  }
}

// Helper functions for calculating derived fields
export async function updateAllergenStats(allergenType: string) {
  const logs = await db.feedingLogs
    .where('allergen')
    .equals(allergenType)
    .sortBy('date')

  if (logs.length === 0) {
    await db.allergens.where('type').equals(allergenType).modify({
      firstIntroducedAt: undefined,
      lastFedAt: undefined,
      daysAgo: undefined,
    })
    return
  }

  const firstLog = logs[0]
  const lastLog = logs[logs.length - 1]
  const now = new Date()
  const lastFedDate = new Date(lastLog.date)
  const daysAgo = Math.floor((now.getTime() - lastFedDate.getTime()) / (1000 * 60 * 60 * 24))

  await db.allergens.where('type').equals(allergenType).modify({
    firstIntroducedAt: firstLog.date,
    lastFedAt: lastLog.date,
    daysAgo,
  })
}

// Export utility functions
export async function addFeedingLog(log: Omit<FeedingLog, 'id' | 'createdAt' | 'modifiedAt'>) {
  const now = new Date().toISOString()
  const id = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  await db.feedingLogs.add({
    ...log,
    id,
    createdAt: now,
    modifiedAt: now,
  })

  // Update allergen stats
  await updateAllergenStats(log.allergen)
}

export async function updateFeedingLog(
  id: string,
  updates: Partial<Omit<FeedingLog, 'id' | 'createdAt' | 'modifiedAt'>>
) {
  const log = await db.feedingLogs.get(id)
  if (!log) throw new Error('Feeding log not found')

  await db.feedingLogs.update(id, {
    ...updates,
    modifiedAt: new Date().toISOString(),
  })

  // Update allergen stats
  await updateAllergenStats(log.allergen)
}

export async function deleteFeedingLog(id: string) {
  const log = await db.feedingLogs.get(id)
  if (!log) throw new Error('Feeding log not found')

  await db.feedingLogs.delete(id)

  // Update allergen stats
  await updateAllergenStats(log.allergen)
}

export async function getAllergensWithStats() {
  const allergens = await db.allergens.toArray()

  // Recalculate daysAgo for all allergens
  const now = new Date()

  return allergens.map(allergen => {
    if (allergen.lastFedAt) {
      const lastFedDate = new Date(allergen.lastFedAt)
      const daysAgo = Math.floor((now.getTime() - lastFedDate.getTime()) / (1000 * 60 * 60 * 24))
      return { ...allergen, daysAgo }
    }
    return allergen
  })
}

export async function exportToCSV() {
  const baby = await db.babies.toCollection().first()
  const logs = await db.feedingLogs.orderBy('date').toArray()

  const headers = ['Baby Name', 'Baby Birthdate', 'Date', 'Allergen', 'Amount', 'Reaction', 'Severity', 'Notes']
  const rows = logs.map(log => [
    baby?.name || '',
    baby?.birthdate || '',
    log.date,
    log.allergen,
    log.amount || '',
    log.hasReaction ? 'Yes' : 'No',
    log.reactionSeverity || '',
    log.notes || '',
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  // Add UTF-8 BOM
  const BOM = '\uFEFF'
  return BOM + csv
}
