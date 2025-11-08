import { useState } from 'react'
import type { AllergenEntry, AllergenDay } from '../types'
import { Calendar } from './Calendar'
import './AllergenHistory.css'

interface AllergenHistoryProps {
  allergenName: string
  allergenDays: AllergenDay[]
}

export function AllergenHistory({ allergenName, allergenDays }: AllergenHistoryProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
  }

  const handleDayClick = (date: string) => {
    setSelectedDate(date)
  }

  const selectedDayData = allergenDays.find((day) => day.date === selectedDate)

  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  return (
    <div className="allergen-history">
      <div className="history-header">
        <h2>{allergenName} Feeding History</h2>
      </div>

      <div className="month-navigation">
        <button onClick={handlePreviousMonth} className="nav-button">
          ← Previous
        </button>
        <h3>
          {monthName} {year}
        </h3>
        <button onClick={handleNextMonth} className="nav-button">
          Next →
        </button>
      </div>

      <Calendar
        year={year}
        month={month}
        allergenDays={allergenDays}
        onDayClick={handleDayClick}
        selectedDate={selectedDate}
      />

      <div className="legend">
        <div className="legend-item">
          <span className="legend-marker normal">•</span>
          <span>Normal feeding</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker reaction">★</span>
          <span>Reaction occurred</span>
        </div>
      </div>

      {selectedDayData && (
        <div className="day-details">
          <h3>Entries for {selectedDate}</h3>
          <div className="entries-list">
            {selectedDayData.entries.map((entry: AllergenEntry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <span className="entry-allergen">{entry.allergen}</span>
                  {entry.hasReaction && (
                    <span className={`reaction-badge ${entry.reactionSeverity || 'mild'}`}>
                      {entry.reactionSeverity || 'Reaction'}
                    </span>
                  )}
                </div>
                {entry.notes && <p className="entry-notes">{entry.notes}</p>}
                {entry.time && <span className="entry-time">{entry.time}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
