import { AllergenHistory } from './components/AllergenHistory'
import { AllergenEntry } from './types'
import './App.css'

// Sample data for demonstration
const sampleEntries: AllergenEntry[] = [
  {
    id: '1',
    allergen: 'Peanuts',
    date: new Date(2025, 10, 5), // Nov 5, 2025
    hadReaction: false,
    notes: 'Small amount in smoothie'
  },
  {
    id: '2',
    allergen: 'Peanuts',
    date: new Date(2025, 10, 7), // Nov 7, 2025
    hadReaction: true,
    notes: 'Hives appeared 30 minutes after eating'
  },
  {
    id: '3',
    allergen: 'Peanuts',
    date: new Date(2025, 10, 3), // Nov 3, 2025
    hadReaction: false,
    notes: 'Peanut butter on toast'
  },
  {
    id: '4',
    allergen: 'Peanuts',
    date: new Date(2025, 10, 10), // Nov 10, 2025
    hadReaction: false,
    notes: 'Mixed into oatmeal'
  },
  {
    id: '5',
    allergen: 'Peanuts',
    date: new Date(2025, 10, 12), // Nov 12, 2025
    hadReaction: false
  },
  {
    id: '6',
    allergen: 'Peanuts',
    date: new Date(2025, 10, 15), // Nov 15, 2025
    hadReaction: true,
    notes: 'Mild skin reaction, consulted doctor'
  },
  {
    id: '7',
    allergen: 'Peanuts',
    date: new Date(2025, 9, 28), // Oct 28, 2025
    hadReaction: false,
    notes: 'Started peanut introduction'
  },
  {
    id: '8',
    allergen: 'Peanuts',
    date: new Date(2025, 9, 30), // Oct 30, 2025
    hadReaction: false
  }
];

function App() {
  return (
    <div className="app">
      <AllergenHistory allergen="Peanuts" entries={sampleEntries} />
    </div>
  )
}

export default App
