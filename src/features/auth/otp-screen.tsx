import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
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

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [timer, setTimer] = useState<number>(RESEND_COOLDOWN_SECONDS);
  const inputRefs = useRef<(TextInput | null)[]>([]);

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

  const formattedTimer = `${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`;

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/auth/phone');
    }
  }, []);

  const handleChangeText = useCallback(
    (text: string, index: number) => {
      const cleaned = text.replace(/[^0-9]/g, '');
      if (cleaned.length > 1) {
        const newOtp = Array(OTP_LENGTH).fill('');
        for (let i = 0; i < Math.min(cleaned.length, OTP_LENGTH); i++) {
          newOtp[i] = cleaned[i];
        }
        setOtp(newOtp);
        const lastIndex = Math.min(cleaned.length - 1, OTP_LENGTH - 1);
        inputRefs.current[lastIndex]?.focus();
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = cleaned;
      setOtp(newOtp);

      if (cleaned !== '' && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        if (otp[index] === '' && index > 0) {
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
          inputRefs.current[index - 1]?.focus();
        }
      }
    },
    [otp],
  );

  const handleResendOtp = useCallback(() => {
    if (timer > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimer(RESEND_COOLDOWN_SECONDS);
    inputRefs.current[0]?.focus();
  }, [timer]);

  const otpCode = otp.join('');
  const isValidOtp = otpCode.length === OTP_LENGTH;

  const handleVerify = useCallback(() => {
    if (!isValidOtp) return;
    Keyboard.dismiss();
    router.push({
      pathname: '/(tabs)/home',
      params: { role: params.role || 'tenant', phone: rawPhone },
    } as any);
  }, [isValidOtp, params.role, rawPhone]);

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
              {t('auth.otp')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.ink3 }]}>
              Enter the 6-digit code sent to{' '}
              <Text style={[styles.phoneHighlight, { color: theme.ink }]}>
                +91 {formattedPhone}
              </Text>
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.formGroup}>
            {/* 6-Digit OTP Inputs */}
            <View style={styles.otpRow}>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                const isFocused = focusedIndex === index;
                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      {
                        backgroundColor: theme.surface,
                        borderColor: isFocused ? theme.primary : theme.line,
                      },
                    ]}>
                    <TextInput
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      style={[styles.otpInput, { color: theme.ink }]}
                      value={otp[index]}
                      onChangeText={(text) => handleChangeText(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      keyboardType="number-pad"
                      maxLength={index === 0 ? OTP_LENGTH : 1}
                      selectTextOnFocus
                      accessibilityLabel={`OTP digit ${index + 1}`}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Resend OTP Link - Placed right above the main action button */}
          <View style={styles.resendContainer}>
            <Pressable
              onPress={handleResendOtp}
              disabled={timer > 0}
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
            disabled={!isValidOtp}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isValidOtp }}
            style={({ pressed }) => [
              styles.verifyButton,
              {
                backgroundColor: theme.primary,
                opacity: isValidOtp ? (pressed ? 0.85 : 1) : 0.5,
              },
              isValidOtp ? theme.sh2 : undefined,
            ]}>
            <Text style={[styles.verifyText, { color: theme.white }]}>
              {t('auth.verify')}
            </Text>
          </Pressable>

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
  phoneHighlight: {
    fontWeight: FONT_WEIGHT.bold,
  },
  formGroup: {
    marginTop: SPACING.xl + SPACING.md,
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
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
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
});
