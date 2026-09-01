# Expo Router & File-Based Navigation Reference

Expo Router provides file-based routing built directly on top of React Navigation. Every file inside `src/app/` represents a route in the application.

---

## 1. Route Types & File Conventions

| File / Folder | Purpose | Example |
| :--- | :--- | :--- |
| `_layout.tsx` | Layout wrapper (Stack, Tabs, Drawer) for all sibling routes | `src/app/_layout.tsx` |
| `index.tsx` | Default screen for a route segment | `src/app/(tabs)/index.tsx` -> `/` |
| `[id].tsx` | Dynamic route parameter | `src/app/room/[id].tsx` -> `/room/123` |
| `[...rest].tsx` | Catch-all dynamic route | `src/app/docs/[...rest].tsx` -> `/docs/a/b` |
| `+not-found.tsx` | Global 404 handler when unmatched route is accessed | `src/app/+not-found.tsx` |
| `+html.tsx` | Root HTML template for Web builds | `src/app/+html.tsx` |
| `(group)/` | Logical route group that does not affect the URL path | `src/app/(auth)/login.tsx` -> `/login` |

---

## 2. Setting Up Navigation Stacks & Tabs

### Root Stack Layout (`src/app/_layout.tsx`)
```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Main Tab Navigator */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Modal Screen */}
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal',
          headerShown: true,
          title: 'Details',
        }} 
      />
      
      {/* 404 Fallback */}
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}
```

### Tab Navigator Layout (`src/app/(tabs)/_layout.tsx`)
```tsx
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: Platform.select({ ios: 88, android: 64 }),
          paddingBottom: Platform.select({ ios: 28, android: 8 }),
        },
      }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          // Set tab bar icon here
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
        }} 
      />
    </Tabs>
  );
}
```

---

## 3. Navigating Programmatically & Links

### Declarative Links
```tsx
import { Link } from 'expo-router';
import { Pressable, Text } from 'react-native';

<Link href="/room/42" asChild>
  <Pressable>
    <Text>Open Room 42</Text>
  </Pressable>
</Link>
```

### Imperative Navigation (Hooks)
```tsx
import { useRouter, useLocalSearchParams } from 'expo-router';

export function RoomDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleNavigate = () => {
    router.push({
      pathname: '/checkout',
      params: { roomId: id, source: 'details' },
    });
  };
}
```

---

## 4. Typed Routes in Expo Router

Enable typed routes in `app.json`:
```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```
When `typedRoutes` is enabled, Expo automatically generates route definitions in `.expo/types/router.d.ts`, catching invalid `href` paths at compile-time with TypeScript.

