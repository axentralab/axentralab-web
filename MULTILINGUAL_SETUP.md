# Multilingual (i18n) Setup Guide

## Overview
Your website now supports both **English** and **Bangla** languages. Users can switch between languages using the language switcher in the navigation bar, and their preference is saved in localStorage.

## Features Implemented

### 1. **i18n Infrastructure**
- **Library**: react-i18next + i18next
- **Languages**: English (en), Bangla (bn)
- **Storage**: Language preference saved in localStorage

### 2. **Translation Files**
Located in `frontend/src/i18n/locales/`:
- `en.json` - English translations
- `bn.json` - Bangla translations

### 3. **Language Switcher**
Added to the Navbar component in both:
- **Desktop View**: 🌐 Dropdown menu in the top navbar
- **Mobile View**: Language selection buttons in the mobile drawer

### 4. **Persistent Language Selection**
- User's language choice is saved to localStorage
- Preference loads automatically on page revisit
- Falls back to English if no preference is set

---

## How to Use

### For Users
1. Click the **🌐** icon in the navbar
2. Select your preferred language:
   - 🇺🇸 English
   - 🇧🇩 বাংলা
3. The entire website updates instantly
4. Preference is saved automatically

### For Developers

#### Adding Translations to Components

**Step 1**: Import the hook
```javascript
import { useTranslation } from 'react-i18next';
```

**Step 2**: Use the hook
```javascript
export default function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('home.title')}</h1>;
}
```

#### Adding New Translation Keys

1. Open `frontend/src/i18n/locales/en.json`
2. Add your key with English text:
   ```json
   {
     "section": {
       "key": "Your English Text"
     }
   }
   ```

3. Open `frontend/src/i18n/locales/bn.json`
4. Add the same key with Bangla text:
   ```json
   {
     "section": {
       "key": "আপনার বাংলা পাঠ"
     }
   }
   ```

5. Use in your component:
   ```javascript
   const { t } = useTranslation();
   <p>{t('section.key')}</p>
   ```

---

## Translation Structure

The translations are organized by sections:
- `nav.*` - Navigation links and elements
- `home.*` - Homepage content
- `services.*` - Services page
- `products.*` - Products page
- `portfolio.*` - Portfolio page
- `team.*` - Team page
- `blog.*` - Blog content
- `contact.*` - Contact form
- `quote.*` - Quote calculator
- `cart.*` - Shopping cart
- `checkout.*` - Checkout process
- `auth.*` - Login/Register
- `dashboard.*` - User dashboard
- `admin.*` - Admin panel
- `footer.*` - Footer
- `errors.*` - Error messages
- `common.*` - Common actions (Save, Cancel, Delete, etc.)

---

## Current Translations Coverage

### ✅ Navbar
- All navigation links
- User menu items
- Authentication buttons
- Language switcher

### Partial Coverage (Need Updates)
- **Pages**: HomePage, Services, Products, etc.
- **Forms**: Contact, Checkout, etc.
- **Components**: Individual components need t() updates

---

## Next Steps to Complete Multilingual Support

### Priority 1 - Core Pages
1. Update `HomePage.js` with translations
2. Update `ContactPage.js` with translations
3. Update `LoginPage.js` and `RegisterPage.js` with translations
4. Update `CartPage.js` and `CheckoutPage.js` with translations

### Priority 2 - Components
1. Update form components
2. Update cards and sections
3. Update modals and alerts

### Priority 3 - Backend
1. Consider adding language-specific content from API
2. Backend can respond with content based on language header

---

## Configuration Details

### i18n Config (`frontend/src/i18n/config.js`)
```javascript
- Loads from localStorage or defaults to 'en'
- Supports nested translations with dot notation
- Automatic variable interpolation
```

### Language Codes
- `en` - English
- `bn` - Bangla

---

## Installation Notes

Package installed:
```bash
npm install i18next react-i18next --legacy-peer-deps
```

The `--legacy-peer-deps` flag was needed due to TypeScript version compatibility with react-scripts.

---

## Example: Translating a Component

**Before:**
```javascript
export default function ContactForm() {
  return (
    <form>
      <label>Name</label>
      <input type="text" />
      <button>Send</button>
    </form>
  );
}
```

**After:**
```javascript
import { useTranslation } from 'react-i18next';

export default function ContactForm() {
  const { t } = useTranslation();
  
  return (
    <form>
      <label>{t('contact.name')}</label>
      <input type="text" />
      <button>{t('contact.send')}</button>
    </form>
  );
}
```

---

## Testing

Run the app:
```bash
cd frontend
npm start
```

Then:
1. Navigate to http://localhost:3000
2. Click the 🌐 language switcher
3. Switch between English and Bangla
4. Verify all Navbar text updates
5. Refresh the page - language preference should persist

---

## File Structure
```
frontend/
├── src/
│   ├── i18n/
│   │   ├── config.js                 # i18n configuration
│   │   └── locales/
│   │       ├── en.json              # English translations
│   │       └── bn.json              # Bangla translations
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.js            # Updated with language switcher
│   └── App.js                        # Updated with I18nextProvider
└── package.json                      # Updated with i18n packages
```

---

## Support

For more information on react-i18next:
- Documentation: https://react.i18next.com/
- GitHub: https://github.com/i18next/react-i18next

