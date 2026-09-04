import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RADIUS, SPACING } from '@/constants/theme';
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
    // Only accept numbers up to 10 digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
  }, []);

  const isValidPhone = phoneNumber.length === 10;

  const handleSendOtp = useCallback(() => {
    if (!isValidPhone) return;
    Keyboard.dismiss();
    // Navigate to tabs/home or OTP verification
    router.push({
      pathname: '/(tabs)/home',
      params: { role: params.role || 'tenant', phone: phoneNumber },
    } as any);
  }, [isValidPhone, phoneNumber, params.role]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <View style={styles.container}>
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

            {/* Header */}
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
                {/* <Text style={[styles.requiredAsterisk, { color: theme.danger }]}> *</Text> */}
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
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="XXXXX XXXXX"
                  placeholderTextColor={theme.ink3}
                  keyboardType="phone-pad"
                  maxLength={10}
                  accessibilityLabel={t('auth.phoneLabel')}
                />
              </View>

              {/* Privacy Note */}
              {/* <View style={styles.privacyRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={15}
                  color={theme.ink3}
                  style={styles.shieldIcon}
                />
                <Text style={[styles.privacyText, { color: theme.ink3 }]}>
                  {t('auth.phonePrivacy')}
                </Text>
              </View> */}
            </View>
            <View style={{flex:1}}/>

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
              <Text style={styles.sendOtpText}>{t('auth.sendOtp')}</Text>
            </Pressable>

            {/* Terms and Privacy Disclaimer */}
            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: theme.ink3 }]}>
                {t('auth.termsNotice')}{' '}
                <Text style={[styles.linkText, { color: theme.primary }]}>
                  {t('auth.terms')}
                </Text>{' '}
                {t('auth.and')}{' '}
                <Text style={[styles.linkText, { color: theme.primary }]}>
                  {t('auth.privacy')}
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  container: {
    flex: 1,
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
    marginVertical: 28,
    gap: SPACING.xs,

  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  formGroup: {
    marginTop: 32,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  requiredAsterisk: {
    fontSize: 14,
    fontWeight: '700',
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
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SPACING.lg,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.md,
    gap: 6,
    paddingHorizontal: 2,
  },
  shieldIcon: {
    marginTop: 1,
  },
  privacyText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  sendOtpButton: {
    marginTop: 28,
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOtpText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  termsContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  termsText: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    fontWeight: '600',
  },
});

