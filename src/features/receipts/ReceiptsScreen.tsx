import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ReceiptDetailModal, ReceiptItem } from './ReceiptDetailModal';

const INITIAL_RECEIPTS: ReceiptItem[] = [
  {
    id: 'receipt-aug-2026',
    month: 'Aug 2026',
    amount: '₹12,000',
    paidDate: '5 Aug 2026',
    transactionId: 'TXN-940218',
    landlordName: 'Rajesh Sharma',
    propertyName: 'Sharma Building',
    roomNo: '204',
  },
  {
    id: 'receipt-jul-2026',
    month: 'Jul 2026',
    amount: '₹12,000',
    paidDate: '5 Jul 2026',
    transactionId: 'TXN-839102',
    landlordName: 'Rajesh Sharma',
    propertyName: 'Sharma Building',
    roomNo: '204',
  },
  {
    id: 'receipt-jun-2026',
    month: 'Jun 2026',
    amount: '₹12,000',
    paidDate: '5 Jun 2026',
    transactionId: 'TXN-728103',
    landlordName: 'Rajesh Sharma',
    propertyName: 'Sharma Building',
    roomNo: '204',
  },
];

export const ReceiptsScreen = memo(function ReceiptsScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    userName?: string;
    fullName?: string;
    empty?: string;
  }>();

  // Avatar initials
  const displayName = params.userName || params.fullName || 'Amit';
  const initials = useMemo(
    () =>
      displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'AK',
    [displayName],
  );

  // State management
  const [receiptsList, setReceiptsList] = useState<ReceiptItem[]>(
    params.empty === 'true' ? [] : INITIAL_RECEIPTS,
  );
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home');
    }
  }, []);

  const handlePayRentPress = useCallback(() => {
    router.push('/(tabs)/pay' as any);
  }, []);

  const toggleEmptyState = useCallback(() => {
    setReceiptsList((prev) => (prev.length > 0 ? [] : INITIAL_RECEIPTS));
  }, []);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.surface2 }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <Pressable
            accessibilityLabel="Back"
            accessibilityRole="button"
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={22} color={theme.ink} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.ink }]}>
            My Receipts
          </Text>

          {/* User Initials Avatar Badge */}
          <Pressable
            accessibilityLabel="Toggle Demo Empty State"
            accessibilityRole="button"
            onPress={toggleEmptyState}
            style={({ pressed }) => [
              styles.avatarBadge,
              { backgroundColor: theme.primary050 },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {initials}
            </Text>
          </Pressable>
        </View>

        {/* Content: Receipts List vs Empty State */}
        {receiptsList.length > 0 ? (
          <>
            {/* Month Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.ink3 }]}>
                AUGUST 2026
              </Text>
            </View>

            {/* Receipts Card List */}
            <View
              style={[
                styles.receiptsCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.line,
                },
                theme.sh1,
              ]}
            >
              {receiptsList.map((item, index) => {
                const isLast = index === receiptsList.length - 1;
                return (
                  <View key={item.id}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`View receipt for ${item.month}`}
                      onPress={() => setSelectedReceipt(item)}
                      style={({ pressed }) => [
                        styles.receiptRow,
                        pressed && styles.pressedRow,
                      ]}
                    >
                      <View style={styles.receiptCol}>
                        <Text style={[styles.receiptTitle, { color: theme.ink }]}>
                          Rent Receipt · {item.month}
                        </Text>
                        <Text style={[styles.receiptSubtitle, { color: theme.ink3 }]}>
                          {item.amount} · Paid {item.paidDate.replace(` ${item.month.split(' ')[1]}`, '')}
                        </Text>
                      </View>

                      {/* Status Check Badge */}
                      <View style={[styles.statusBadge, { backgroundColor: theme.okBg }]}>
                        <Ionicons name="ellipse" size={6} color={theme.ok} style={styles.statusDot} />
                        <Ionicons name="checkmark" size={14} color={theme.ok} />
                      </View>
                    </Pressable>

                    {!isLast && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: theme.line2 },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          /* Empty State View */
          <View
            style={[
              styles.emptyStateCard,
              { backgroundColor: theme.surface, borderColor: theme.line },
              theme.sh1,
            ]}
          >
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.primary050 }]}>
              <Ionicons name="document-text-outline" size={42} color={theme.primary} />
            </View>

            <Text style={[styles.emptyTitle, { color: theme.ink }]}>
              No Receipts Available
            </Text>

            <Text style={[styles.emptySubtitle, { color: theme.ink3 }]}>
              You don&apos;t have any rent receipts generated yet. Once you pay your rent, your official receipts will appear here automatically.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pay Rent Now"
              onPress={handlePayRentPress}
              style={({ pressed }) => [
                styles.emptyActionBtn,
                { backgroundColor: theme.primary },
                theme.sh2,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="card-outline" size={20} color={theme.white} style={styles.btnIcon} />
              <Text style={[styles.emptyActionBtnText, { color: theme.white }]}>
                Pay Rent Now
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Receipt Detail Modal */}
      <ReceiptDetailModal
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
        visible={!!selectedReceipt}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  /* Header Bar */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    height: 44,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },

  /* Section Header */
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  /* Receipts List Card */
  receiptsCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  receiptCol: {
    flex: 1,
    gap: 4,
  },
  receiptTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  receiptSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusDot: {
    marginRight: 1,
  },
  divider: {
    height: 1,
    width: '100%',
  },

  /* Empty State */
  emptyStateCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.xxl,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.h3,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.base,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xxl,
  },
  emptyActionBtn: {
    width: '100%',
    height: 50,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyActionBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  btnIcon: {
    marginRight: SPACING.sm,
  },

  pressed: {
    opacity: 0.8,
  },
  pressedRow: {
    opacity: 0.7,
  },
});
