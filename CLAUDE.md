# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React web application for managing personal finances (income and expense tracking). It was converted from a React Native mobile app to a web application using React, Vite, and styled-components.

## Development Commands

### Basic Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production (TypeScript check + Vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Docker Commands
```bash
docker build --build-arg VITE_API_URL=<your-api-url> -t personal-account-web .
docker run -p 80:80 personal-account-web
```

## Architecture

### Technology Stack
- **React 19** with Vite for fast development
- **React Router** for client-side routing
- **Recharts** for data visualization
- **Styled Components** for CSS-in-JS
- **Axios** with fetch API for HTTP requests
- **Tailwind CSS** for utility styling
- **TypeScript** (`.tsx`) and JavaScript (`.jsx`) mixed codebase

### Core Architecture Patterns

#### Singleton Pattern for Data Management
All handler classes use the singleton pattern to ensure single instances across the application:
- `WebStorage` - manages localStorage for user credentials and JWT tokens
- `API` - central API endpoint configuration
- `EntryDBHandler` - handles entry-related database operations
- Similar handlers for categories, recurring entries, and users

#### Authentication Flow
1. **AuthContext** (`src/navigation/AuthContext.jsx`): Manages global auth state using React Context
2. **ProtectedRoute** (`src/navigation/ProtectedRoutes.jsx`): Guards routes requiring authentication
3. **WebStorage** (`src/databasehandler/WebStorage.js`): Persists user and JWT token in localStorage
4. All API requests include JWT token in `Authorization: Bearer <token>` header

#### API Architecture
The `API` class (`src/utils/api.js`) creates nested API classes:
- `api.entry.*` - Entry CRUD operations
- `api.summary.*` - Analytics and summary data
- `api.category.*` - Category management
- `api.user.*` - User operations
- `api.recurring.*` - Recurring entry management

All API calls:
- Use singleton WebStorage instance for base URL (`storage.IP`)
- Include `ngrok-skip-browser-warning: true` header (for development tunnels)
- Include JWT token for authorization
- Return Promises with JSON responses

#### Data Flow Pattern
Screen → Handler → API → Backend → Response → Screen
- **Screens** render UI and manage local state
- **Handlers** (`src/databasehandler/*`) make API calls using fetch
- **API class** provides endpoint URLs based on WebStorage IP
- Backend returns JSON with `{success: boolean, message: string, data: any}` structure

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   └── graph/          # Chart components (Recharts)
├── screens/            # Page-level components
│   ├── DataEntry/      # Add/Update entry screens
│   ├── DifferenceScreen/ # Income vs Expense analysis
│   ├── Login/          # Authentication
│   ├── Config/         # App configuration
│   └── ...
├── navigation/         # Routing and authentication
│   ├── MainNavigation.jsx   # Route definitions
│   ├── AuthContext.jsx      # Auth state management
│   ├── ProtectedRoutes.jsx  # Route guards
│   └── Header.jsx           # Navigation header
├── modals/            # Modal dialogs (date pickers, filters, forms)
├── databasehandler/   # API integration layer (handlers)
├── utils/             # Utilities
│   ├── api.js         # API endpoint configuration
│   ├── constants.js   # App constants
│   └── converters.js  # Data conversion utilities
└── styles/            # Global styles and color definitions
```

### Key Architectural Notes

1. **Mixed File Extensions**: The codebase uses both `.jsx` and `.tsx` files. The `.tsx` files are minimal stubs; actual implementation is in `.jsx` files.

2. **Storage Migration**: Unlike the React Native version:
   - Uses `localStorage` instead of `AsyncStorage`
   - Managed through WebStorage singleton class
   - Keys: `USER` and `TOKEN`

3. **Navigation**: React Router with protected routes pattern
   - Login screen at `/login` (public)
   - All other routes require authentication
   - Layout component wraps authenticated routes with Header

4. **API Base URL**: Hardcoded in `WebStorage.js` as `this.IP = "http://10.0.0.172:8081"`
   - Should be configured per environment
   - Used by all API endpoint builders

5. **Color System**: Centralized in `src/styles/colors.js`
   - Separate color definitions for Income (green) and Expense (red)
   - Consistent color scheme across all screens

6. **Entry Data Model**: Entries have:
   - `id`, `title`, `description`, `amount`, `date`
   - `category` object with `id`
   - `username` for multi-user support

7. **Category Filtering**: Many screens support category-based filtering
   - Categories are comma-separated strings in API calls
   - "ALL" indicates no filtering

## Common Development Patterns

### Adding a New Screen
1. Create component in appropriate `src/screens/` subdirectory
2. Add route in `MainNavigation.jsx` wrapped with `<Layout>` and `<ProtectedRoute>`
3. Import and add navigation link in Header or other navigation component

### Making API Calls
```javascript
const handler = new EntryDBHandler();
handler.getRecentEntries()
  .then(json => {
    if (json.success) {
      // Handle data
    }
  })
  .catch(error => console.error(error));
```

### Using Colors
```javascript
import { TextColors, ButtonColors } from '../styles/colors';
// Use TextColors.income, TextColors.expense, etc.
```

## Important Notes

- Branch structure: `web` branch for web development, `main` for production
- The app expects a REST API backend with specific endpoint structure
- All dates use ISO format or custom date formatting from `converters.js`
- Multi-user support via username parameter in API calls (default: "ALL")
- Images can be uploaded and stored via entry image endpoints
