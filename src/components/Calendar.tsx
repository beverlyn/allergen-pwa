import type { AllergenDay } from '../types'
import './Calendar.css'

interface CalendarProps {
  year: number
  month: number
  allergenDays: AllergenDay[]
  onDayClick: (date: string) => void
  selectedDate: string | null
}

export function Calendar({ year, month, allergenDays, onDayClick, selectedDate }: CalendarProps) {
  // Create a map for quick lookup
  const dayMap = new Map(allergenDays.map((day) => [day.date, day]))

  // Get the first day of the month and total days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay() // 0 = Sunday

  // Generate calendar grid
  const calendarDays: (number | null)[] = []

  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const getDayData = (day: number | null): AllergenDay | undefined => {
    if (day === null) return undefined
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dayMap.get(dateStr)
  }

  const formatDate = (day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="day-name">Sun</div>
        <div className="day-name">Mon</div>
        <div className="day-name">Tue</div>
        <div className="day-name">Wed</div>
        <div className="day-name">Thu</div>
        <div className="day-name">Fri</div>
        <div className="day-name">Sat</div>
      </div>
      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day empty"></div>
          }

          const dayData = getDayData(day)
          const dateStr = formatDate(day)
          const isSelected = selectedDate === dateStr
          const hasEntries = dayData && dayData.entries.length > 0

          return (
            <div
              key={day}
              className={`calendar-day ${hasEntries ? 'has-entries' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => hasEntries && onDayClick(dateStr)}
            >
              <span className="day-number">{day}</span>
              {hasEntries && (
                <span className="day-marker">
                  {dayData.hasReaction ? '★' : '•'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
