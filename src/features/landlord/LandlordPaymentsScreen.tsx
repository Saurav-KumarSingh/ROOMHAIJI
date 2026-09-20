import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { memo, useCallback, useMemo, useState } from 'react';
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
import { useUser } from '@/context/user-context';
import { useTheme } from '@/hooks/use-theme';

// ── DEMO TRANSACTIONS DATA DECLARED ON THE FILE ──────────────────────────────
export type FilterCategory = 'All' | 'Received' | 'Pending' | 'Overdue' | 'Cash' | 'UPI';

export interface LandlordTransaction {
  id: string;
  tenantName: string;
  subtitle: string;
  amount: string;
  status: 'received_upi' | 'received_cash' | 'pending' | 'overdue';
  category: 'Received' | 'Pending' | 'Overdue' | 'Cash' | 'UPI';
  paymentMethod?: 'UPI' | 'Cash' | '—';
  date?: string;
  iconType: 'person' | 'clock';
}

export const DEMO_TRANSACTIONS: LandlordTransaction[] = [
  {
    id: '1',
    tenantName: 'Amit Kumar',
    subtitle: 'Rent — Aug 2026 · UPI · 5 Aug',
    amount: '₹12,000',
    status: 'received_upi',
    category: 'Received',
    paymentMethod: 'UPI',
    date: '5 Aug',
    iconType: 'person',
  },
  {
    id: '2',
    tenantName: 'Karan Patel',
    subtitle: 'Rent — Aug 2026 · UPI · 4 Aug',
    amount: '₹13,000',
    status: 'received_upi',
    category: 'Received',
    paymentMethod: 'UPI',
    date: '4 Aug',
    iconType: 'person',
  },
  {
    id: '3',
    tenantName: 'Sneha Rao',
    subtitle: 'Rent — Aug 2026 · Cash · 3 Aug',
    amount: '₹10,000',
    status: 'received_cash',
    category: 'Cash',
    paymentMethod: 'Cash',
    date: '3 Aug',
    iconType: 'person',
  },
  {
    id: '4',
    tenantName: 'Priya Sharma',
    subtitle: 'Rent — Aug 2026 · —',
    amount: '₹10,000',
    status: 'pending',
    category: 'Pending',
    paymentMethod: '—',
    iconType: 'clock',
  },
  {
    id: '5',
    tenantName: 'Rahul Singh',
    subtitle: 'Rent — Aug 2026 · —',
    amount: '₹12,000',
    status: 'overdue',
    category: 'Overdue',
    paymentMethod: '—',
    iconType: 'clock',
  },
];

// ── MEMOIZED TRANSACTION ROW COMPONENT ───────────────────────────────────────
const TransactionItemRow = memo(function TransactionItemRow({
  item,
  theme,
  onPress,
}: {
  item: LandlordTransaction;
  theme: any;
  onPress: (item: LandlordTransaction) => void;
}) {
  const isPerson = item.iconType === 'person';
  const isUpi = item.status === 'received_upi';
  const isCash = item.status === 'received_cash';
  const isPendingOrOverdue = item.status === 'pending' || item.status === 'overdue';

  // Badge styles matching mockup pixel for pixel
  let badgeBg = theme.okBg;
  let badgeColor = theme.ok;

  if (isCash) {
    badgeBg = '#DBEAFE'; // Light Blue
    badgeColor = '#2563EB';
  } else if (isPendingOrOverdue) {
    badgeBg = '#FEE2E2'; // Light Red
    badgeColor = '#DC2626';
  }

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.txRow,
        pressed && styles.pressedRow,
      ]}>
      <View
        style={[
          styles.txIconBox,
          {
            backgroundColor: isPerson ? theme.primary050 : theme.surface3,
          },
        ]}>
        <Ionicons
          name={isPerson ? 'person-outline' : 'time-outline'}
          size={20}
          color={isPerson ? theme.primary : theme.ink3}
        />
      </View>

      <View style={styles.txDetails}>
        <Text style={[styles.tenantName, { color: theme.ink }]}>
          {item.tenantName}
        </Text>
        <Text style={[styles.txSubtitle, { color: theme.ink3 }]}>
          {item.subtitle}
        </Text>
      </View>

      <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
        <Text style={[styles.badgeDot, { color: badgeColor }]}>● </Text>
        <Text style={[styles.badgeAmountText, { color: badgeColor }]}>
          {item.amount}
        </Text>
      </View>
    </Pressable>
  );
});

// ── MAIN LANDLORD PAYMENTS SCREEN ────────────────────────────────────────────
export function LandlordPaymentsScreen() {
  const { theme } = useTheme();
  const { user } = useUser();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  const filterPills: FilterCategory[] = useMemo(
    () => ['All', 'Received', 'Pending', 'Overdue', 'Cash', 'UPI'],
    []
  );

  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'All') return DEMO_TRANSACTIONS;
    if (activeFilter === 'Received')
      return DEMO_TRANSACTIONS.filter(
        (t) => t.status === 'received_upi' || t.status === 'received_cash'
      );
    if (activeFilter === 'Pending')
      return DEMO_TRANSACTIONS.filter((t) => t.status === 'pending');
    if (activeFilter === 'Overdue')
      return DEMO_TRANSACTIONS.filter((t) => t.status === 'overdue');
    if (activeFilter === 'Cash')
      return DEMO_TRANSACTIONS.filter((t) => t.paymentMethod === 'Cash');
    if (activeFilter === 'UPI')
      return DEMO_TRANSACTIONS.filter((t) => t.paymentMethod === 'UPI');
    return DEMO_TRANSACTIONS;
  }, [activeFilter]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home' as any);
    }
  }, []);

  const handleTxPress = useCallback((item: LandlordTransaction) => {
    if (item.status === 'pending' || item.status === 'overdue') {
      router.push({
        pathname: '/(tabs)/pay',
        params: { tenant: item.tenantName, amount: item.amount },
      } as any);
    }
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      
      {/* App Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: theme.surface2 }]}>
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go Back"
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <Ionicons name="arrow-back" size={20} color={theme.ink} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.ink }]}>Payments</Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Horizontal Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsContainer}>
          {filterPills.map((pill) => {
            const isActive = activeFilter === pill;
            return (
              <Pressable
                key={pill}
                onPress={() => setActiveFilter(pill)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isActive ? theme.primary : theme.surface,
                    borderColor: isActive ? theme.primary : theme.line,
                  },
                ]}>
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isActive ? '#FFFFFF' : theme.ink },
                  ]}>
                  {pill}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* August 2026 Rent Summary Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.line },
            theme.sh1,
          ]}>
          <Text style={[styles.cardCaptionLabel, { color: theme.ink3 }]}>
            AUGUST 2026
          </Text>

          <View style={styles.summaryRowsContainer}>
            {/* Expected Row */}
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.ink3 }]}>
                Expected
              </Text>
              <Text style={[styles.statValueBold, { color: theme.ink }]}>
                ₹1,85,000
              </Text>
            </View>

            {/* Collected Row */}
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.ink3 }]}>
                Collected
              </Text>
              <Text style={[styles.statValueBold, { color: theme.ok }]}>
                ₹1,55,000
              </Text>
            </View>

            {/* Pending Row */}
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.ink3 }]}>
                Pending
              </Text>
              <Text style={[styles.statValueBold, { color: theme.warn }]}>
                ₹30,000
              </Text>
            </View>
          </View>
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <Text style={[styles.sectionTitleHeader, { color: theme.ink3 }]}>
            TRANSACTIONS
          </Text>

          <View
            style={[
              styles.card,
              styles.txListCard,
              { backgroundColor: theme.surface, borderColor: theme.line },
              theme.sh1,
            ]}>
            {filteredTransactions.map((tx, index) => (
              <React.Fragment key={tx.id}>
                {index > 0 && (
                  <View
                    style={[styles.dividerLine, { backgroundColor: theme.line2 }]}
                  />
                )}
                <TransactionItemRow
                  item={tx}
                  theme={theme}
                  onPress={handleTxPress}
                />
              </React.Fragment>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  pressed: {
    opacity: 0.7,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xxl,
    gap: SPACING.xl,
  },

  /* Filter Pills */
  filterPillsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: 4,
  },
  filterPill: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },

  /* Cards */
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    gap: SPACING.md,
  },
  cardCaptionLabel: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
  },
  summaryRowsContainer: {
    gap: SPACING.xs + 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
  },
  statValueBold: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.heavy,
  },

  /* Transactions Section */
  transactionsSection: {
    gap: SPACING.sm,
  },
  sectionTitleHeader: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    marginLeft: 2,
  },
  txListCard: {
    paddingVertical: SPACING.xs,
    gap: 0,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  pressedRow: {
    opacity: 0.8,
  },
  txIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDetails: {
    flex: 1,
    gap: 2,
  },
  tenantName: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  txSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  badgeDot: {
    fontSize: 10,
  },
  badgeAmountText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  dividerLine: {
    height: 1,
    width: '100%',
  },
});
