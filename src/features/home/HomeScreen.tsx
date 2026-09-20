import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
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

export function HomeScreen() {
  const { theme, isDark, themeMode, setThemeMode, toggleTheme } = useTheme();
  const { user, toggleRole, initials } = useUser();

  // Theme Modal State
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  const isLandlord = user.role === 'landlord';

  const handlePrimaryAction = useCallback(() => {
    if (isLandlord) {
      router.push({
        pathname: '/auth/add-room-detail',
        params: { role: 'landlord' },
      } as any);
    } else {
      router.push('/(tabs)/pay' as any);
    }
  }, [isLandlord]);

  const handleQuickAction = useCallback(
    (action: string) => {
      if (action === 'profile') {
        router.push({ pathname: '/(tabs)/profile', params: { role: user.role } } as any);
      } else if (action === 'theme') {
        setIsThemeModalVisible(true);
      } else if (action === 'receipts' || action === 'properties') {
        router.push({ pathname: '/(tabs)/receipts', params: { role: user.role } } as any);
      } else if (action === 'issues' || action === 'tenants') {
        router.push({ pathname: '/(tabs)/issues', params: { role: user.role } } as any);
      }
    },
    [user.role]
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Top Header Section */}
        <View style={styles.topHeader}>
          <View style={styles.greetingContainer}>
            <View style={styles.nameRow}>
              <Text style={[styles.greetingText, { color: theme.ink }]}>
                Hi, {user.name}
              </Text>
              <Text style={styles.waveEmoji}>{isLandlord ? '👋' : '👏'}</Text>
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
                · {user.property}
              </Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            {/* Quick 1-Tap Theme Switcher */}
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

            {/* User Avatar Circle -> Navigates to Profile Screen */}
            <Pressable
              onPress={() => router.push({ pathname: '/(tabs)/profile', params: { role: user.role } } as any)}
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
            </Pressable>
          </View>
        </View>

        {/* Hero Rent Card */}
        <View style={[styles.rentCard, { backgroundColor: theme.primary }, theme.sh2]}>
          <View style={styles.rentCardHeader}>
            <Text style={styles.rentDueLabel}>
              {isLandlord ? 'RENT COLLECTED THIS MONTH' : 'RENT DUE'}
            </Text>
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>
                {isLandlord ? `${user.totalUnits || '12'} Units` : `Room ${user.room}`}
              </Text>
            </View>
          </View>

          <Text style={styles.rentAmountText}>
            {isLandlord ? '₹1,20,000' : '₹12,000'}
          </Text>

          <Text style={styles.dueDateText}>
            {isLandlord ? (
              <>Pending: <Text style={styles.dueDateBold}>₹24,000 (2 units)</Text></>
            ) : (
              <>Due: <Text style={styles.dueDateBold}>5 August</Text></>
            )}
          </Text>

          <Pressable
            onPress={handlePrimaryAction}
            accessibilityRole="button"
            accessibilityLabel={isLandlord ? 'Add Unit or Room' : 'Pay Rent'}
            style={({ pressed }) => [
              styles.payRentBtn,
              { backgroundColor: theme.white },
              pressed && styles.pressedBtn,
            ]}>
            <Ionicons
              name={isLandlord ? 'add-circle-outline' : 'card-outline'}
              size={20}
              color={theme.primary}
            />
            <Text style={[styles.payRentText, { color: theme.primary }]}>
              {isLandlord ? 'Add Room / Tenant' : 'Pay Rent'}
            </Text>
          </Pressable>
        </View>

        {/* 2x2 Quick Actions Grid */}
        <View style={styles.grid}>
          {/* Card 1: My Profile (Navigates to Profile tab) */}
          <Pressable
            onPress={() => handleQuickAction('profile')}
            accessibilityRole="button"
            accessibilityLabel="My Profile"
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

          {/* Card 2: Theme & Look */}
          <Pressable
            onPress={() => handleQuickAction('theme')}
            accessibilityRole="button"
            accessibilityLabel="Change Theme"
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

          {/* Card 3: Receipts / Properties */}
          <Pressable
            onPress={() => handleQuickAction(isLandlord ? 'properties' : 'receipts')}
            accessibilityRole="button"
            accessibilityLabel={isLandlord ? 'Properties' : 'My Receipts'}
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.surface, borderColor: theme.line },
              theme.sh1,
              pressed && styles.pressedCard,
            ]}>
            <View style={[styles.iconBox, { backgroundColor: theme.primary050 }]}>
              <Ionicons
                name={isLandlord ? 'business-outline' : 'document-text-outline'}
                size={22}
                color={theme.primary}
              />
            </View>
            <Text style={[styles.actionTitle, { color: theme.ink }]}>
              {isLandlord ? 'Properties' : 'My Receipts'}
            </Text>
          </Pressable>

          {/* Card 4: Issues / Tenants */}
          <Pressable
            onPress={() => handleQuickAction(isLandlord ? 'tenants' : 'issues')}
            accessibilityRole="button"
            accessibilityLabel={isLandlord ? 'Tenants' : 'Report Issue'}
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.surface, borderColor: theme.line },
              theme.sh1,
              pressed && styles.pressedCard,
            ]}>
            <View style={[styles.iconBox, { backgroundColor: theme.primary050 }]}>
              <Ionicons
                name={isLandlord ? 'people-outline' : 'construct-outline'}
                size={22}
                color={theme.primary}
              />
            </View>
            <Text style={[styles.actionTitle, { color: theme.ink }]}>
              {isLandlord ? 'Tenants' : 'Report Issue'}
            </Text>
          </Pressable>
        </View>

        {/* Recent Payments Section */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: theme.ink3 }]}>
            {isLandlord ? 'RECENT TENANT PAYMENTS' : 'RECENT PAYMENTS'}
          </Text>

          <View style={[styles.paymentsCard, { backgroundColor: theme.surface, borderColor: theme.line }, theme.sh1]}>
            <View style={styles.paymentRow}>
              <View style={styles.paymentDetails}>
                <Text style={[styles.paymentItemTitle, { color: theme.ink }]}>
                  {isLandlord ? 'Amit Kumar — Room 204' : 'Rent — July 2026'}
                </Text>
                <Text style={[styles.paymentSub, { color: theme.ink3 }]}>
                  UPI · 5 Jul
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: theme.okBg }]}>
                <Text style={[styles.statusDot, { color: theme.ok }]}>● </Text>
                <Text style={[styles.statusText, { color: theme.ok }]}>₹12,000</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.line2 }]} />

            <View style={styles.paymentRow}>
              <View style={styles.paymentDetails}>
                <Text style={[styles.paymentItemTitle, { color: theme.ink }]}>
                  {isLandlord ? 'Rajesh Singh — Room 102' : 'Rent — June 2026'}
                </Text>
                <Text style={[styles.paymentSub, { color: theme.ink3 }]}>
                  {isLandlord ? 'Cash · 5 Jun' : 'UPI · 5 Jun'}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: theme.okBg }]}>
                <Text style={[styles.statusDot, { color: theme.ok }]}>● </Text>
                <Text style={[styles.statusText, { color: theme.ok }]}>₹12,000</Text>
              </View>
            </View>
          </View>
        </View>

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
    gap: SPACING.xl,
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
  },
  pressed: {
    opacity: 0.7,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.heavy,
  },
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
  sectionTitle: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  paymentsCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusDot: {
    fontSize: 10,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  divider: {
    height: 1,
    width: '100%',
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
