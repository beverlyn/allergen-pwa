// Date utility functions

export function formatDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function getDaysAgo(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function formatDaysAgo(days: number, language: 'en' | 'ja'): string {
  if (days === 0) {
    return language === 'en' ? 'Today' : '今日'
  } else if (days === 1) {
    return language === 'en' ? '1 day ago' : '1日前'
  } else {
    return language === 'en' ? `${days} days ago` : `${days}日前`
  }
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

export function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString)
  const now = new Date()
  return date > now
}

export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getToday(): string {
  return toISODateString(new Date())
}
