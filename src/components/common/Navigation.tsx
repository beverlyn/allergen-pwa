import { useTranslation } from 'react-i18next'

type Page = 'home' | 'history' | 'settings'

interface NavigationProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { t } = useTranslation()

  const navItems: Array<{ page: Page; icon: string; label: string }> = [
    { page: 'home', icon: '🏠', label: 'Home' },
    { page: 'history', icon: '📝', label: t('history.title') },
    { page: 'settings', icon: '⚙️', label: t('settings.title') },
  ]

  return (
    <nav className="bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onPageChange(item.page)}
              className={`
                flex-1 flex flex-col items-center justify-center py-3 px-2
                transition-colors tap-highlight-none
                ${
                  currentPage === item.page
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }
              `}
              aria-label={item.label}
              aria-current={currentPage === item.page ? 'page' : undefined}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
