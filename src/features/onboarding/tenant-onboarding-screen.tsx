import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingBlurOverlay } from '@/components/loading-blur-overlay';
import {
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function TenantOnboardingScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ phone?: string; role?: string }>();

  const [fullName, setFullName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [focusedField, setFocusedField] = useState<'name' | 'code' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inviteCodeInputRef = useRef<TextInput | null>(null);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/auth/otp',
        params: { role: params.role || 'tenant', phone: params.phone },
      } as any);
    }
  }, [params.role, params.phone]);

  // Support Android hardware back button cleanly
  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [handleBack]);

  const handleSubmit = useCallback(() => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!inviteCode.trim()) {
      setError('Please enter your property or room invite code');
      return;
    }

    setError(null);
    Keyboard.dismiss();
    setIsSubmitting(true);

    setTimeout(() => {
      router.replace({
        pathname: '/(tabs)/home',
        params: {
          role: 'tenant',
          phone: params.phone || '',
          userName: fullName.trim(),
          inviteCode: inviteCode.trim(),
        },
      } as any);
    }, 1000);
  }, [fullName, inviteCode, params.phone]);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : Platform.OS === 'android'
              ? 'height'
              : undefined
        }
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Top Header Bar */}
          <View style={styles.topHeader}>
            <Pressable
              onPress={handleBack}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.line,
                },
                theme.sh1,
                pressed && styles.backButtonPressed,
              ]}>
              <Ionicons name="arrow-back" size={20} color={theme.ink} />
            </Pressable>

            <Text style={[styles.headerTag, { color: theme.ink3 }]}>
              TENANT SETUP
            </Text>
          </View>

          {/* Setup Progress Bar */}
          <View style={[styles.progressTrack, { backgroundColor: theme.line }]}>
            <View style={[styles.progressBar, { backgroundColor: theme.primary }]} />
          </View>

          {/* Header Title Section */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.ink }]}>
              Welcome! Join your rental
            </Text>
            <Text style={[styles.subtitle, { color: theme.ink3 }]}>
              Enter your details and property code provided by your landlord.
            </Text>
          </View>

          {/* Validation Error Message */}
          {error && (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: theme.dangerBg, borderColor: theme.danger },
              ]}>
              <Ionicons name="alert-circle" size={18} color={theme.danger} />
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {error}
              </Text>
            </View>
          )}

          {/* Form Fields Container */}
          <View style={styles.form}>
            {/* Full Name Field */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.ink }]}>
                Full Name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={(val) => {
                  setFullName(val);
                  if (error) setError(null);
                }}
                placeholder="e.g. Amit Kumar"
                placeholderTextColor={theme.ink3}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                editable={!isSubmitting}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => inviteCodeInputRef.current?.focus()}
                selectionColor={theme.primary}
                cursorColor={theme.primary}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    borderColor:
                      focusedField === 'name' ? theme.primary : theme.line,
                    color: theme.ink,
                  },
                ]}
              />
            </View>

            {/* Property / Room Invite Code Field */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.ink }]}>
                Property / Room Invite Code
              </Text>
              <TextInput
                ref={inviteCodeInputRef}
                value={inviteCode}
                onChangeText={(val) => {
                  setInviteCode(val);
                  if (error) setError(null);
                }}
                placeholder="e.g. SB-204"
                placeholderTextColor={theme.ink3}
                onFocus={() => setFocusedField('code')}
                onBlur={() => setFocusedField(null)}
                editable={!isSubmitting}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                selectionColor={theme.primary}
                cursorColor={theme.primary}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    borderColor:
                      focusedField === 'code' ? theme.primary : theme.line,
                    color: theme.ink,
                  },
                ]}
              />
            </View>

            {/* Helpful Tip Card */}
            <View
              style={[
                styles.tipCard,
                {
                  backgroundColor: theme.surface3,
                  borderColor: theme.line2,
                },
              ]}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={theme.ink}
                style={styles.tipIcon}
              />
              <Text style={[styles.tipText, { color: theme.ink2 }]}>
                <Text style={{ fontWeight: FONT_WEIGHT.bold, color: theme.ink }}>
                  Tip:{' '}
                </Text>
                Your landlord can share this code with you, or you can join directly.
              </Text>
            </View>
          </View>

          {/* Flexible Spacer - Matches OTP & Phone Screen Layout */}
          <View style={styles.spacer} />

          {/* Submit Action Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Complete Setup & View Rent"
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: theme.primary,
                opacity: isSubmitting ? 0.7 : pressed ? 0.88 : 1,
              },
              !isSubmitting && theme.sh2,
            ]}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color={theme.white} />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={[styles.submitText, { color: theme.white }]}>
                  Complete Setup & View Rent
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={theme.white}
                  style={styles.buttonArrow}
                />
              </View>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingBlurOverlay visible={isSubmitting} message="Please wait..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxl,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    height: 42,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTag: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    textAlign: 'right',
  },
  progressTrack: {
    width: '100%',
    height: 5,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  progressBar: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.full,
  },
  header: {
    marginBottom: SPACING.xl,
    gap: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    marginTop: SPACING.xs,
    lineHeight: 22,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    flex: 1,
  },
  form: {
    gap: SPACING.xl,
  },
  fieldGroup: {
    gap: SPACING.xs + 2,
  },
  label: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  input: {
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.lg,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : 0,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.medium,
    textAlignVertical: 'center',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.xs,
    gap: SPACING.md,
  },
  tipIcon: {
    alignSelf: 'flex-start',
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZE.base - 0.5,
    lineHeight: 21,
  },
  spacer: {
    flex: 1,
    minHeight: SPACING.xxl + SPACING.lg,
  },
  submitButton: {
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
  },
  submitText: {
    ...TYPOGRAPHY.button,
  },
  buttonArrow: {
    marginTop: Platform.OS === 'ios' ? 0 : 1,
  },
});
