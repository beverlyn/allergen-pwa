import { useState, useMemo } from 'react';
import { AllergenEntry, AllergenDay } from '../types';
import { Calendar } from './Calendar';
import './AllergenHistory.css';

interface AllergenHistoryProps {
  allergen: string;
  entries: AllergenEntry[];
}

export function AllergenHistory({ allergen, entries }: AllergenHistoryProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());

  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const allergenDays = useMemo(() => {
    const daysMap = new Map<string, AllergenDay>();

    entries.forEach(entry => {
      const dateKey = formatDateKey(entry.date);
      const existingDay = daysMap.get(dateKey);

      if (existingDay) {
        existingDay.entries.push(entry);
        if (entry.hadReaction) {
          existingDay.hasReaction = true;
        }
      } else {
        daysMap.set(dateKey, {
          date: entry.date,
          entries: [entry],
          hasReaction: entry.hadReaction
        });
      }
    });

    return daysMap;
  }, [entries]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedDayEntries = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = formatDateKey(selectedDate);
    return allergenDays.get(dateKey)?.entries || [];
  }, [selectedDate, allergenDays]);

  const handlePreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="allergen-history">
      <header className="history-header">
        <h1>{allergen} History</h1>
        <p className="history-subtitle">
          Track feeding frequency and reactions at a glance
        </p>
      </header>

      <div className="calendar-controls">
        <button onClick={handlePreviousMonth} className="nav-button">
          ← Previous
        </button>
        <button onClick={handleNextMonth} className="nav-button">
          Next →
        </button>
      </div>

      <Calendar
        year={viewYear}
        month={viewMonth}
        allergenDays={allergenDays}
        onDayClick={handleDayClick}
      />

      {selectedDate && (
        <div className="day-details">
          <h3>{formatDate(selectedDate)}</h3>
          {selectedDayEntries.length > 0 ? (
            <div className="entries-list">
              {selectedDayEntries.map(entry => (
                <div key={entry.id} className={`entry-card ${entry.hadReaction ? 'reaction' : ''}`}>
                  <div className="entry-header">
                    <span className="entry-allergen">{entry.allergen}</span>
                    {entry.hadReaction && (
                      <span className="reaction-badge">★ Reaction</span>
                    )}
                  </div>
                  {entry.notes && (
                    <p className="entry-notes">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-entries">No entries for this day</p>
          )}
        </div>
      )}

      <div className="legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="marker normal">•</span>
            <span>Fed (no reaction)</span>
          </div>
          <div className="legend-item">
            <span className="marker reaction">★</span>
            <span>Fed (with reaction)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
