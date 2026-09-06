import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
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

import {
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { useI18n } from '@/hooks/use-i18n';
import { useTheme } from '@/hooks/use-theme';

export function PhoneLoginScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ role?: string }>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, []);

  const handlePhoneChange = useCallback((text: string) => {
    // Clean non-digit characters and truncate to 10 digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
  }, []);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const isValidPhone = phoneNumber.length === 10;

  const handleSendOtp = useCallback(() => {
    if (!isValidPhone) return;
    Keyboard.dismiss();
    router.push({
      pathname: '/auth/otp',
      params: { role: params.role || 'tenant', phone: phoneNumber },
    } as any);
  }, [isValidPhone, phoneNumber, params.role]);

  const handleTermsPress = useCallback(() => {
    router.push('/auth/terms');
  }, []);

  const handlePrivacyPress = useCallback(() => {
    router.push('/auth/privacy');
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          {/* Back Button */}
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
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

          {/* Header Section */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.ink }]}>
              {t('auth.phoneTitle')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.ink3 }]}>
              {t('auth.phoneSub')}
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: theme.ink }]}>
                {t('auth.phoneLabel')}
              </Text>
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.surface,
                  borderColor: isFocused ? theme.primary : theme.line,
                },
              ]}>
              {/* Country Code Prefix */}
              <View
                style={[
                  styles.countryCodeBadge,
                  {
                    backgroundColor: theme.surface3,
                    borderRightColor: theme.line,
                  },
                ]}>
                <Text style={[styles.countryCodeText, { color: theme.ink2 }]}>
                  +91
                </Text>
              </View>

              {/* Phone Input */}
              <TextInput
                style={[styles.input, { color: theme.ink }]}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="XXXXX XXXXX"
                placeholderTextColor={theme.ink3}
                keyboardType="phone-pad"
                maxLength={10}
                accessibilityLabel={t('auth.phoneLabel')}
              />
            </View>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Send OTP Action Button */}
          <Pressable
            onPress={handleSendOtp}
            disabled={!isValidPhone}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isValidPhone }}
            style={({ pressed }) => [
              styles.sendOtpButton,
              {
                backgroundColor: theme.primary,
                opacity: isValidPhone ? (pressed ? 0.85 : 1) : 0.5,
              },
              isValidPhone ? theme.sh2 : undefined,
            ]}>
            <Text style={[styles.sendOtpText, { color: theme.white }]}>
              {t('auth.sendOtp')}
            </Text>
          </Pressable>

          {/* Terms and Privacy Disclaimer */}
          <View style={styles.termsContainer}>
            <View style={styles.termsRow}>
              <Text style={[styles.termsText, { color: theme.ink3 }]}>
                {t('auth.termsNotice')}
              </Text>
              <Pressable
                onPress={handleTermsPress}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={t('auth.terms')}
                style={({ pressed }) => pressed && styles.linkPressed}>
                <Text style={[styles.linkText, { color: theme.primary }]}>
                  {t('auth.terms')}
                </Text>
              </Pressable>
              <Text style={[styles.termsText, { color: theme.ink3 }]}>
                {t('auth.and')}
              </Text>
              <Pressable
                onPress={handlePrivacyPress}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={t('auth.privacy')}
                style={({ pressed }) => pressed && styles.linkPressed}>
                <Text style={[styles.linkText, { color: theme.primary }]}>
                  {t('auth.privacy')}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: SPACING.xxl,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxl,
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
  header: {
    marginVertical: SPACING.xl + SPACING.sm,
    gap: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    marginTop: SPACING.xs,
  },
  formGroup: {
    marginTop: SPACING.xl + SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.label,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  countryCodeBadge: {
    paddingHorizontal: SPACING.lg,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
  },
  countryCodeText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SPACING.lg,
    ...TYPOGRAPHY.input,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  spacer: {
    flex: 1,
    minHeight: SPACING.xxl + SPACING.lg,
  },
  sendOtpButton: {
    marginTop: SPACING.xxl,
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOtpText: {
    ...TYPOGRAPHY.button,
  },
  termsContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  termsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  termsText: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  linkText: {
    ...TYPOGRAPHY.caption,
    fontWeight: FONT_WEIGHT.semibold,
  },
  linkPressed: {
    opacity: 0.7,
  },
});
