# Personal Account Web Application

This is a React web application converted from the original React Native Personal Account app. It provides a web-based interface for managing personal finances with income and expense tracking.

## Features

- **Dashboard**: Overview of income vs expenses with pie charts and category breakdowns
- **Income/Expense Management**: Track and manage financial entries
- **Category Management**: Organize entries by custom categories
- **Reports & Analytics**: View financial reports and trends
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Recharts** - Data visualization and charts
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client for API calls
- **js-cookie** - Cookie management for storage

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd personal-account-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── graph/           # Chart and graph components
│   └── ...
├── screens/             # Page components
│   ├── DataEntry/       # Entry management screens
│   ├── Graphs/          # Analytics and charts
│   └── ...
├── navigation/          # Routing configuration
├── modals/             # Modal dialogs
├── databasehandler/    # API and data management
├── styles/             # Global styles and themes
├── utils/              # Utility functions
└── App.jsx            # Main application component
```

## Configuration

### API Endpoint Configuration

The application uses cookies to store the API endpoint. You can configure this through the Configuration screen or by directly setting the cookie:

```javascript
// Set API endpoint
document.cookie = "IP=your-api-endpoint; expires=365; path=/";
```

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_BASE_URL=http://your-api-server:port
VITE_APP_TITLE=Personal Account
```

## Key Differences from React Native Version

1. **Navigation**: Uses React Router instead of React Navigation
2. **Storage**: Uses cookies instead of AsyncStorage
3. **Charts**: Uses Recharts instead of react-native-charts-wrapper
4. **Styling**: Uses CSS and styled-components instead of StyleSheet
5. **Modals**: Uses HTML modals instead of React Native Modal component
6. **Icons**: Uses emoji and CSS instead of react-native-vector-icons

## Development

### Adding New Screens

1. Create a new component in the appropriate `screens/` subdirectory
2. Add the route in `src/navigation/MainNavigation.jsx`
3. Add navigation links in the appropriate navigation components

### Adding New Components

1. Create the component file in the appropriate `components/` directory
2. Create corresponding CSS file if needed
3. Export the component and import where needed

### Styling Guidelines

- Use CSS modules or styled-components for component-specific styles
- Follow the existing color scheme defined in `src/styles/colors.js`
- Ensure responsive design for mobile and desktop
- Use the global utility classes defined in `src/index.css`

## API Integration

The application expects a REST API with the following endpoints:

- `GET /api/summary/*` - Summary and analytics data
- `GET /api/entry/*` - Entry management
- `GET /api/category/*` - Category management
- `GET /api/user/*` - User management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License - see the original project for details.

## Support

For issues and questions, please refer to the original React Native project documentation or create an issue in the repository.