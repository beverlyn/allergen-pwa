// Validation utilities

import type { FeedingLog } from '../types'
import { isFutureDate, isValidDate } from './date'

export interface ValidationError {
  field: string
  message: string
}

export function validateFeedingLog(
  log: Partial<FeedingLog>
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  // Date is required
  if (!log.date) {
    errors.push({ field: 'date', message: 'Date is required' })
  } else {
    // Date must be valid
    if (!isValidDate(log.date)) {
      errors.push({ field: 'date', message: 'Invalid date' })
    }
    // Date cannot be in the future
    if (isFutureDate(log.date)) {
      errors.push({ field: 'date', message: 'Date cannot be in the future' })
    }
  }

  // Allergen is required
  if (!log.allergen) {
    errors.push({ field: 'allergen', message: 'Allergen is required' })
  }

  // If hasReaction is true, reactionSeverity is required
  if (log.hasReaction && !log.reactionSeverity) {
    errors.push({ field: 'reactionSeverity', message: 'Reaction severity is required when reaction is reported' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateBabyName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Baby name is required' }
  }
  if (name.length > 50) {
    return { valid: false, error: 'Baby name must be less than 50 characters' }
  }
  return { valid: true }
}

export function validateBirthdate(birthdate: string): { valid: boolean; error?: string } {
  if (!birthdate) {
    return { valid: false, error: 'Birthdate is required' }
  }
  if (!isValidDate(birthdate)) {
    return { valid: false, error: 'Invalid birthdate' }
  }
  if (isFutureDate(birthdate)) {
    return { valid: false, error: 'Birthdate cannot be in the future' }
  }
  return { valid: true }
}
