# Testing, Debugging & Validation Reference

Best practices for debugging, logging, automated testing, and performance profiling in Expo and React Native applications.

---

## 1. Automated Health Diagnostics (`expo-doctor`)

Run `npx expo-doctor` to validate:
- Dependency version compatibility against the current Expo SDK.
- Missing peer dependencies or mismatched packages.
- Invalid or deprecated fields in `app.json`.
- Missing native build tools and configuration issues.

```bash
npx expo-doctor
```

---

## 2. Unit & Component Testing (Jest + React Native Testing Library)

### Setup Packages
```bash
npx expo install -- --save-dev jest jest-expo @testing-library/react-native @testing-library/jest-native
```

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
```

### Example Screen Test
```tsx
// src/features/home/screens/__tests__/home-screen.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HomeScreen } from '../home-screen';

describe('HomeScreen', () => {
  it('renders kicker and title correctly', () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('Roomhaiji')).toBeTruthy();
    expect(screen.getByText('A clean foundation for your app')).toBeTruthy();
  });
});
```

---

## 3. End-to-End Testing (Maestro)

Maestro is the industry-standard, zero-flakiness mobile UI automation tool:

```yaml
# .maestro/home-flow.yaml
appId: com.saurav.roomhaiji
---
- launchApp
- assertVisible: "Roomhaiji"
- tapOn: "Profile"
- assertVisible: "Production-ready app foundation"
```
Run tests with:
```bash
maestro test .maestro/home-flow.yaml
```

---

## 4. Debugging & Network Inspection

### React Native DevTools
- Press `m` or `j` in the Expo terminal window to open React Native DevTools / Chrome DevTools.
- Inspect component hierarchy, props, state, and profiler timings.

### Network Request Inspection
- Use Chrome DevTools (Network tab) or tools like **Proxyman** / **Charles** / **Reactotron**.
- For Hermes engine debugging: `chrome://inspect` in Chromium browsers.

---

## 5. Production Error Monitoring (Sentry)

### Install Sentry for Expo
```bash
npx expo install @sentry/react-native
```

### Initialize in Root Layout (`src/app/_layout.tsx`)
```tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
  tracesSampleRate: 1.0,
});

export default function RootLayout() {
  // Application tree
}
```

