import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useSettings, useUpdateSettings, useBaby } from '../hooks/useDatabase'
import type { Theme, Language } from '../types'
import { useTranslation } from 'react-i18next'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface AppContextValue {
  // Theme & Language
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void

  // Onboarding
  hasCompletedOnboarding: boolean
  completeOnboarding: () => void

  // Toast notifications
  toasts: Toast[]
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { data: settings } = useSettings()
  const { data: baby } = useBaby()
  const updateSettings = useUpdateSettings()
  const { i18n } = useTranslation()

  const [theme, setThemeState] = useState<Theme>('light')
  const [language, setLanguageState] = useState<Language>('en')
  const [toasts, setToasts] = useState<Toast[]>([])

  // Initialize theme and language from settings
  useEffect(() => {
    if (settings) {
      setThemeState(settings.theme)
      setLanguageState(settings.language)
      i18n.changeLanguage(settings.language)
    }
  }, [settings, i18n])

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    updateSettings.mutate({ theme: newTheme })
  }, [updateSettings])

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage)
    i18n.changeLanguage(newLanguage)
    updateSettings.mutate({ language: newLanguage })
  }, [updateSettings, i18n])

  const hasCompletedOnboarding = !!baby

  const completeOnboarding = useCallback(() => {
    // This will be called after baby profile is created
    // The hasCompletedOnboarding will automatically update when baby data changes
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const value: AppContextValue = {
    theme,
    language,
    setTheme,
    setLanguage,
    hasCompletedOnboarding,
    completeOnboarding,
    toasts,
    showToast,
    removeToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
