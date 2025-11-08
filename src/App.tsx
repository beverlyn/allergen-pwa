import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider, useApp } from './contexts/AppContext'
import { initializeDatabase } from './db'
import { Onboarding } from './components/onboarding/Onboarding'
import { AllergenList } from './components/allergen/AllergenList'
import { HistoryView } from './components/history/HistoryView'
import { SettingsPage } from './components/settings/SettingsPage'
import { Navigation } from './components/common/Navigation'
import { ToastContainer } from './components/common'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
})

type Page = 'home' | 'history' | 'settings'

function AppContent() {
  const { hasCompletedOnboarding, toasts, removeToast } = useApp()
  const [currentPage, setCurrentPage] = useState<Page>('home')

  if (!hasCompletedOnboarding) {
    return <Onboarding />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <span>🍽️</span>
            <span>Baby Allergen Tracker</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 pb-24">
        {currentPage === 'home' && <AllergenList />}
        {currentPage === 'history' && <HistoryView />}
        {currentPage === 'settings' && <SettingsPage />}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
