import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Modal,
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
  TYPOGRAPHY,
} from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { useTheme } from '@/hooks/use-theme';

// ── MEMOIZED ATTENTION ITEM ROW ──────────────────────────────────────────────
interface AttentionItemProps {
  name: string;
  room: string;
  statusText: string;
  statusType: 'red' | 'amber';
  amount: string;
  theme: any;
  onCollect: (name: string, amount: string) => void;
}

const AttentionItemRow = memo(function AttentionItemRow({
  name,
  room,
  statusText,
  statusType,
  amount,
  theme,
  onCollect,
}: AttentionItemProps) {
  const handlePress = useCallback(() => {
    onCollect(name, amount);
  }, [name, amount, onCollect]);

  const isRed = statusType === 'red';

  return (
    <View style={styles.attentionRow}>
      <View style={styles.attentionDotWrapper}>
        <Text style={isRed ? styles.statusDotRed : styles.statusDotAmber}>● </Text>
      </View>
      <View style={styles.attentionDetails}>
        <Text style={[styles.tenantNameText, { color: theme.ink }]}>
          {name} · <Text style={styles.roomText}>Room {room}</Text>
        </Text>
        <Text
          style={[
            styles.overdueSubText,
            { color: isRed ? theme.danger : theme.ink3 },
          ]}>
          {statusText} · ₹{amount}
        </Text>
      </View>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          isRed ? styles.collectBtnLightRed : styles.collectBtnAmber,
          pressed && styles.pressed,
        ]}>
        <Text style={isRed ? styles.collectBtnLightRedText : styles.collectBtnAmberText}>
          Collect
        </Text>
      </Pressable>
    </View>
  );
});

// ── MAIN HOMESCREEN COMPONENT ────────────────────────────────────────────────
export function HomeScreen() {
  const { theme, isDark, themeMode, setThemeMode, toggleTheme } = useTheme();
  const { user, toggleRole, initials } = useUser();

  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  const isLandlord = user.role === 'landlord';

  const handlePrimaryAction = useCallback(() => {
    router.push({
      pathname: '/(tabs)/pay',
      params: { role: isLandlord ? 'landlord' : 'tenant' },
    } as any);
  }, [isLandlord]);

  const handleCollectItem = useCallback((tenantName: string, amount: string) => {
    router.push({
      pathname: '/(tabs)/pay',
      params: { tenant: tenantName, amount },
    } as any);
  }, []);

  const handleNavProfile = useCallback(() => {
    router.push({ pathname: '/(tabs)/profile', params: { role: user.role } } as any);
  }, [user.role]);

  const handleNavQuickAction = useCallback((path: string) => {
    router.push({ pathname: path, params: { role: user.role } } as any);
  }, [user.role]);

  // Mock attention items data
  const attentionItems = useMemo(
    () => [
      { id: '1', name: 'Rahul Singh', room: '103', statusText: 'Overdue by 3 days', statusType: 'red' as const, amount: '12,000' },
      { id: '2', name: 'Priya Sharma', room: '105', statusText: 'Due today', statusType: 'amber' as const, amount: '10,000' },
      { id: '3', name: 'Neha Verma', room: '104', statusText: 'Due in 2 days', statusType: 'amber' as const, amount: '11,000' },
    ],
    []
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── TOP HEADER SECTION ────────────────────────────────────────────── */}
        <View style={styles.topHeader}>
          <View style={styles.greetingContainer}>
            <View style={styles.nameRow}>
              <Text style={[styles.greetingText, { color: theme.ink }]}>
                Hi {user.name}
              </Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>

            <View style={styles.subRow}>
              <Pressable
                onPress={toggleRole}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.roleBadge,
                  { backgroundColor: isLandlord ? theme.accent050 : theme.primary050 },
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.roleBadgeText,
                    { color: isLandlord ? theme.accent600 : theme.primary },
                  ]}>
                  {isLandlord ? '👑 Landlord' : '🏠 Tenant'}
                </Text>
                <Ionicons
                  name="swap-horizontal-outline"
                  size={12}
                  color={isLandlord ? theme.accent600 : theme.primary}
                />
              </Pressable>

              <Text style={[styles.subtitleText, { color: theme.ink3 }]}>
                {user.property} · Aug 2026
              </Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            {/* Quick Theme Switcher */}
            <Pressable
              onPress={toggleTheme}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Toggle Theme Mode"
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: theme.surface, borderColor: theme.line },
                pressed && styles.pressed,
              ]}>
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={18}
                color={isDark ? '#FBBF24' : theme.ink}
              />
            </Pressable>

            {/* Notification Bell */}
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: theme.surface, borderColor: theme.line },
                pressed && styles.pressed,
              ]}>
              <Ionicons name="notifications-outline" size={20} color={theme.ink} />
              <View style={styles.notifDot} />
            </Pressable>

            {/* User Avatar Circle -> Navigates to Profile */}
            <Pressable
              onPress={handleNavProfile}
              accessibilityRole="button"
              accessibilityLabel="My Profile"
              style={({ pressed }) => [
                styles.avatarCircle,
                { backgroundColor: theme.primary050, borderColor: theme.primary },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {initials}
              </Text>
              <View style={styles.avatarDot} />
            </Pressable>
          </View>
        </View>

        {isLandlord ? (
          /* ── LANDLORD HOME UI ───────────────────────────────────────────── */
          <>
            {/* Summary Card */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }, theme.sh1]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardCaptionLabel, { color: theme.ink3 }]}>
                  RENT COLLECTED · AUG 2026
                </Text>
                <View style={[styles.paidPillBadge, { backgroundColor: theme.okBg }]}>
                  <Text style={[styles.paidPillDot, { color: theme.ok }]}>● </Text>
                  <Text style={[styles.paidPillText, { color: theme.ok }]}>84% paid</Text>
                </View>
              </View>

              <Text style={[styles.mainAmountText, { color: theme.ink }]}>
                ₹1,55,000
              </Text>

              {/* Progress Bar */}
              <View style={[styles.progressBarTrack, { backgroundColor: theme.surface3 }]}>
                <View style={[styles.progressBarFill, { width: '84%', backgroundColor: theme.primary }]} />
              </View>

              <Text style={[styles.pendingSubText, { color: theme.ink3 }]}>
                Pending <Text style={{ color: theme.ink, fontWeight: FONT_WEIGHT.bold }}>₹30,000</Text> from <Text style={{ color: theme.ink, fontWeight: FONT_WEIGHT.bold }}>3 units</Text>
              </Text>
            </View>

            {/* Needs Your Attention Section */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitleHeader, { color: theme.ink3 }]}>
                NEEDS YOUR ATTENTION
              </Text>

              <View style={[styles.card, styles.attentionListCard, { backgroundColor: theme.surface, borderColor: theme.line }, theme.sh1]}>
                {attentionItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <View style={[styles.dividerLine, { backgroundColor: theme.line2 }]} />}
                    <AttentionItemRow
                      name={item.name}
                      room={item.room}
                      statusText={item.statusText}
                      statusType={item.statusType}
                      amount={item.amount}
                      theme={theme}
                      onCollect={handleCollectItem}
                    />
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* Paid Units Status Banner */}
            <View style={[styles.statusBanner, { backgroundColor: theme.okBg }]}>
              <Ionicons name="checkmark" size={18} color={theme.ok} />
              <Text style={[styles.statusBannerText, { color: theme.ok }]}>
                <Text style={{ fontWeight: FONT_WEIGHT.bold }}>8 units</Text> paid this month — all caught up for the rest.
              </Text>
            </View>

            {/* Primary Action Button */}
            <Pressable
              onPress={handlePrimaryAction}
              accessibilityRole="button"
              accessibilityLabel="Collect Pending Rent"
              style={({ pressed }) => [
                styles.primaryCollectBtn,
                { backgroundColor: theme.primary },
                theme.sh2,
                pressed && styles.pressedBtn,
              ]}>
              <Ionicons name="card-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryCollectBtnText}>
                Collect Pending Rent (₹30,000)
              </Text>
            </Pressable>
          </>
        ) : (
          /* ── TENANT HOME UI ─────────────────────────────────────────────── */
          <>
            <View style={[styles.rentCard, { backgroundColor: theme.primary }, theme.sh2]}>
              <View style={styles.rentCardHeader}>
                <Text style={styles.rentDueLabel}>RENT DUE</Text>
                <View style={styles.roomBadge}>
                  <Text style={styles.roomBadgeText}>Room {user.room}</Text>
                </View>
              </View>

              <Text style={styles.rentAmountText}>₹12,000</Text>

              <Text style={styles.dueDateText}>
                Due: <Text style={styles.dueDateBold}>5 August</Text>
              </Text>

              <Pressable
                onPress={handlePrimaryAction}
                style={({ pressed }) => [
                  styles.payRentBtn,
                  { backgroundColor: theme.white },
                  pressed && styles.pressedBtn,
                ]}>
                <Ionicons name="card-outline" size={20} color={theme.primary} />
                <Text style={[styles.payRentText, { color: theme.primary }]}>Pay Rent</Text>
              </Pressable>
            </View>

            {/* Quick Actions Grid */}
            <View style={styles.grid}>
              <Pressable
                onPress={handleNavProfile}
                style={({ pressed }) => [
                  styles.actionCard,
                  { backgroundColor: theme.surface, borderColor: theme.line },
                  theme.sh1,
                  pressed && styles.pressedCard,
                ]}>
                <View style={[styles.iconBox, { backgroundColor: theme.primary050 }]}>
                  <Ionicons name="person-outline" size={22} color={theme.primary} />
                </View>
                <Text style={[styles.actionTitle, { color: theme.ink }]}>My Profile</Text>
              </Pressable>

              <Pressable
                onPress={() => setIsThemeModalVisible(true)}
                style={({ pressed }) => [
                  styles.actionCard,
                  { backgroundColor: theme.surface, borderColor: theme.line },
                  theme.sh1,
                  pressed && styles.pressedCard,
                ]}>
                <View style={[styles.iconBox, { backgroundColor: theme.accent050 }]}>
                  <Ionicons name="color-palette-outline" size={22} color={theme.accent600} />
                </View>
                <Text style={[styles.actionTitle, { color: theme.ink }]}>Theme & Look</Text>
              </Pressable>

              <Pressable
                onPress={() => handleNavQuickAction('/(tabs)/receipts')}
                style={({ pressed }) => [
                  styles.actionCard,
                  { backgroundColor: theme.surface, borderColor: theme.line },
                  theme.sh1,
                  pressed && styles.pressedCard,
                ]}>
                <View style={[styles.iconBox, { backgroundColor: theme.primary050 }]}>
                  <Ionicons name="document-text-outline" size={22} color={theme.primary} />
                </View>
                <Text style={[styles.actionTitle, { color: theme.ink }]}>My Receipts</Text>
              </Pressable>

              <Pressable
                onPress={() => handleNavQuickAction('/(tabs)/issues')}
                style={({ pressed }) => [
                  styles.actionCard,
                  { backgroundColor: theme.surface, borderColor: theme.line },
                  theme.sh1,
                  pressed && styles.pressedCard,
                ]}>
                <View style={[styles.iconBox, { backgroundColor: theme.primary050 }]}>
                  <Ionicons name="construct-outline" size={22} color={theme.primary} />
                </View>
                <Text style={[styles.actionTitle, { color: theme.ink }]}>Report Issue</Text>
              </Pressable>
            </View>

            {/* Recent Payments */}
            <View style={styles.recentSection}>
              <Text style={[styles.sectionTitleHeader, { color: theme.ink3 }]}>
                RECENT PAYMENTS
              </Text>

              <View style={[styles.card, styles.paymentsCard, { backgroundColor: theme.surface, borderColor: theme.line }, theme.sh1]}>
                <View style={styles.paymentRow}>
                  <View style={styles.paymentDetails}>
                    <Text style={[styles.paymentItemTitle, { color: theme.ink }]}>
                      Rent — July 2026
                    </Text>
                    <Text style={[styles.paymentSub, { color: theme.ink3 }]}>UPI · 5 Jul</Text>
                  </View>
                  <View style={[styles.paidPillBadge, { backgroundColor: theme.okBg }]}>
                    <Text style={[styles.paidPillDot, { color: theme.ok }]}>● </Text>
                    <Text style={[styles.paidPillText, { color: theme.ok }]}>₹12,000</Text>
                  </View>
                </View>

                <View style={[styles.dividerLine, { backgroundColor: theme.line2 }]} />

                <View style={styles.paymentRow}>
                  <View style={styles.paymentDetails}>
                    <Text style={[styles.paymentItemTitle, { color: theme.ink }]}>
                      Rent — June 2026
                    </Text>
                    <Text style={[styles.paymentSub, { color: theme.ink3 }]}>UPI · 5 Jun</Text>
                  </View>
                  <View style={[styles.paidPillBadge, { backgroundColor: theme.okBg }]}>
                    <Text style={[styles.paidPillDot, { color: theme.ok }]}>● </Text>
                    <Text style={[styles.paidPillText, { color: theme.ok }]}>₹12,000</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

      </ScrollView>

      {/* ── THEME SWITCHER MODAL ─────────────────────────────────────────── */}
      <Modal
        visible={isThemeModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsThemeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.themeModalCard, { backgroundColor: theme.surface, borderColor: theme.line }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.ink }]}>Theme & Look</Text>
              <Pressable hitSlop={8} onPress={() => setIsThemeModalVisible(false)}>
                <Ionicons name="close" size={22} color={theme.ink3} />
              </Pressable>
            </View>

            <View style={styles.themeOptionsContainer}>
              <Pressable
                onPress={() => setThemeMode('light')}
                style={[
                  styles.themeOptionRow,
                  {
                    backgroundColor: themeMode === 'light' ? theme.primary050 : theme.surface2,
                    borderColor: themeMode === 'light' ? theme.primary : theme.line,
                  },
                ]}>
                <Ionicons
                  name="sunny"
                  size={24}
                  color={themeMode === 'light' ? theme.primary : theme.ink3}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.themeOptionTitle,
                      { color: themeMode === 'light' ? theme.primary : theme.ink },
                    ]}>
                    Light Mode ☀️
                  </Text>
                  <Text style={[styles.themeOptionSub, { color: theme.ink3 }]}>Clean slate background</Text>
                </View>
                {themeMode === 'light' && (
                  <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                )}
              </Pressable>

              <Pressable
                onPress={() => setThemeMode('dark')}
                style={[
                  styles.themeOptionRow,
                  {
                    backgroundColor: themeMode === 'dark' ? theme.primary050 : theme.surface2,
                    borderColor: themeMode === 'dark' ? theme.primary : theme.line,
                  },
                ]}>
                <Ionicons
                  name="moon"
                  size={24}
                  color={themeMode === 'dark' ? theme.primary : theme.ink3}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.themeOptionTitle,
                      { color: themeMode === 'dark' ? theme.primary : theme.ink },
                    ]}>
                    Dark Mode 🌙
                  </Text>
                  <Text style={[styles.themeOptionSub, { color: theme.ink3 }]}>Sleek dark aesthetics</Text>
                </View>
                {themeMode === 'dark' && (
                  <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                )}
              </Pressable>

              <Pressable
                onPress={() => setThemeMode('system')}
                style={[
                  styles.themeOptionRow,
                  {
                    backgroundColor: themeMode === 'system' ? theme.primary050 : theme.surface2,
                    borderColor: themeMode === 'system' ? theme.primary : theme.line,
                  },
                ]}>
                <Ionicons
                  name="phone-portrait"
                  size={24}
                  color={themeMode === 'system' ? theme.primary : theme.ink3}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.themeOptionTitle,
                      { color: themeMode === 'system' ? theme.primary : theme.ink },
                    ]}>
                    System Default 📱
                  </Text>
                  <Text style={[styles.themeOptionSub, { color: theme.ink3 }]}>Match your OS settings</Text>
                </View>
                {themeMode === 'system' && (
                  <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                )}
              </Pressable>
            </View>

            <Pressable
              onPress={() => setIsThemeModalVisible(false)}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: theme.primary, marginTop: SPACING.md },
                pressed && styles.pressedBtn,
              ]}>
              <Text style={styles.saveBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  greetingContainer: {
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  greetingText: {
    ...TYPOGRAPHY.h3,
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.heavy,
  },
  waveEmoji: {
    fontSize: FONT_SIZE.title,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  roleBadgeText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
  },
  subtitleText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  pressed: {
    opacity: 0.75,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
  },
  avatarText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.heavy,
  },
  avatarDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  /* Cards */
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    gap: SPACING.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardCaptionLabel: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
  },
  paidPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  paidPillDot: {
    fontSize: 10,
  },
  paidPillText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  mainAmountText: {
    fontSize: 34,
    fontWeight: FONT_WEIGHT.heavy,
    letterSpacing: -0.5,
    marginVertical: -2,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  pendingSubText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },

  /* Sections */
  sectionContainer: {
    gap: SPACING.sm,
  },
  sectionTitleHeader: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    marginLeft: 2,
  },
  attentionListCard: {
    paddingVertical: SPACING.sm,
    gap: 0,
  },
  attentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  attentionDotWrapper: {
    justifyContent: 'center',
  },
  statusDotRed: {
    color: '#DC2626',
    fontSize: 14,
  },
  statusDotAmber: {
    color: '#D97706',
    fontSize: 14,
  },
  attentionDetails: {
    flex: 1,
    gap: 2,
  },
  tenantNameText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  roomText: {
    fontWeight: FONT_WEIGHT.medium,
  },
  overdueSubText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  collectBtnLightRed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  collectBtnLightRedText: {
    color: '#DC2626',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  collectBtnAmber: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  collectBtnAmberText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  dividerLine: {
    height: 1,
    width: '100%',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  statusBannerText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    flex: 1,
  },
  primaryCollectBtn: {
    height: 54,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  primaryCollectBtnText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },

  /* Tenant UI Specifics */
  rentCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  rentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rentDueLabel: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.8,
  },
  roomBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  roomBadgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  rentAmountText: {
    fontSize: 34,
    fontWeight: FONT_WEIGHT.heavy,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginVertical: SPACING.xs,
  },
  dueDateText: {
    fontSize: FONT_SIZE.base,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  dueDateBold: {
    fontWeight: FONT_WEIGHT.bold,
  },
  payRentBtn: {
    height: 50,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  payRentText: {
    ...TYPOGRAPHY.button,
    fontSize: FONT_SIZE.md,
  },
  pressedBtn: {
    opacity: 0.9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionCard: {
    width: '47.5%',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    gap: SPACING.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  pressedCard: {
    opacity: 0.8,
  },
  recentSection: {
    gap: SPACING.sm,
  },
  paymentsCard: {
    paddingVertical: 0,
    overflow: 'hidden',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  paymentDetails: {
    gap: 2,
  },
  paymentItemTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  paymentSub: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },

  /* Modal Styling */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  themeModalCard: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  saveBtn: {
    height: 50,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  themeOptionsContainer: {
    gap: SPACING.md,
  },
  themeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
  },
  themeOptionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  themeOptionSub: {
    fontSize: FONT_SIZE.caption,
  },
});
