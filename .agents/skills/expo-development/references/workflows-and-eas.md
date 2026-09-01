# EAS Build, Submit, Update & CI/CD Workflows

Expo Application Services (EAS) provides managed cloud builds, automated store submissions, Over-The-Air (OTA) runtime updates, and CI/CD pipelines.

---

## 1. EAS Configuration (`eas.json`)

Create an `eas.json` file in your project root:

```json
{
  "cli": {
    "version": ">= 14.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "channel": "production",
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "apple-developer@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

---

## 2. EAS Build Workflows

### 1. Create a Development Client Build
Used for local testing on real devices with native module changes:
```bash
# Build custom Expo Dev Client for iOS and Android
npx eas-cli build --profile development --platform all
```

### 2. Create Internal Preview Build
Generates shareable APKs for Android or ad-hoc TestFlight builds for iOS:
```bash
npx eas-cli build --profile preview --platform all
```

### 3. Production App Store / Play Store Build
Generates `.aab` (Android App Bundle) and signed iOS `.ipa`:
```bash
npx eas-cli build --profile production --platform all --auto-submit
```

---

## 3. Over-The-Air (OTA) Updates (`eas-cli update`)

Publish JavaScript and asset updates instantly without resubmitting to App Store reviews:

```bash
# Publish update to preview channel
npx eas-cli update --branch preview --message "Fixed profile avatar loading bug"

# Publish update to production users
npx eas-cli update --branch production --message "Release v1.0.1 hotfix"
```

> [!IMPORTANT]
> OTA Updates can only update JavaScript code and assets. Changes to native code, native permissions, or native libraries require a new full EAS Build.

---

## 4. GitHub Actions CI/CD Pipeline

Automate typechecking, linting, and EAS preview builds on pull requests:

```yaml
# .github/workflows/ci.yml
name: Mobile CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Typecheck
        run: npx tsc --noEmit

      - name: Expo Doctor Diagnostics
        run: npx expo-doctor
```

