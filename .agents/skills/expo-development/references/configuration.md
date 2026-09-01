# App Configuration & Environment Setup Reference

Expo projects configure native properties, permissions, icons, and environment variables via `app.json` (static) or `app.config.ts` (dynamic).

---

## 1. Production `app.json` Architecture

```json
{
  "expo": {
    "name": "ROOMHAIJI",
    "slug": "ROOMHAIJI",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "roomhaiji",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.saurav.roomhaiji",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "package": "com.saurav.roomhaiji",
      "adaptiveIcon": {
        "backgroundColor": "#ffffff",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#208AEF",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 120
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

---

## 2. Dynamic Configuration (`app.config.ts`)

When environment-specific configuration is needed (staging vs production API URLs, different bundle IDs):

```ts
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const isProd = process.env.APP_ENV === 'production';

  return {
    ...config,
    name: isProd ? 'Roomhaiji' : 'Roomhaiji (Dev)',
    slug: 'roomhaiji',
    ios: {
      ...config.ios,
      bundleIdentifier: isProd ? 'com.saurav.roomhaiji' : 'com.saurav.roomhaiji.dev',
    },
    android: {
      ...config.android,
      package: isProd ? 'com.saurav.roomhaiji' : 'com.saurav.roomhaiji.dev',
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      environment: process.env.APP_ENV ?? 'development',
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
  };
};
```

---

## 3. Managing Environment Variables Safely

### Public Variables (`EXPO_PUBLIC_`)
Prefix variables with `EXPO_PUBLIC_` to make them available in client-side code:
```bash
# .env
EXPO_PUBLIC_API_URL=https://api.roomhaiji.com/v1
EXPO_PUBLIC_SENTRY_DSN=https://example@sentry.io/12345
```
Access in code directly:
```ts
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

### Type-Safe Environment Validation with Zod
```ts
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
});
```

---

## 4. Config Plugins for Native Modules

Config plugins allow configuring native permissions, Android manifests, and iOS `Info.plist` without manually modifying `android/` and `ios/` folders:

```json
"plugins": [
  [
    "expo-camera",
    {
      "cameraPermission": "Allow $(PRODUCT_NAME) to access camera to scan room QR codes."
    }
  ],
  [
    "expo-location",
    {
      "locationWhenInUsePermission": "Allow $(PRODUCT_NAME) to show nearby rooms."
    }
  ]
]
```
Whenever you add or modify a config plugin, run `npx expo prebuild --clean` or rebuild your development client.

