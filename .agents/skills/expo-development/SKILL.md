---
name: expo-development
description: >-
  Comprehensive guide and operational workflows for Expo and React Native app development.
  Use this skill whenever setting up, developing, styling, routing, testing, debugging,
  building, or deploying Expo applications (Expo SDK 50+, Expo Router, EAS Build, EAS Submit,
  EAS Update, cross-platform UI, and native modules).
---

# Expo & React Native Development Guide

A production-grade playbook for developing, building, and shipping universal mobile and web applications with **Expo (SDK 50+)** and **React Native**.

---

## Quick Navigation & Specialized References

For in-depth guides and runbooks, consult the reference documentation:

- 🧭 **[Expo Router & File-Based Navigation](./references/routing.md)**: Stacks, tabs, modals, dynamic routes, deep linking, and typed routing.
- ⚙️ **[App Configuration & Environment Setup](./references/configuration.md)**: `app.json`, `app.config.ts`, Config Plugins, credentials, and environment variables.
- 🎨 **[Cross-Platform & Native-Feeling UI](./references/native-ui.md)**: Platform parity, Safe Area Insets, Haptics, Reanimated, and Design Systems.
- 🚀 **[EAS Build, Update & CI/CD Workflows](./references/workflows-and-eas.md)**: EAS profiles, OTA updates, App Store/Play Store submissions, and automated pipelines.
- 🧪 **[Testing, Debugging & Validation](./references/debugging-and-testing.md)**: Diagnostics (`expo-doctor`), Jest + RNTL, DevTools, and error monitoring.

---

## 1. Golden Rules of Expo Development

1. **Always Install Native Packages with `npx expo install`**:
   - Never use raw `npm install` or `yarn add` for native packages (`expo-*`, `react-native-*`).
   - `npx expo install <package>` automatically selects the exact version compatible with the installed Expo SDK version.

2. **Respect the Versioned Expo Documentation**:
   - Expo APIs evolve between SDK versions. Verify the active SDK version in `package.json` and consult version-specific documentation (e.g., `https://docs.expo.dev/versions/v<SDK_VERSION>/`).

3. **Separate Routing from Business Logic**:
   - Keep route files inside `src/app/` as thin wrappers that only handle parameters and render feature components.
   - Place business logic, custom hooks, and presentation components inside domain-specific feature folders (`src/features/<feature_name>/`).

4. **Never Hardcode Platform Assumptions**:
   - Always account for iOS notches, Android navigation bars, and Android hardware back buttons using `react-native-safe-area-context` and `react-native-screens`.

---

## 2. Project Architecture Standards

Standard production directory structure:

```text
├── assets/                    # Static branding (icons, splash screen, adaptive icons)
├── src/
│   ├── app/                   # File-based routing entrypoints (Expo Router)
│   │   ├── (auth)/            # Auth stack / onboarding flows
│   │   ├── (tabs)/            # Main bottom tab navigator
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx      # Tab 1 screen entrypoint
│   │   │   └── profile.tsx    # Tab 2 screen entrypoint
│   │   ├── _layout.tsx        # Global root stack, themes, and global providers
│   │   └── +not-found.tsx     # Catch-all route handler
│   ├── components/            # Shared, reusable atomic UI components
│   ├── constants/             # Design tokens, theme palettes, typography scale
│   ├── features/              # Feature-based domain modules
│   │   └── <feature_name>/
│   │       ├── api/           # API endpoints & query hooks
│   │       ├── components/    # Feature-specific UI components
│   │       ├── hooks/         # Feature-specific business hooks
│   │       ├── screens/       # Full screen UI implementations
│   │       └── types/         # Feature TypeScript contracts
│   ├── hooks/                 # Global React hooks
│   ├── services/              # API clients, local storage, analytics, auth token handlers
│   └── types/                 # Global type declarations
├── app.json                   # Expo app manifest & native plugins
├── declarations.d.ts          # Static asset and CSS typing
├── eas.json                   # EAS Build and deployment profiles
├── package.json
└── tsconfig.json              # Path aliases and strict TypeScript configuration
```

---

## 3. Core Development Workflows

### Starting the Development Server
```bash
# Start local Metro bundler with interactive menu
npx expo start

# Start directly for specific platforms
npx expo start --android
npx expo start --ios
npx expo start --web

# Clear Metro cache when encountering stale bundles
npx expo start -c
```

### Prebuild & Native Projects (Continuous Native Generation)
Expo utilizes CNG (Continuous Native Generation), meaning `android/` and `ios/` folders can be generated from `app.json` config plugins on demand:
```bash
# Generate native Android and iOS folders locally
npx expo prebuild

# Clean and regenerate native folders
npx expo prebuild --clean
```

---

## 4. Platform-Specific Considerations

### iOS Checklist
- **App Icons & Assets**: Provide valid `assets/expo.icon` or 1024x1024 PNG in `app.json`.
- **Bundle Identifier**: Must follow reverse-DNS notation (`ios.bundleIdentifier: "com.example.app"`).
- **Safe Areas**: Wrap screens in `<SafeAreaView edges={['top', 'bottom']}>` from `react-native-safe-area-context`.
- **Keyboard Handling**: Use `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>`.

### Android Checklist
- **Package Name**: Must be specified in `android.package` (`"com.example.app"`).
- **Adaptive Icon**: Provide `foregroundImage`, `backgroundImage`, and `backgroundColor`.
- **Predictive Back Gesture**: Configure `android.predictiveBackGestureEnabled: true` (or `false` based on SDK version).
- **Hardware Back Button**: Handle screen dismissal using Expo Router `router.back()` or `BackHandler`.
- **Status Bar & Navigation Bar**: Configure translucent status bars and edge-to-edge layouts using `expo-status-bar` and `react-native-safe-area-context`.

---

## 5. Verification & Diagnostics Runbook

Run these checks whenever modifying configuration, dependencies, or app navigation:

1. **Verify Project Health**:
   ```bash
   npx expo-doctor
   ```
2. **Type Check**:
   ```bash
   npx tsc --noEmit
   ```
3. **Validate App Config**:
   ```bash
   npx expo config --type public
   ```
4. **Automated Setup Validation**:
   Run the included helper script:
   ```bash
   node .agents/skills/expo-development/scripts/validate-expo-setup.js
   ```

---

## 6. Deployment & EAS Overview

```bash
# 1. Login to Expo Application Services
npx eas-cli login

# 2. Configure project for EAS
npx eas-cli build:configure

# 3. Trigger cloud builds
npx eas-cli build --platform all --profile preview      # Internal testing build
npx eas-cli build --platform all --profile production   # Release build for App Stores

# 4. Publish instant Over-The-Air (OTA) updates (no app store review)
npx eas-cli update --branch preview --message "Bug fix: resolved layout issue"

# 5. Submit to App Store / Google Play Store
npx eas-cli submit --platform all
```
See **[workflows-and-eas.md](./references/workflows-and-eas.md)** for detailed CI/CD automation.

