import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initializeDatabase } from './db'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
})

function App() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize the database on app load
    initializeDatabase()
      .then(() => {
        setIsInitialized(true)
      })
      .catch((error) => {
        console.error('Failed to initialize database:', error)
      })
  }, [])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-base">
        <header className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Baby Allergen Tracker
            </h1>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Welcome to Baby Allergen Tracker
            </h2>
            <p className="text-gray-600">
              Your app is initialized and ready to use!
            </p>
            <p className="text-sm text-gray-500 mt-4">
              The project structure is set up. Start building your components!
            </p>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
