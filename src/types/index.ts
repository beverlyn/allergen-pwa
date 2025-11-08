// Core type definitions for Baby Allergen Tracker

export type ReactionSeverity = 'mild' | 'moderate' | 'severe'

export type AllergenType =
  | 'egg'
  | 'dairy'
  | 'soy'
  | 'wheat'
  | 'peanut'
  | 'tree-nut'
  | 'sesame'
  | 'fish'
  | 'seafood'

export type Theme = 'light' | 'dark'

export type Language = 'en' | 'ja'

export interface Baby {
  id: string
  name: string
  birthdate: string // ISO 8601
  createdAt: string
  modifiedAt: string
}

export interface Allergen {
  id: string
  type: AllergenType
  name: string
  emoji: string
  paused: boolean
  firstIntroducedAt?: string // ISO 8601, derived from first feeding log
  lastFedAt?: string // ISO 8601, derived from last feeding log
  daysAgo?: number // Calculated field
  createdAt: string
  modifiedAt: string
}

export interface FeedingLog {
  id: string
  allergen: AllergenType
  date: string // ISO 8601
  amount?: string
  hasReaction: boolean
  reactionSeverity?: ReactionSeverity // required if hasReaction = true
  notes?: string
  createdAt: string
  modifiedAt: string
}

export interface Settings {
  theme: Theme
  language: Language
  notificationsEnabled: boolean
  notificationThresholdDays: number
  notificationTime: string // HH:mm format
}

export interface AllergenWithStats extends Allergen {
  feedingCount: number
  lastReaction?: FeedingLog
}

// Initial allergen data
export const DEFAULT_ALLERGENS: Omit<Allergen, 'id' | 'createdAt' | 'modifiedAt'>[] = [
  { type: 'egg', name: 'Egg', emoji: '🥚', paused: false },
  { type: 'dairy', name: 'Dairy', emoji: '🥛', paused: false },
  { type: 'soy', name: 'Soy', emoji: '🫘', paused: false },
  { type: 'wheat', name: 'Wheat', emoji: '🌾', paused: false },
  { type: 'peanut', name: 'Peanut', emoji: '🥜', paused: false },
  { type: 'tree-nut', name: 'Tree Nut', emoji: '🌰', paused: false },
  { type: 'sesame', name: 'Sesame', emoji: '🌱', paused: false },
  { type: 'fish', name: 'Fish', emoji: '🐟', paused: false },
  { type: 'seafood', name: 'Seafood', emoji: '🦐', paused: false },
]

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  language: 'en',
  notificationsEnabled: false,
  notificationThresholdDays: 7,
  notificationTime: '09:00',
}
