---
name: roomhaiji-standards
description: >-
  Routing, form handling, typography, and UI standards for RoomHaiji. Use this skill whenever building or modifying forms, text inputs, routes, modals, themes, or inline links in the app.
---

# RoomHaiji Architecture & Development Standards

Guidelines and rules for Expo Router navigation, React Native form inputs, inline text links, and the global theme system.

---

## 1. Expo Router & File-Based Routing Rules

1. **Thin Route Entrypoints**:
   - Files inside `src/app/` MUST be thin wrappers that render presentation components from `src/features/`.
   - Example: `src/app/auth/terms.tsx` renders `<TermsScreen />` from `src/features/legal/terms-screen.tsx`.

2. **No Duplicate Routes**:
   - Never create duplicate route wrappers across multiple directories (e.g. do NOT create both `src/app/terms.tsx` and `src/app/auth/terms.tsx`).
   - Group auth routes under `src/app/auth/` and tab routes under `src/app/(tabs)/`.

3. **Navigation Calls**:
   - Always use Expo Router's `router.push('/auth/terms')` or `router.replace('/auth/phone')`. Never use global `navigator.navigate`.

---

## 2. TextInput & Keyboard Handling

1. **Web Touch & Focus Parity**:
   - NEVER wrap `<TextInput>` or form screens in `<TouchableWithoutFeedback onPress={Keyboard.dismiss}>` on Web (`Platform.OS === 'web'`).
   - Doing so fires `Keyboard.dismiss()` on every click, blurring the input field instantly and preventing text typing.

2. **ScrollView for Forms**:
   - Wrap form layouts in `<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>`.
   - `keyboardShouldPersistTaps="handled"` ensures input clicks focus reliably on all platforms while allowing tap-outside keyboard dismissal on mobile.

---

## 3. Inline Links & Interactive Elements

1. **No Pressable Inside Parent Text**:
   - NEVER nest a `<Pressable>` or `<View>` component inside a parent `<Text>` element. It breaks React Native layout rules and causes touch failures on React Native Web.

2. **Wrapping Link Rows**:
   - For sentences containing inline links (e.g. Terms & Privacy notice), use a flex row container with `flexWrap: 'wrap'`:
     ```tsx
     <View style={styles.termsRow}>
       <Text style={[styles.termsText, { color: theme.ink3 }]}>
         {t('auth.termsNotice')}
       </Text>
       <Pressable onPress={handleTermsPress} hitSlop={6}>
         <Text style={[styles.linkText, { color: theme.primary }]}>
           {t('auth.terms')}
         </Text>
       </Pressable>
     </View>
     ```

---

## 4. Theme & Typography System

1. **Always Use Theme Tokens**:
   - Always consume colors from `useTheme()` (`theme.surface`, `theme.primary`, `theme.ink`, `theme.white`, etc.).
   - Import spacing, radius, and typography tokens from `@/constants/theme`:
     `import { FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING, TYPOGRAPHY } from '@/constants/theme';`
