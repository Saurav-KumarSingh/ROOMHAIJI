import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
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
  TYPOGRAPHY,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function HomeScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    role?: string;
    userName?: string;
    fullName?: string;
    inviteCode?: string;
    property?: string;
    room?: string;
    units?: string;
  }>();

  const isLandlord = params.role === 'landlord';

  // Dynamic user details with fallbacks
  const displayName = params.userName || params.fullName || (isLandlord ? 'Sharmaji' : 'Amit');
  const displayBuilding = params.property || 'Sharma Building';
  const displayRoom = params.inviteCode || params.room || '204';
  const roomBadgeText = displayRoom.startsWith('Room') ? displayRoom : `Room ${displayRoom}`;
  const totalUnits = params.units || '12';

  // User initials for avatar
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || (isLandlord ? 'SB' : 'AK');

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

  const handleQuickAction = useCallback((action: string) => {
    if (action === 'receipts' || action === 'tenants') {
      router.push({ pathname: '/(tabs)/receipts', params: { role: params.role } } as any);
    } else if (action === 'issues' || action === 'payments') {
      router.push({ pathname: '/(tabs)/issues', params: { role: params.role } } as any);
    } else if (action === 'agreement' || action === 'properties') {
      router.push({ pathname: '/(tabs)/pay', params: { role: params.role } } as any);
    } else if (action === 'landlord' || action === 'profile') {
      router.push({ pathname: '/(tabs)/profile', params: { role: params.role } } as any);
    }
  }, [params.role]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Top Header Section */}
        <View style={styles.topHeader}>
          <View style={styles.greetingContainer}>
            <View style={styles.nameRow}>
              <Text style={[styles.greetingText, { color: theme.ink }]}>
                Hi, {displayName}
              </Text>
              <Text style={styles.waveEmoji}>{isLandlord ? '👋' : '👏'}</Text>
            </View>
            <Text style={[styles.subtitleText, { color: theme.ink3 }]}>
              {isLandlord ? 'Landlord' : 'Tenant'} · {displayBuilding}
            </Text>
          </View>

          <View style={styles.headerRightActions}>
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && styles.pressed,
              ]}>
              <Ionicons name="notifications-outline" size={22} color={theme.ink} />
            </Pressable>

            <View style={[styles.avatarCircle, { backgroundColor: theme.primary050 }]}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {initials}
              </Text>
            </View>
          </View>
        </View>

        {/* Hero Card */}
        <View style={[styles.rentCard, { backgroundColor: theme.primary }, theme.sh2]}>
          {/* Card Top Row */}
          <View style={styles.rentCardHeader}>
            <Text style={styles.rentDueLabel}>
              {isLandlord ? 'RENT COLLECTED THIS MONTH' : 'RENT DUE'}
            </Text>
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>
                {isLandlord ? `${totalUnits} Units` : roomBadgeText}
              </Text>
            </View>
          </View>

          {/* Rent Amount */}
          <Text style={styles.rentAmountText}>
            {isLandlord ? '₹1,20,000' : '₹12,000'}
          </Text>

          {/* Due / Pending Subtitle */}
          <Text style={styles.dueDateText}>
            {isLandlord ? (
              <>Pending: <Text style={styles.dueDateBold}>₹24,000 (2 units)</Text></>
            ) : (
              <>Due: <Text style={styles.dueDateBold}>5 August</Text></>
            )}
          </Text>

          {/* Action Button */}
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
          {/* Card 1 */}
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

          {/* Card 2 */}
          <Pressable
            onPress={() => handleQuickAction(isLandlord ? 'tenants' : 'agreement')}
            accessibilityRole="button"
            accessibilityLabel={isLandlord ? 'Tenants' : 'Agreement'}
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.surface, borderColor: theme.line },
              theme.sh1,
              pressed && styles.pressedCard,
            ]}>
            <View style={[styles.iconBox, { backgroundColor: theme.primary050 }]}>
              <Ionicons
                name={isLandlord ? 'people-outline' : 'newspaper-outline'}
                size={22}
                color={theme.primary}
              />
            </View>
            <Text style={[styles.actionTitle, { color: theme.ink }]}>
              {isLandlord ? 'Tenants' : 'Agreement'}
            </Text>
          </Pressable>

          {/* Card 3 */}
          <Pressable
            onPress={() => handleQuickAction(isLandlord ? 'payments' : 'issues')}
            accessibilityRole="button"
            accessibilityLabel={isLandlord ? 'Payments' : 'Report Issue'}
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.surface, borderColor: theme.line },
              theme.sh1,
              pressed && styles.pressedCard,
            ]}>
            <View style={[styles.iconBox, { backgroundColor: theme.primary050 }]}>
              <Ionicons
                name={isLandlord ? 'card-outline' : 'construct-outline'}
                size={22}
                color={theme.primary}
              />
            </View>
            <Text style={[styles.actionTitle, { color: theme.ink }]}>
              {isLandlord ? 'Payments' : 'Report Issue'}
            </Text>
          </Pressable>

          {/* Card 4 */}
          <Pressable
            onPress={() => handleQuickAction(isLandlord ? 'profile' : 'landlord')}
            accessibilityRole="button"
            accessibilityLabel={isLandlord ? 'Profile' : 'Landlord Info'}
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.surface, borderColor: theme.line },
              theme.sh1,
              pressed && styles.pressedCard,
            ]}>
            <View style={[styles.iconBox, { backgroundColor: theme.primary050 }]}>
              <Ionicons
                name={isLandlord ? 'person-outline' : 'home-outline'}
                size={22}
                color={theme.primary}
              />
            </View>
            <Text style={[styles.actionTitle, { color: theme.ink }]}>
              {isLandlord ? 'Profile' : 'Landlord Info'}
            </Text>
          </Pressable>
        </View>

        {/* Recent Payments Section */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: theme.ink3 }]}>
            {isLandlord ? 'RECENT TENANT PAYMENTS' : 'RECENT PAYMENTS'}
          </Text>

          <View style={[styles.paymentsCard, { backgroundColor: theme.surface, borderColor: theme.line }, theme.sh1]}>
            {/* Payment Item 1 */}
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

            {/* Payment Item 2 */}
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
  subtitleText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconBtn: {
    padding: SPACING.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
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
});
