# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## RoomHaiji Development Rules

1. **Routing Parity & Non-Duplication**:
   - Thin route wrappers inside `src/app/` render components from `src/features/`.
   - Never duplicate route files in `src/app/` (e.g. keep auth routes cleanly under `src/app/auth/`).
   - Use `router.push(...)` or `router.replace(...)` from `expo-router`. Never use `navigator.navigate`.

2. **TextInput & Form Keyboard Handling**:
   - Do NOT wrap `<TextInput>` or form containers in `<TouchableWithoutFeedback onPress={Keyboard.dismiss}>` on Web (`Platform.OS === 'web'`).
   - Use `<ScrollView keyboardShouldPersistTaps="handled">` for form layouts to ensure web pointer compatibility and mobile keyboard dismissal.

3. **Inline Links**:
   - Do NOT nest `<Pressable>` inside parent `<Text>` components.
   - Use a `termsRow` layout (`flexDirection: 'row'`, `flexWrap: 'wrap'`) with standalone `<Pressable>` elements for inline links.

4. **Typography & Styling**:
   - Always import and use `TYPOGRAPHY`, `FONT_SIZE`, `FONT_WEIGHT`, `SPACING`, and `RADIUS` tokens from `@/constants/theme`.

