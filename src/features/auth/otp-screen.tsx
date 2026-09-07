import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export function OtpScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ role?: string; phone?: string }>();

  const [otpCode, setOtpCode] = useState('');
  const [isFocused, setIsFocused] = useState(true);
  const [timer, setTimer] = useState<number>(RESEND_COOLDOWN_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const hiddenInputRef = useRef<TextInput | null>(null);

  // Format phone number for display
  const rawPhone = params.phone || '9820123456';
  const formattedPhone =
    rawPhone.length === 10
      ? `${rawPhone.slice(0, 5)} ${rawPhone.slice(5)}`
      : rawPhone;

  // Active countdown timer for resend OTP
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus hidden input on mount to instantly receive typing without clicking
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(focusTimer);
  }, []);

  const formattedTimer = `${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`;

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/auth/phone');
    }
  }, []);

  const handleChangeText = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    setOtpCode(cleaned);
  }, []);

  const handleContainerPress = useCallback(() => {
    if (!isVerifying) {
      hiddenInputRef.current?.focus();
    }
  }, [isVerifying]);

  const handleResendOtp = useCallback(() => {
    if (timer > 0 || isVerifying) return;
    setOtpCode('');
    setTimer(RESEND_COOLDOWN_SECONDS);
    hiddenInputRef.current?.focus();
  }, [timer, isVerifying]);

  const isValidOtp = otpCode.length === OTP_LENGTH;

  const handleVerify = useCallback(() => {
    if (!isValidOtp || isVerifying) return;
    Keyboard.dismiss();
    setIsVerifying(true);

    setTimeout(() => {
      if (params.role === 'landlord') {
        router.replace({
          pathname: '/auth/landlord-onboarding',
          params: { role: 'landlord', phone: rawPhone },
        } as any);
      } else {
        router.replace({
          pathname: '/(tabs)/home',
          params: { role: params.role || 'tenant', phone: rawPhone },
        } as any);
      }
    }, 1200);
  }, [isValidOtp, isVerifying, params.role, rawPhone]);

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
            disabled={isVerifying}
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
              {t('auth.otp')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.ink3 }]}>
              Enter the 6-digit code sent to{' '}
              <Text style={[styles.phoneHighlight, { color: theme.ink }]}>
                +91 {formattedPhone}
              </Text>
            </Text>
          </View>

          {/* Input Section - Container captures taps and delegates to full overlay TextInput */}
          <View style={styles.formGroup}>
            <Pressable onPress={handleContainerPress} style={styles.otpContainer}>
              {/* 6 Visual OTP Boxes */}
              <View style={styles.otpRow}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                  const digit = otpCode[index] || '';
                  const isCurrentBox =
                    isFocused &&
                    (index === otpCode.length ||
                      (index === OTP_LENGTH - 1 && otpCode.length === OTP_LENGTH));

                  return (
                    <View
                      key={index}
                      style={[
                        styles.otpBox,
                        {
                          backgroundColor: theme.surface,
                          borderColor: isCurrentBox ? theme.primary : theme.line,
                        },
                        isCurrentBox && styles.otpBoxActive,
                      ]}>
                      <Text style={[styles.otpBoxText, { color: theme.ink }]}>
                        {digit}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Full Overlay Invisible TextInput for 100% Instant Focus & Auto-Fill */}
              <TextInput
                ref={hiddenInputRef}
                style={styles.hiddenInput}
                value={otpCode}
                onChangeText={handleChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                autoFocus
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                editable={!isVerifying}
                accessibilityLabel="OTP Verification Code"
              />
            </Pressable>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Resend OTP Link - Placed right above the main action button */}
          <View style={styles.resendContainer}>
            <Pressable
              onPress={handleResendOtp}
              disabled={timer > 0 || isVerifying}
              hitSlop={8}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.linkPressable,
                pressed && timer === 0 && styles.pressedLink,
              ]}>
              <Text
                style={[
                  styles.resendText,
                  {
                    color: timer > 0 ? theme.ink3 : theme.primary,
                    fontWeight: timer > 0 ? FONT_WEIGHT.medium : FONT_WEIGHT.semibold,
                  },
                ]}>
                {timer > 0
                  ? `${t('auth.resend')} in ${formattedTimer}`
                  : t('auth.resend')}
              </Text>
            </Pressable>
          </View>

          {/* Verify & Continue Action Button */}
          <Pressable
            onPress={handleVerify}
            disabled={!isValidOtp || isVerifying}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isValidOtp || isVerifying }}
            style={({ pressed }) => [
              styles.verifyButton,
              {
                backgroundColor: theme.primary,
                opacity: isValidOtp && !isVerifying ? (pressed ? 0.85 : 1) : 0.5,
              },
              isValidOtp && !isVerifying ? theme.sh2 : undefined,
            ]}>
            <Text style={[styles.verifyText, { color: theme.white }]}>
              {t('auth.verify')}
            </Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Overlay with Blur effect */}
      {isVerifying && (
        <View style={[StyleSheet.absoluteFill, styles.blurOverlay]}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.white} />
            <Text style={[styles.loadingText, { color: theme.white }]}>
              Please wait...
            </Text>
          </View>
        </View>
      )}
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
  phoneHighlight: {
    fontWeight: FONT_WEIGHT.bold,
  },
  formGroup: {
    marginTop: SPACING.xl + SPACING.md,
  },
  otpContainer: {
    position: 'relative',
    width: '100%',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  otpBoxActive: {
    borderWidth: 2,
  },
  otpBoxText: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0.01,
    color: 'transparent',
    fontSize: 1,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  spacer: {
    flex: 1,
    minHeight: SPACING.xxl + SPACING.lg,
  },
  resendContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  linkPressable: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  resendText: {
    fontSize: FONT_SIZE.base,
    textAlign: 'center',
  },
  pressedLink: {
    opacity: 0.7,
  },
  verifyButton: {
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyText: {
    ...TYPOGRAPHY.button,
  },
  blurOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(10px)' } : {}),
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
});
