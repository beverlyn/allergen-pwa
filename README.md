# Baby Allergen Tracker

A privacy-focused Progressive Web App (PWA) for tracking allergen introduction and feeding frequency for babies.

## Overview

Baby Allergen Tracker helps parents monitor when their baby last ate common allergens, ensuring consistent exposure while tracking any reactions. The app is designed to be simple, private, and works offline-first.

## Features

- **Track 9 Major Allergens**: Egg, Dairy, Soy, Wheat, Peanut, Tree Nut, Sesame, Fish, and Seafood
- **Feeding Log**: Record each feeding with date, amount, reactions, and notes
- **Visual Timeline**: See "days since last fed" for each allergen at a glance
- **History View**: Complete timeline of all feedings with filtering options
- **Reaction Tracking**: Log reactions with severity levels (mild, moderate, severe)
- **Weekly Reminders**: Optional notifications for overdue allergens
- **Data Export**: Export all data to CSV for sharing with healthcare providers
- **Privacy-First**: All data stored locally on your device - no tracking, no ads
- **Offline Support**: Full functionality without internet connection
- **Bilingual**: English and Japanese (日本語) support

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vite** | Build tool and dev server |
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Dexie.js** | IndexedDB wrapper for local storage |
| **React Query** | Data fetching and state management |
| **react-i18next** | Internationalization |
| **vite-plugin-pwa** | Progressive Web App support |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/         # React components
│   ├── allergen/      # Allergen-related components
│   ├── common/        # Shared UI components
│   ├── history/       # History view components
│   ├── onboarding/    # Onboarding flow components
│   └── settings/      # Settings page components
├── contexts/          # React contexts
├── db/                # IndexedDB schema and utilities
├── hooks/             # Custom React hooks
├── i18n/              # Internationalization
│   └── locales/       # Translation files (en, ja)
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Key Features

### Data Model

The app uses IndexedDB for local storage with the following entities:

- **Baby**: Profile information (name, birthdate)
- **Allergen**: Each of the 9 allergens with tracking data
- **FeedingLog**: Individual feeding records
- **Settings**: App preferences (theme, language, notifications)

### Privacy & Security

- **Local-First**: All data stored in IndexedDB on your device
- **No Tracking**: No analytics, no third-party services
- **No Ads**: Clean, focused interface
- **GDPR Compliant**: You own and control your data

### Accessibility

- WCAG AA color contrast
- Dynamic text scaling
- VoiceOver/screen reader support
- Large tap targets for mobile use

## Medical Disclaimer

This app is for informational purposes only and does not provide medical advice. Always consult your pediatrician before introducing or managing food allergens.

## Development

### Available Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Adding New Features

The app is designed to be extensible. Future enhancements could include:

- Multi-baby profiles
- Custom allergen additions
- Chart visualizations
- Photo uploads for meals
- Cloud sync (optional)
- PDF export for pediatricians

## Browser Support

The app works on all modern browsers that support:
- IndexedDB
- Service Workers
- ES2020+

Tested on:
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## Contact

For questions or feedback, please open an issue on GitHub.
