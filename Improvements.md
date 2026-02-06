# Code Quality Improvement Plan - Personal Account Web App

## Overview

This plan addresses React best practices violations across navigation, state management, form handling, API calls, and authentication in the Personal Account web application.

**Codebase:** React 19 + Vite + React Router v7 + 37 JSX files + TypeScript config (unused)

**Critical Issues Found:**
- 🔴 **Security:** JWT in localStorage (XSS risk), HTTP not HTTPS, incomplete logout
- 🔴 **API:** Fetch used instead of installed axios, no HTTP status checks, promises resolve on failure
- 🟡 **State:** Singleton pattern misused, direct array mutations, missing useEffect cleanup
- 🟡 **Forms:** 54 alert() calls, no validation library, no PropTypes/TypeScript
- 🟡 **Navigation:** Missing null checks on location.state causes crashes

---

## Phase 1: Critical Security & Authentication Fixes

### 1.1 Fix Incomplete Logout + Token Storage

**Problem:** `AuthContext.jsx:23-26` logout doesn't clear localStorage tokens (XSS vulnerability)

**Files to modify:**
- `src/navigation/AuthContext.jsx`
- `src/databasehandler/WebStorage.js`
- `src/utils/api.js`

**Changes:**

1. **WebStorage.js** - Add token cleanup:
```javascript
// Add new method after line 35
clearAuth() {
  this.user = null;
  this.jwtToken = null;
  localStorage.removeItem(this.KEYS.USER);
  localStorage.removeItem(this.KEYS.TOKEN);
}
```

2. **AuthContext.jsx** - Fix logout (line 23-26):
```javascript
const logout = useCallback(() => {
  console.log('Logging out user');
  setUser(null);
  webStorage.clearAuth(); // ADD THIS
  navigate('/login');     // ADD THIS
}, [navigate]);
```

3. **api.js** - Fix logout (line 37-40):
```javascript
logout() {
  this.storage.clearAuth(); // Use new method
}
```

4. **Add logout button in Header.jsx:**
- Add logout button to header navigation
- Call `logout()` from AuthContext
- Redirect to login

**Verification:**
- Click logout → verify localStorage is empty
- Verify redirect to /login works
- Test protected routes after logout

---

### 1.2 Move API URL to Environment Variables

**Problem:** Hardcoded HTTP endpoint `WebStorage.js:10` - security risk, not configurable

**Files to modify:**
- `src/databasehandler/WebStorage.js`
- Create: `.env.development`, `.env.production`
- Create: `src/config/environment.js`

**Changes:**

1. **Create environment config:**
```javascript
// src/config/environment.js
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8081',
  isProduction: import.meta.env.MODE === 'production'
};
```

2. **Create .env files:**
```
# .env.development
VITE_API_URL=http://10.0.0.172:8081

# .env.production
VITE_API_URL=https://your-production-domain.com
```

3. **Update WebStorage.js (line 10):**
```javascript
import { config } from '../config/environment';

constructor() {
  // ...
  this.IP = config.apiUrl; // Replace hardcoded value
  // ...
}
```

**Verification:**
- Test dev build connects to dev server
- Test production build enforces HTTPS
- Verify error if env variable missing

---

### 1.3 Add 401 Response Handling

**Problem:** No interceptor for expired tokens - users see silent failures

**Files to modify:**
- Create: `src/services/httpClient.js`
- `src/utils/api.js`
- All handler files to use axios instead of fetch

**Changes:**

1. **Create axios client with interceptor:**
```javascript
// src/services/httpClient.js
import axios from 'axios';
import { config } from '../config/environment';

export const httpClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

// Request interceptor - add token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

2. **Update api.js to use httpClient:**
- Replace fetch URL builders with axios methods
- Remove manual header methods (interceptor handles it)

**Verification:**
- Test API call with expired token
- Verify auto-logout on 401 response
- Test successful API calls still work

---

## Phase 2: Fix API Layer & Error Handling

### 2.1 Migrate from Fetch to Axios

**Problem:** Axios installed but unused, fetch has no HTTP status checks

**Files to modify (in order):**
1. `src/databasehandler/userhandler.js` (2 methods)
2. `src/databasehandler/categoryhandler.js` (8 methods)
3. `src/databasehandler/recurringhandler.js` (4 methods)
4. `src/databasehandler/entryhandler.js` (21 methods - largest)

**Pattern to apply:**

**Before (entryhandler.js:17-39):**
```javascript
addEntry(entry) {
  return new Promise((resolve, reject) => {
    fetch(this.api.entry.createEntry(), {
      method: 'POST',
      headers: this.api.headerForBody(),
      body: JSON.stringify({...})
    })
    .then(response => response.json())
    .then(json => resolve(json)) // ⚠️ Resolves even on error
    .catch(error => reject(error));
  });
}
```

**After:**
```javascript
import { httpClient } from '../services/httpClient';

async addEntry(entry) {
  const response = await httpClient.post('/api/entry/create/', {
    title: entry.title,
    description: entry.description,
    amount: parseFloat(entry.amount),
    date: entry.date,
    categoryid: entry.category.id,
    username: entry.username
  });
  return response.data;
}
```

**Benefits:**
- HTTP status errors throw automatically
- No manual header construction
- Cleaner async/await syntax
- Request cancellation support

**Verification:**
- Test all CRUD operations after migration
- Test error scenarios (network failure, 4xx, 5xx)
- Verify no regression in functionality

---

### 2.2 Add Error Boundaries

**Problem:** No error boundaries - React errors crash entire app

**Files to create:**
- `src/components/ErrorBoundary.tsx`

**Files to modify:**
- `src/main.tsx` (wrap root)
- `src/navigation/MainNavigation.jsx` (wrap routes)

**Changes:**

1. **Create ErrorBoundary component:**
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

2. **Wrap app in main.tsx:**
```typescript
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

**Verification:**
- Throw test error in component
- Verify boundary catches and shows fallback UI
- Test reload button works

---

### 2.3 Replace alert() with Toast Notifications

**Problem:** 54 alert() calls block UI and provide poor UX

**Install:**
```bash
npm install react-hot-toast
```

**Files to modify:**
- All screens with alert() calls (Dashboard, EntryList, Login, etc.)

**Pattern:**

**Before:**
```javascript
alert(`ERROR: ${result.message.toUpperCase()}`);
```

**After:**
```javascript
import toast from 'react-hot-toast';

toast.error(result.message);
// or
toast.success('Entry added successfully!');
```

**Setup in App.jsx:**
```javascript
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="App">
        <MainNavigation />
      </div>
    </Router>
  );
}
```

**Verification:**
- Test success and error toasts appear
- Verify toasts don't block user interaction
- Check toast styling matches app theme

---

## Phase 3: Fix State Management Issues

### 3.1 Replace Singleton Pattern with Context/Hooks

**Problem:** All handlers use singleton pattern incorrectly for React

**Files to modify:**
- All files in `src/databasehandler/` (remove singleton checks)
- Create: `src/contexts/ServicesContext.jsx`
- Create: `src/hooks/useServices.js`
- All screens using `new HandlerClass()`

**Changes:**

1. **Create services context:**
```javascript
// src/contexts/ServicesContext.jsx
import React, { createContext, useContext, useMemo } from 'react';
import EntryDBHandler from '../databasehandler/entryhandler';
import CategoryDBHandler from '../databasehandler/categoryhandler';
// ... other handlers

const ServicesContext = createContext(null);

export const ServicesProvider = ({ children }) => {
  const services = useMemo(() => ({
    entry: new EntryDBHandler(),
    category: new CategoryDBHandler(),
    user: new UserDBHandler(),
    recurring: new RecurringDBHandler()
  }), []);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return context;
};
```

2. **Remove singleton from handlers:**
```javascript
// Before (in each handler)
constructor() {
  if (EntryDBHandler._instance) {
    return EntryDBHandler._instance;
  }
  EntryDBHandler._instance = this;
  // ...
}

// After - remove entire check, just:
constructor() {
  this.api = new API();
}
```

3. **Update components:**
```javascript
// Before
const [entryHandler] = useState(new EntryDBHandler());

// After
import { useServices } from '../contexts/ServicesContext';
const { entry: entryHandler } = useServices();
```

4. **Wrap app in provider (App.jsx):**
```javascript
<ServicesProvider>
  <Router>
    <MainNavigation />
  </Router>
</ServicesProvider>
```

**Verification:**
- Test multiple components use same service instance
- Verify no service recreation on re-renders
- Test all CRUD operations work

---

### 3.2 Fix Direct State Mutations

**Problem:** `RecurringScreen.jsx` mutates arrays directly (lines 24, 42, 74)

**File to modify:**
- `src/screens/Recurring/RecurringScreen.jsx`

**Changes:**

```javascript
// Line 24 - ADD operation
// Before:
recurrings.push(recurring);
setRecurrings(recurrings);

// After:
setRecurrings(prev => [...prev, recurring]);

// Line 42 - UPDATE operation
// Before:
recurrings[selectedIndex] = recurring;
setRecurrings(recurrings);

// After:
setRecurrings(prev => prev.map((r, i) =>
  i === selectedIndex ? recurring : r
));

// Line 74 - DELETE operation
// Before:
recurrings.splice(index, 1);
setRecurrings(recurrings);

// After:
setRecurrings(prev => prev.filter((_, i) => i !== index));
```

**Verification:**
- Test create recurring entry
- Test update recurring entry
- Test delete recurring entry
- Verify UI updates correctly

---

### 3.3 Fix useEffect Dependencies & Add Cleanup

**Problem:** Missing dependencies cause stale closures, no request cancellation causes memory leaks

**Files to modify:**
- `src/components/Date.jsx` (line 13-20)
- `src/screens/DataEntry/EntryForm.jsx` (line 30-45)
- `src/screens/DashboardScreen.jsx` (line 80-83)
- All screens with useEffect + API calls

**Pattern:**

**Before (Date.jsx:13-20):**
```javascript
useEffect(() => {
  let total = 0;
  date.entries.map((entry, index) => (
    total += entry.amount
  ));
  setAmount(total);
  passTotal(total);
}, []); // ⚠️ Missing dependencies
```

**After:**
```javascript
useEffect(() => {
  let total = 0;
  date.entries.forEach(entry => {
    total += entry.amount;
  });
  setAmount(total);
  passTotal(total);
}, [date.entries, passTotal]); // ✅ Add dependencies
```

**Add cleanup for API calls (DashboardScreen.jsx:80-83):**
```javascript
useEffect(() => {
  const controller = new AbortController();

  getCategoryData("income", controller.signal);
  getCategoryData("expense", controller.signal);

  return () => controller.abort(); // Cleanup
}, [date]);
```

**Update axios calls to support cancellation:**
```javascript
async getCategoryData(type, signal) {
  const result = await httpClient.get('/api/...', { signal });
  // ...
}
```

**Verification:**
- Run app with React DevTools warnings enabled
- Check no "missing dependency" warnings
- Navigate away during API call - verify no memory leak warnings

---

### 3.4 Add Performance Optimizations

**Problem:** Functions recreated on every render, no memoization

**Files to modify:**
- `src/navigation/AuthContext.jsx` (lines 16-26)
- `src/screens/DataEntry/EntryForm.jsx` (handlers)
- `src/modals/CategoryFilterModal.jsx` (handlers)

**Pattern:**

```javascript
// AuthContext.jsx - Add useCallback
const login = useCallback((user, token) => {
  console.log('Logging in user: ' + user);
  setUser(user);
  webStorage.setToken(token);
  webStorage.setUser(user);
}, []);

const logout = useCallback(() => {
  console.log('Logging out user');
  setUser(null);
  webStorage.clearAuth();
  navigate('/login');
}, [navigate]);
```

**EntryForm.jsx - Memoize handlers:**
```javascript
const handleInputChange = useCallback((field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
}, []);

const handleTypeChange = useCallback((type) => {
  setFormData(prev => ({ ...prev, selectedType: type }));
  getCategories(type);
}, [getCategories]);
```

**Verification:**
- Use React DevTools Profiler
- Measure re-renders before/after
- Verify no functional changes

---

## Phase 4: Navigation & Form Improvements

### 4.1 Fix Null Checks on Navigation State

**Problem:** `UpdateScreen.jsx:12` and `EntryListScreen.jsx` crash if accessed directly

**Files to modify:**
- `src/screens/DataEntry/UpdateScreen.jsx`
- `src/screens/EntryListScreen.jsx`

**Changes:**

```javascript
// UpdateScreen.jsx
import { Navigate } from 'react-router-dom';

function UpdateScreen() {
  const location = useLocation();
  const { entry } = location.state || {}; // Add || {}

  // Add guard at top of component
  if (!entry) {
    return <Navigate to="/recent-entries" replace />;
  }

  // Rest of component...
}
```

**Same pattern for EntryListScreen.jsx**

**Verification:**
- Navigate directly to /update-entry URL
- Verify redirect to /recent-entries
- Test normal flow with state still works

---

### 4.2 Fix Index-Based Keys

**Problem:** `CategoryFilterModal.jsx` uses index as key (lines 76, 104)

**File to modify:**
- `src/modals/CategoryFilterModal.jsx`

**Changes:**

```javascript
// Line 76-80
users.map((user) => (
  <option key={user.username} value={user.username}>
    {user.username}
  </option>
))

// Line 104-118
localCategories.map((category) => (
  <div key={category.category.id} className="category-item">
    {/* ... */}
  </div>
))
```

**Verification:**
- Open category filter modal
- Toggle categories
- Verify no visual glitches when reordering

---

### 4.3 Implement Form Validation

**Problem:** Manual validation with 54 alert() calls

**Install:**
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Files to modify:**
- Create: `src/schemas/entrySchema.ts`
- `src/screens/DataEntry/EntryForm.jsx`
- `src/screens/Recurring/RecurringModal.jsx`
- `src/modals/CategoryFormModal.jsx`

**Changes:**

1. **Create validation schema:**
```typescript
// src/schemas/entrySchema.ts
import { z } from 'zod';

export const entrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.date(),
  selectedCategoryId: z.number().min(1, 'Please select a category'),
  description: z.string().optional()
});
```

2. **Refactor EntryForm.jsx (replace lines 134-175):**
```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entrySchema } from '../../schemas/entrySchema';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(entrySchema),
  defaultValues: entry || {}
});

const onSubmit = async (data) => {
  await handleFormData(data);
};

// In JSX
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('title')} />
  {errors.title && <span className="error">{errors.title.message}</span>}

  <input {...register('amount', { valueAsNumber: true })} />
  {errors.amount && <span className="error">{errors.amount.message}</span>}
</form>
```

**Verification:**
- Test validation errors show inline
- Test form submission with valid data
- Test submission blocked with invalid data
- Verify no more alert() calls in forms

---

## Phase 5: Type Safety (Optional - Lower Priority)

### 5.1 Add PropTypes to Components

**Quicker alternative to full TypeScript migration**

**Install:**
```bash
npm install prop-types
```

**Files to modify (priority order):**
1. `src/components/Entry.jsx`
2. `src/components/Date.jsx`
3. `src/components/Year.jsx`
4. `src/components/CategoryComponent.jsx`
5. All other components receiving props

**Pattern:**
```javascript
import PropTypes from 'prop-types';

function Entry({ entry, handleDelete, handleUpdate, navigate }) {
  // Component code...
}

Entry.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    cTitle: PropTypes.string.isRequired,
    fulldate: PropTypes.string.isRequired
  }).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
};

export default Entry;
```

**Verification:**
- Run app with PropTypes validation
- Check console for prop type warnings
- Fix any type mismatches

---

## Critical Files Reference

**Security (Phase 1):**
- `src/navigation/AuthContext.jsx` - Fix logout (lines 23-26)
- `src/databasehandler/WebStorage.js` - Add clearAuth(), env vars (line 10)
- `src/utils/api.js` - Fix logout method (lines 37-40)

**API Layer (Phase 2):**
- `src/services/httpClient.js` - CREATE NEW - axios setup with interceptors
- `src/databasehandler/userhandler.js` - Migrate to axios (2 methods, start here)
- `src/databasehandler/entryhandler.js` - Migrate to axios (21 methods, largest)

**State Management (Phase 3):**
- `src/contexts/ServicesContext.jsx` - CREATE NEW - replace singletons
- `src/screens/Recurring/RecurringScreen.jsx` - Fix mutations (lines 24, 42, 74)
- `src/components/Date.jsx` - Fix useEffect deps (lines 13-20)
- `src/screens/DashboardScreen.jsx` - Add cleanup (line 80-83)

**Navigation & Forms (Phase 4):**
- `src/screens/DataEntry/UpdateScreen.jsx` - Add null check (line 12)
- `src/screens/EntryListScreen.jsx` - Add null check
- `src/modals/CategoryFilterModal.jsx` - Fix keys (lines 76, 104)
- `src/schemas/entrySchema.ts` - CREATE NEW - validation schema
- `src/screens/DataEntry/EntryForm.jsx` - Add react-hook-form (lines 134-175)

---

## Verification & Testing

### After Each Phase:

1. **Run the app:**
```bash
npm run dev
```

2. **Test critical flows:**
- Login → Dashboard → Add Entry → Logout
- Create recurring entry
- Update existing entry
- Filter by category
- Navigate through year/month/date views

3. **Check console:**
- No React warnings (useEffect dependencies)
- No propType warnings
- No memory leak warnings

4. **Check network tab:**
- All API calls have Authorization header
- 401 responses trigger logout
- No failed requests from race conditions

### Final Verification Checklist:

- [ ] Logout clears all localStorage data
- [ ] Protected routes redirect to login when not authenticated
- [ ] API URL configurable via environment variables
- [ ] 401 responses auto-logout and redirect
- [ ] All API calls use axios (no fetch)
- [ ] Error boundaries catch and display errors
- [ ] No alert() calls (replaced with toast)
- [ ] No singleton pattern in handlers
- [ ] No direct state mutations
- [ ] All useEffect have correct dependencies
- [ ] No memory leaks on unmount
- [ ] No null reference errors on navigation
- [ ] No index-based keys in lists
- [ ] Form validation working with real-time feedback
- [ ] PropTypes added to all components OR TypeScript migration complete

---

## Quick Wins (Can implement today):

1. **Fix logout** - AuthContext.jsx lines 23-26 (5 minutes)
2. **Fix state mutations** - RecurringScreen.jsx lines 24, 42, 74 (10 minutes)
3. **Fix null checks** - UpdateScreen.jsx line 12 (5 minutes)
4. **Fix index keys** - CategoryFilterModal.jsx lines 76, 104 (5 minutes)

**Total: ~25 minutes for 4 critical fixes**

---

## Dependencies to Install

```bash
# Phase 2 - Toast notifications
npm install react-hot-toast

# Phase 4 - Form validation
npm install react-hook-form zod @hookform/resolvers

# Phase 5 - Type safety (choose one)
npm install prop-types
# OR migrate to full TypeScript (already configured)
```

## Estimated Timeline

- **Phase 1 (Security):** 1-2 days
- **Phase 2 (API & Errors):** 2-3 days
- **Phase 3 (State Management):** 2-3 days
- **Phase 4 (Navigation & Forms):** 3-4 days
- **Phase 5 (Type Safety):** 2-3 days (optional)

**Total: 10-15 days** for complete implementation

**Quick wins: ~30 minutes** for immediate critical fixes
