import { AllergenDay } from '../types';
import './Calendar.css';

interface CalendarProps {
  year: number;
  month: number;
  allergenDays: Map<string, AllergenDay>;
  onDayClick: (date: Date) => void;
}

export function Calendar({ year, month, allergenDays, onDayClick }: CalendarProps) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const renderDay = (day: number) => {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    const allergenDay = allergenDays.get(dateKey);
    const hasEntries = allergenDay && allergenDay.entries.length > 0;
    const hasReaction = allergenDay?.hasReaction;

    return (
      <div
        key={day}
        className={`calendar-day ${hasEntries ? 'has-entries' : ''}`}
        onClick={() => hasEntries && onDayClick(date)}
      >
        <span className="day-number">{day}</span>
        {hasEntries && (
          <div className="day-markers">
            <span className={`marker ${hasReaction ? 'reaction' : 'normal'}`}>
              {hasReaction ? '★' : '•'}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderEmptyDay = (index: number) => {
    return <div key={`empty-${index}`} className="calendar-day empty"></div>;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>{monthNames[month]} {year}</h2>
      </div>
      <div className="calendar-grid">
        {dayNames.map(name => (
          <div key={name} className="calendar-day-name">{name}</div>
        ))}
        {Array.from({ length: startingDayOfWeek }, (_, i) => renderEmptyDay(i))}
        {Array.from({ length: daysInMonth }, (_, i) => renderDay(i + 1))}
      </div>
    </div>
  );
}
