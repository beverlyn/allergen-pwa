// Custom hooks for database operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, addFeedingLog, updateFeedingLog, deleteFeedingLog, getAllergensWithStats, exportToCSV } from '../db'
import type { Baby, Allergen, FeedingLog, Settings, AllergenType } from '../types'

// Query keys
export const QUERY_KEYS = {
  baby: ['baby'] as const,
  allergens: ['allergens'] as const,
  feedingLogs: ['feedingLogs'] as const,
  allergenLogs: (allergen: string) => ['feedingLogs', allergen] as const,
  settings: ['settings'] as const,
}

// Baby hooks
export function useBaby() {
  return useQuery({
    queryKey: QUERY_KEYS.baby,
    queryFn: async () => {
      const baby = await db.babies.toCollection().first()
      return baby || null
    },
  })
}

export function useUpdateBaby() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (baby: Partial<Baby> & { id: string }) => {
      await db.babies.update(baby.id, {
        ...baby,
        modifiedAt: new Date().toISOString(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.baby })
    },
  })
}

export function useCreateBaby() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (baby: Omit<Baby, 'id' | 'createdAt' | 'modifiedAt'>) => {
      const now = new Date().toISOString()
      await db.babies.add({
        ...baby,
        id: 'baby-profile',
        createdAt: now,
        modifiedAt: now,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.baby })
    },
  })
}

// Allergen hooks
export function useAllergens() {
  return useQuery({
    queryKey: QUERY_KEYS.allergens,
    queryFn: getAllergensWithStats,
  })
}

export function useUpdateAllergen() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Allergen> }) => {
      await db.allergens.update(id, {
        ...updates,
        modifiedAt: new Date().toISOString(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allergens })
    },
  })
}

// Feeding log hooks
export function useFeedingLogs(allergenType?: AllergenType) {
  return useQuery({
    queryKey: allergenType ? QUERY_KEYS.allergenLogs(allergenType) : QUERY_KEYS.feedingLogs,
    queryFn: async () => {
      if (allergenType) {
        return await db.feedingLogs
          .where('allergen')
          .equals(allergenType)
          .reverse()
          .sortBy('date')
      }
      return await db.feedingLogs.orderBy('date').reverse().toArray()
    },
  })
}

export function useAddFeedingLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addFeedingLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feedingLogs })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allergens })
    },
  })
}

export function useUpdateFeedingLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FeedingLog> }) =>
      updateFeedingLog(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feedingLogs })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allergens })
    },
  })
}

export function useDeleteFeedingLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFeedingLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feedingLogs })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allergens })
    },
  })
}

// Settings hooks
export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: async () => {
      const settings = await db.settings.get('app-settings')
      return settings || null
    },
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<Settings>) => {
      await db.settings.update('app-settings', updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings })
    },
  })
}

// Export hooks
export function useExportCSV() {
  return useMutation({
    mutationFn: async () => {
      const csv = await exportToCSV()
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `allergen-tracker-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    },
  })
}

// Clear all data
export function useClearAllData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await db.feedingLogs.clear()
      await db.allergens.clear()
      await db.babies.clear()
      // Reinitialize allergens
      const { initializeDatabase } = await import('../db')
      await initializeDatabase()
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}
