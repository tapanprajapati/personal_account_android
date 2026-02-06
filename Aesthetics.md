# Aesthetic & Accessibility Improvement Plan - Personal Account Web App

## Overview

This plan addresses visual design, UX, and accessibility issues in the Personal Account web application to create a modern, consistent, and WCAG AA-compliant user interface.

**Current State Analysis:**
- 32 CSS files with no CSS Modules (class name collision risk)
- Mixed styling: Tailwind CSS + custom CSS + styled-components
- 54 browser `alert()` calls for user feedback
- Emoji buttons (⧩, 🔍, ➕) instead of proper icons
- Fixed width containers (50%) breaking responsive design
- Missing ARIA labels and semantic HTML
- Color contrast violations (WCAG failures)
- Invalid CSS syntax (missing semicolons)
- Hardcoded colors in 19+ files instead of using color constants

---

## Phase 1: Design System Foundation (Week 1)

### 1.1 Create Design Tokens System

**File to Create:** `src/styles/tokens.js`

**Purpose:** Single source of truth for all design decisions (colors, spacing, typography, shadows, etc.)

**Key Tokens:**

```javascript
export const colors = {
  primary: { 500: '#0A89A7', 600: '#087A96' },
  success: { main: '#00C63C', bg: '#E8F5E9' },
  error: { main: '#D50000', bg: '#FFEBEE' },
  gray: { 50: '#F8F9FA', 600: '#6C757D', 900: '#212529' },
  text: { primary: '#212529', secondary: '#6C757D' },
  // ... complete palette
};

export const spacing = {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
};

export const typography = {
  fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem' },
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 2px 5px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  modal: '0 4px 20px rgba(0, 0, 0, 0.15)',
};
```

**Benefits:**
- Eliminates all hardcoded values
- Ensures visual consistency
- Makes theme changes trivial
- Enables dark mode in future

---

### 1.2 Update Tailwind Configuration

**File to Modify:** `tailwind.config.js`

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#0A89A7', 600: '#087A96' },
        success: { DEFAULT: '#00C63C' },
        error: { DEFAULT: '#D50000' },
      },
      boxShadow: {
        'card': '0 2px 5px rgba(0, 0, 0, 0.1)',
        'modal': '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
    },
  },
};
```

**Impact:** Consistent with design tokens, enables utility classes.

---

### 1.3 Create Reusable UI Components

**Files to Create:**

1. **`src/components/ui/Button.jsx`** + `.css`
   - Variants: primary, secondary, success, error, ghost, outline
   - Sizes: sm, md, lg
   - States: default, hover, focus, disabled
   - Props: `ariaLabel` for accessibility

2. **`src/components/ui/IconButton.jsx`** + `.css`
   - Replaces emoji buttons and icon-only buttons
   - Required `ariaLabel` prop
   - Focus-visible states

3. **`src/components/ui/Input.jsx` / `FormField.jsx`** + `.css`
   - Consistent form field styling
   - Built-in validation state display
   - Proper label associations
   - Error message display

4. **`src/components/ui/Toast.jsx`** + `.css`
   - Replace all 54 `alert()` calls
   - Toast context provider
   - Auto-dismiss with duration
   - Accessible announcements (`aria-live`)

5. **`src/components/ui/Skeleton.jsx`** + `.css`
   - Loading skeletons instead of spinners
   - Better perceived performance

**Verification:**
- All components have focus-visible states
- All interactive elements have proper ARIA labels
- Color contrast meets WCAG AA (4.5:1 minimum)

---

## Phase 2: Critical Accessibility Fixes (Week 2)

### 2.1 Replace Browser Alerts with Toast Notifications

**Problem:** 54 `alert()` calls block UI and provide poor UX

**Files to Modify (13 total):**
- `src/components/Entry.jsx` (lines 14-24)
- `src/screens/DashboardScreen.jsx` (line 50)
- `src/screens/DataEntry/EntryForm.jsx` (line 156)
- `src/screens/DataEntry/AddScreen.jsx` (line 18-23)
- `src/screens/DataEntry/UpdateScreen.jsx`
- `src/screens/EntryListScreen.jsx`
- `src/screens/AccountTypeScreen.jsx`
- `src/screens/DifferenceScreen/DifferenceScreen.jsx`
- `src/screens/Recurring/RecurringScreen.jsx`
- `src/screens/Recurring/RecurringModal.jsx`
- `src/screens/CategoryFunctions/ManageCategoriesScreen.jsx`
- `src/modals/CategoryFormModal.jsx`
- `src/modals/CategoryTransferModal.jsx`

**Pattern:**

**Before:**
```javascript
alert("Entry Deleted");
alert("Error Deleting Entry");
```

**After:**
```javascript
import { useToast } from '../components/ui/Toast';

const { success, error } = useToast();

success("Entry deleted successfully");
error("Error deleting entry");
```

**Wrap App with ToastProvider:**
```javascript
// src/App.jsx
import { ToastProvider } from './components/ui/Toast';

<ToastProvider>
  <Router>
    <MainNavigation />
  </Router>
</ToastProvider>
```

**Verification:**
- No `alert()` calls remain in codebase
- Toasts appear in corner, don't block UI
- Toast messages announced to screen readers
- Toasts auto-dismiss after 4 seconds

---

### 2.2 Fix Icon Button Accessibility

**Problem:** Icon buttons lack ARIA labels, not keyboard accessible

**File to Modify:** `src/navigation/Header.jsx` (lines 90-111)

**Before:**
```javascript
<FaPlus
  size={15}
  className="action-btn"
  onClick={handleAddEntry}
  title="Add Entry"
/>
```

**After:**
```javascript
<IconButton
  icon={FaPlus}
  onClick={handleAddEntry}
  ariaLabel="Add new entry"
  title="Add Entry"
  variant="primary"
  size="sm"
/>
```

**Similar changes needed:**
- `src/components/Entry.jsx` (edit/delete icons, lines 29-44)
- `src/screens/AccountTypeScreen.jsx` (emoji buttons, lines 177-196)

---

### 2.3 Replace Emoji Buttons with Icon Components

**File to Modify:** `src/screens/AccountTypeScreen.jsx` (lines 177-196)

**Before:**
```javascript
<button onClick={handleSearch}>🔍</button>
<button onClick={() => setShowCategoryModal(true)}>⧩</button>
<button onClick={handleAddEntry}>➕</button>
```

**After:**
```javascript
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';

<IconButton
  icon={FaSearch}
  onClick={handleSearch}
  ariaLabel="Search entries"
  variant="secondary"
/>
<IconButton
  icon={FaFilter}
  onClick={() => setShowCategoryModal(true)}
  ariaLabel="Filter by categories"
  variant="secondary"
/>
<IconButton
  icon={FaPlus}
  onClick={handleAddEntry}
  ariaLabel="Add new entry"
  variant="primary"
/>
```

---

### 2.4 Add Semantic HTML and ARIA Landmarks

**Changes needed:**

1. **Add Skip Link** (for keyboard users)
```javascript
// src/App.jsx
<a href="#main-content" className="skip-link">Skip to main content</a>
<Header />
<main id="main-content">
  {/* routes */}
</main>
```

```css
/* src/index.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0A89A7;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

2. **Add ARIA labels to navigation**
```javascript
// src/navigation/Header.jsx (line 62)
<nav className="header-nav" aria-label="Main navigation">
```

3. **Wrap forms in `<form>` elements**
```javascript
// src/screens/DataEntry/EntryForm.jsx
<form onSubmit={handleSubmit}>
  {/* form fields */}
</form>
```

**Verification:**
- Run with screen reader (NVDA/JAWS)
- Verify all landmarks announced
- Test keyboard-only navigation
- Skip link appears on Tab key

---

## Phase 3: CSS Consolidation & Responsiveness (Week 3)

### 3.1 Fix CSS Syntax Errors

**File to Modify:** `src/components/Entry.css`

**Lines to fix:**
- Line 4: `margin: 0` → `margin: 0;`
- Line 35: `margin: 0` → `margin: 0;`
- Line 42: `margin: 0` → `margin: 0;`
- Line 66: `flex:0.2` → `flex: 0.2;`

**Validation:** Run CSS linter to catch remaining syntax errors.

---

### 3.2 Fix Fixed Width Containers

**Problem:** Many screens use `width: 50%` which breaks on tablets and mobile

**Files to Modify:**

1. **`src/screens/AccountTypeScreen.css`** (line 6)

**Before:**
```css
.account-type-screen {
  width: 50%;
  margin: auto;
}
```

**After:**
```css
.account-type-screen {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .account-type-screen {
    width: 90%;
  }
}

@media (min-width: 992px) {
  .account-type-screen {
    width: 70%;
  }
}
```

2. **Fix Fixed Footer** (line 120)

**Before:**
```css
.total-footer {
  position: fixed;
  bottom: 0;
  width: 45%;
}
```

**After:**
```css
.total-footer {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 2rem);
  max-width: 600px;
  z-index: 10;
}

@media (min-width: 768px) {
  .total-footer {
    width: 90%;
  }
}
```

**Similar fixes needed in:**
- `src/screens/RecentEntries.css`
- `src/screens/EntryListScreen.css`
- `src/screens/DifferenceScreen/DifferenceScreen.css`
- `src/screens/DataEntry/UpdateScreen.css`
- `src/screens/DataEntry/AddScreen.css`
- `src/screens/CategoryFunctions/ManageCategoriesScreen.css`

**Verification:**
- Test on mobile (320px), tablet (768px), desktop (1200px)
- No horizontal scrolling
- All content readable and accessible

---

### 3.3 Add CSS Variables to index.css

**File to Modify:** `src/index.css`

Add after Tailwind imports:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Colors */
  --color-primary: #0A89A7;
  --color-primary-dark: #087A96;
  --color-success: #00C63C;
  --color-error: #D50000;

  /* Text colors (WCAG compliant) */
  --color-text-primary: #212529;
  --color-text-secondary: #6C757D;
  --color-text-disabled: #ADB5BD;

  /* Backgrounds */
  --color-bg-default: #FFFFFF;
  --color-bg-paper: #F8F9FA;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;

  /* Shadows */
  --shadow-base: 0 2px 5px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-base: 0.375rem;
  --radius-md: 0.5rem;
}
```

**Usage throughout codebase:**
```css
/* Replace hardcoded values */
background-color: #0A89A7; /* OLD */
background-color: var(--color-primary); /* NEW */
```

---

## Phase 4: Component Modernization (Week 4)

### 4.1 Add Loading Skeletons

**File to Create:** `src/components/ui/Skeleton.jsx` + `.css`

**Features:**
- Shimmer animation
- Variants: text, rectangular, circular
- Entry skeleton component for list loading

**Usage:**
```javascript
// Replace LoadingSpinner with skeleton
{isLoading ? (
  <EntrySkeleton count={5} />
) : (
  <EntryList entries={entries} />
)}
```

**Files to update:**
- `src/screens/AccountTypeScreen.jsx` (line 239)
- `src/screens/DashboardScreen.jsx`
- `src/screens/EntryListScreen.jsx`
- `src/screens/DifferenceScreen/DifferenceScreen.jsx`

---

### 4.2 Improve Form Validation UI

**File to Create:** `src/components/ui/FormField.jsx` + `.css`

**Features:**
- Required field indicators (red asterisk)
- Inline error messages
- Helper text
- Accessible error announcements (`aria-invalid`, `aria-describedby`)
- Focus states

**File to Modify:** `src/screens/DataEntry/EntryForm.jsx`

**Before (lines 134-175 - manual validation with alerts):**
```javascript
if (formData.title.trim() === '') {
  alert('Title Required');
  return;
}
```

**After:**
```javascript
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!formData.title.trim()) {
    newErrors.title = 'Title is required';
  }
  if (!formData.amount || formData.amount <= 0) {
    newErrors.amount = 'Amount must be greater than 0';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// In JSX
<FormField
  label="Title"
  id="title"
  value={formData.title}
  onChange={(e) => handleInputChange('title', e.target.value)}
  error={errors.title}
  required
  placeholder="Enter title"
/>
```

---

## Phase 5: Modal Accessibility & Focus Management (Week 5)

### 5.1 Create Accessible Modal Wrapper

**File to Create:** `src/components/ui/AccessibleModal.jsx`

**Features:**
- Focus trap (Tab key cycles within modal)
- Auto-focus first element on open
- Return focus to trigger element on close
- Escape key to close
- Click outside to close (optional)
- Prevent body scroll when open
- Proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)

**Files to Refactor:**
- `src/modals/CategoryFormModal.jsx`
- `src/modals/CategoryFilterModal.jsx`
- `src/modals/CategoryTransferModal.jsx`
- `src/modals/DatePicker.jsx`
- `src/modals/MonthYearPicker.jsx`
- `src/modals/ImageUpload.jsx`
- `src/screens/Recurring/RecurringModal.jsx`

**Usage:**
```javascript
<AccessibleModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add Category"
  size="md"
>
  {/* modal content */}
</AccessibleModal>
```

**Verification:**
- Tab key stays within modal
- Escape closes modal
- Focus returns to button that opened modal
- Screen reader announces modal opening

---

## Phase 6: Color Contrast Fixes (Week 6)

### 6.1 Fix WCAG Color Contrast Violations

**Issues Found:**
- Grey text (`#666` or `grey`) on light background fails WCAG AA (needs 4.5:1 contrast ratio)

**File to Modify:** `src/components/Entry.css`

**Lines to fix:**
- Line 23: `.category-text { color: grey; }` → `color: #6C757D;` (4.6:1 contrast)
- Line 49: `.username-text { color: grey; }` → `color: #6C757D;`
- Line 53: `.desc-text { color: grey; }` → `color: #6C757D;`

**Audit all color usages:**
```bash
# Find all hardcoded colors
grep -r "color: #" src/
grep -r "background-color: #" src/
grep -r "color: grey" src/
```

**Replace with design tokens:**
- `color: #666;` → `color: var(--color-text-secondary);`
- `color: grey;` → `color: var(--color-text-secondary);`

**Verification:**
- Use WebAIM Contrast Checker
- All text meets WCAG AA standard (4.5:1 for normal text, 3:1 for large text)

---

### 6.2 Add Non-Color Indicators

**Problem:** Income/expense distinguished by color only (green/red)

**File to Modify:** `src/screens/DashboardScreen.jsx`

**Before:**
```javascript
<p style={{ color: '#16A34A' }}>${incomeTotal}</p>
<p style={{ color: '#FF3300' }}>${expenseTotal}</p>
```

**After:**
```javascript
<div className="dashboard-total dashboard-total-income">
  <FaArrowUp aria-hidden="true" />
  <span className="label">Income:</span>
  <span className="amount">${incomeTotal}</span>
</div>

<div className="dashboard-total dashboard-total-expense">
  <FaArrowDown aria-hidden="true" />
  <span className="label">Expense:</span>
  <span className="amount">${expenseTotal}</span>
</div>
```

**Benefits:**
- Colorblind users can distinguish
- Icons provide visual cue
- Text labels add context

---

## Phase 7: Keyboard Navigation (Week 7)

### 7.1 Add Dropdown Keyboard Navigation

**File to Modify:** `src/navigation/Header.jsx` (lines 104-131)

**Features to Add:**
- Arrow Up/Down to navigate menu items
- Enter to select
- Escape to close
- Tab to cycle through focusable elements
- `aria-expanded` on dropdown button

**Implementation:**
```javascript
const [focusedIndex, setFocusedIndex] = useState(-1);

const handleKeyDown = (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setFocusedIndex((prev) => (prev + 1) % menuItems.length);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setFocusedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
  } else if (e.key === 'Enter' && focusedIndex >= 0) {
    handleMenuAction(menuItems[focusedIndex].action);
  } else if (e.key === 'Escape') {
    setShowDropdown(false);
  }
};

// In dropdown button
<button
  onClick={() => setShowDropdown(!showDropdown)}
  aria-expanded={showDropdown}
  aria-haspopup="true"
>
  <FaEllipsisV />
</button>

// In dropdown menu
<div
  role="menu"
  onKeyDown={handleKeyDown}
  className="dropdown-content"
>
  {menuItems.map((item, index) => (
    <button
      key={item.action}
      role="menuitem"
      className={focusedIndex === index ? 'focused' : ''}
    >
      {item.label}
    </button>
  ))}
</div>
```

**Verification:**
- Keyboard-only users can navigate dropdown
- Visual focus indicator visible
- Screen reader announces menu state

---

## Critical Files Reference

**Design System (Phase 1):**
- `src/styles/tokens.js` - CREATE NEW - Single source of truth for all design values
- `src/components/ui/Button.jsx` + `.css` - CREATE NEW - Reusable button component
- `src/components/ui/IconButton.jsx` + `.css` - CREATE NEW - Accessible icon buttons
- `src/components/ui/Toast.jsx` + `.css` - CREATE NEW - Toast notification system
- `tailwind.config.js` - UPDATE - Align with design tokens

**Accessibility (Phase 2):**
- `src/navigation/Header.jsx` - UPDATE lines 90-111 - Add ARIA labels to icon buttons
- `src/components/Entry.jsx` - UPDATE lines 29-44 - Replace icons with IconButton component
- `src/screens/AccountTypeScreen.jsx` - UPDATE lines 177-196 - Replace emoji buttons
- All 13 files with `alert()` - Replace with toast notifications
- `src/App.jsx` - ADD skip link and semantic HTML

**Responsiveness (Phase 3):**
- `src/components/Entry.css` - FIX lines 4, 35, 42, 66 - Missing semicolons
- `src/screens/AccountTypeScreen.css` - FIX lines 6, 120 - Fixed width containers
- `src/screens/RecentEntries.css` - FIX width constraints
- `src/screens/EntryListScreen.css` - FIX width constraints
- `src/index.css` - ADD CSS variables

**Components (Phase 4):**
- `src/components/ui/Skeleton.jsx` + `.css` - CREATE NEW - Loading skeletons
- `src/components/ui/FormField.jsx` + `.css` - CREATE NEW - Form field component
- `src/screens/DataEntry/EntryForm.jsx` - UPDATE lines 134-175 - Replace alert validation

**Modals (Phase 5):**
- `src/components/ui/AccessibleModal.jsx` - CREATE NEW - Accessible modal wrapper
- All 7 modal files - REFACTOR to use AccessibleModal

**Colors (Phase 6):**
- `src/components/Entry.css` - FIX lines 23, 49, 53 - Color contrast violations
- `src/screens/DashboardScreen.jsx` - ADD icons to income/expense indicators

**Keyboard Nav (Phase 7):**
- `src/navigation/Header.jsx` - UPDATE lines 104-131 - Dropdown keyboard navigation

---

## Testing & Verification

### Automated Testing

1. **Install accessibility testing:**
```bash
npm install --save-dev @axe-core/react jest-axe
```

2. **Create test:**
```javascript
// src/__tests__/accessibility.test.js
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

**Keyboard Navigation:**
- [ ] Can navigate entire app with keyboard only
- [ ] Focus indicators visible on all interactive elements
- [ ] Tab order is logical
- [ ] Escape closes modals
- [ ] Enter/Space activates buttons

**Screen Reader:**
- [ ] All images have alt text
- [ ] All icon buttons have aria-labels
- [ ] Form errors announced
- [ ] Toast notifications announced
- [ ] Modal opening/closing announced
- [ ] Landmark navigation works

**Color & Contrast:**
- [ ] All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Income/expense distinguishable without color
- [ ] Focus indicators have sufficient contrast

**Responsive Design:**
- [ ] Mobile (320px): All content accessible, no horizontal scroll
- [ ] Tablet (768px): Layout adapts appropriately
- [ ] Desktop (1200px+): Content not stretched excessively

**Visual Consistency:**
- [ ] All buttons use Button component
- [ ] All forms use FormField component
- [ ] All modals use AccessibleModal
- [ ] No emoji buttons remain
- [ ] No alert() dialogs remain

---

## Dependencies to Install

```bash
# Toast notifications (if not using custom implementation)
# npm install react-hot-toast

# Accessibility testing
npm install --save-dev @axe-core/react jest-axe

# Testing library (if not already installed)
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

---

## Estimated Timeline

| Phase | Focus | Hours | Priority |
|-------|-------|-------|----------|
| Phase 1 | Design System Foundation | 16h | CRITICAL |
| Phase 2 | Accessibility Fixes | 18h | HIGH |
| Phase 3 | CSS Consolidation & Responsiveness | 12h | HIGH |
| Phase 4 | Component Modernization | 11h | MEDIUM |
| Phase 5 | Modal Accessibility | 6h | HIGH |
| Phase 6 | Color Contrast | 3h | HIGH |
| Phase 7 | Keyboard Navigation | 4h | MEDIUM |
| **Total** | | **70 hours** | (~2 months part-time) |

**Quick Wins (Can do first day):**
1. Fix CSS syntax errors (15 min)
2. Replace emoji buttons with icon buttons (2 hours)
3. Fix Entry.css color contrast (30 min)
4. Add ARIA labels to Header icons (1 hour)

---

## Success Metrics

**Accessibility:**
- [ ] Zero critical WCAG violations
- [ ] Lighthouse accessibility score >95
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader compatible

**Code Quality:**
- [ ] CSS files reduced from 32 to ~15
- [ ] All colors from design tokens (zero hardcoded)
- [ ] Zero `alert()` calls
- [ ] Valid CSS (no syntax errors)

**Visual Consistency:**
- [ ] All buttons use design system
- [ ] Consistent spacing throughout
- [ ] Unified modal styling
- [ ] Professional appearance (no emojis)

**Responsiveness:**
- [ ] Works on 320px to 1920px screens
- [ ] No fixed width containers
- [ ] Proper tablet optimization
- [ ] Touch-friendly on mobile

---

## Migration Strategy

### Incremental Adoption

**Week 1-2:** Foundation (Phases 1-2)
- Create design system
- Build reusable components
- Replace alerts with toasts in high-traffic screens

**Week 3-4:** Consolidation (Phases 3-4)
- Fix responsive issues
- Migrate to FormField components
- Add loading skeletons

**Week 5-7:** Polish (Phases 5-7)
- Refactor modals
- Complete accessibility fixes
- Final testing and verification

### Backward Compatibility

- Keep existing `colors.js` during migration
- Create compatibility layer in `tokens.js`
- Gradually replace old imports
- Remove old files only after full migration
- Test thoroughly after each phase

### Code Review Checkpoints

- **After Phase 1:** Review design tokens with team
- **After Phase 2:** Conduct accessibility audit with screen reader
- **After Phase 4:** UX review of new components
- **After Phase 7:** Full regression testing

---

## Verification Checklist

**Before marking each phase complete:**

- [ ] Code changes deployed to dev environment
- [ ] Visual regression testing passed
- [ ] Accessibility testing passed
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Responsive testing on actual devices
- [ ] No console errors or warnings
- [ ] No broken functionality
- [ ] Documentation updated
