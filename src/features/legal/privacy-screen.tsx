import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useI18n } from '@/hooks/use-i18n';
import { useTheme } from '@/hooks/use-theme';

export function PrivacyScreen() {
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
            {t('auth.privacy')} Policy
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.ink3 }]}>
            How RoomHaiji Protects Your Data
          </Text>
        </View>
        <Pressable
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close privacy policy"
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
            1. Information Collection
          </Text>
          <Text style={[styles.paragraph, { color: theme.ink2 }]}>
            RoomHaiji collects your phone number for authentication. Optional property names, tenant details, and rent amounts are stored securely to generate your rent ledger and receipts.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            2. Data Usage & Security
          </Text>
          <Text style={[styles.paragraph, { color: theme.ink2 }]}>
            Your phone number and rent records are encrypted in transit and at rest. We never sell your personal information or tenant records to third parties for advertising.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            3. Sharing & Communication
          </Text>
          <Text style={[styles.paragraph, { color: theme.ink2 }]}>
            Rent receipts and reminders are only shared when initiated directly by you (for example, via WhatsApp or PDF download).
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            4. Your Rights
          </Text>
          <Text style={[styles.paragraph, { color: theme.ink2 }]}>
            You may request deletion of your account and rental history at any time through the app settings or support channel.
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
