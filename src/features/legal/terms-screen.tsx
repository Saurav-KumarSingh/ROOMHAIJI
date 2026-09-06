import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useI18n } from '@/hooks/use-i18n';
import { useTheme } from '@/hooks/use-theme';

export function TermsScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();

  const handleClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/auth/phone');
    }
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, { color: theme.ink }]}>
            {t('auth.terms')} & Conditions
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.ink3 }]}>
            RoomHaiji Service Agreement
          </Text>
        </View>
        <Pressable
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close terms"
          style={({ pressed }) => [
            styles.closeButton,
            { backgroundColor: theme.surface, borderColor: theme.line },
            theme.sh1,
            pressed && styles.pressed,
          ]}>
          <Ionicons name="close" size={22} color={theme.ink} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }, theme.sh1]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            1. Acceptance of Terms
          </Text>
          <Text style={[styles.paragraph, { color: theme.ink2 }]}>
            By downloading, accessing, or using RoomHaiji, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            2. Mobile Verification & Account
          </Text>
          <Text style={[styles.paragraph, { color: theme.ink2 }]}>
            You register using a valid mobile phone number verified via a One-Time Password (OTP). You are responsible for maintaining control of your phone number and account activities.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            3. Rent Management & Receipts
          </Text>
          <Text style={[styles.paragraph, { color: theme.ink2 }]}>
            RoomHaiji provides tools for landlords and tenants to record rental payments, generate receipts, and track due dates. RoomHaiji is a record-keeping assistant and does not act as a banking entity unless explicitly integrated.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            4. User Responsibilities
          </Text>
          <Text style={[styles.paragraph, { color: theme.ink2 }]}>
            Users agree to enter truthful rental data and tenant information. Fraudulent entries, unlawful rent manipulation, or unauthorized account access are strictly prohibited.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            5. Modifications & Support
          </Text>
          <Text style={[styles.paragraph, { color: theme.ink2 }]}>
            We reserve the right to update these terms at any time. Continued use of RoomHaiji after updates constitutes acceptance of the modified terms.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs / 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.md,
  },
  pressed: {
    opacity: 0.7,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  card: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: SPACING.sm,
  },
  paragraph: {
    fontSize: FONT_SIZE.base,
    lineHeight: 22,
  },
});
