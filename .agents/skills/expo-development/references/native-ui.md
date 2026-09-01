# Cross-Platform & Native-Feeling UI Reference

Building high-performance, polished mobile experiences requires adhering to iOS and Android design conventions while maintaining code reusability.

---

## 1. Safe Area Insets Management

Always use `react-native-safe-area-context` to prevent content overlapping with camera notches, dynamic islands, home indicators, and Android navigation bars.

### Safe Area Provider Setup (`src/app/_layout.tsx`)
```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
```

### Screen Usage with Hooks
```tsx
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ScreenContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      {/* Content */}
    </View>
  );
}
```

---

## 2. Native Interaction Patterns (Haptics & Gestures)

### Haptic Feedback (`expo-haptics`)
Provide subtle tactile feedback for button presses, selection changes, and critical actions:
```tsx
import * as Haptics from 'expo-haptics';

export function PrimaryButton({ onPress, title }: { onPress: () => void; title: string }) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return <Pressable onPress={handlePress} style={styles.button}>{/* ... */}</Pressable>;
}
```

### High-Performance Animations (`react-native-reanimated`)
```tsx
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

export function ExpandableCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Card UI */}
      </Animated.View>
    </Pressable>
  );
}
```

---

## 3. Platform Differences & Adaptive Styling

| Feature | iOS Pattern | Android Pattern |
| :--- | :--- | :--- |
| **Typography** | `system-ui` (San Francisco) | `Roboto` / `system-ui` |
| **Header Title Alignment** | Center | Left (start) |
| **Modal Presentation** | Card / Sheet from bottom | Fade / Slide from bottom |
| **Back Navigation** | Edge swipe gesture | Hardware / Gesture back |
| **Icons** | SF Symbols (`expo-symbols`) or thin line icons | Material Icons or filled symbols |

### Adaptive Styling with `Platform.select`
```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
});
```

