import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
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
} from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { useTheme } from '@/hooks/use-theme';

export type TenantFilterPill = 'All' | 'Paid' | 'Due' | 'Overdue' | 'Vacant';

export interface LandlordTenantItem {
  id: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  name: string;
  room: string;
  monthlyRent: string;
  status: 'Paid' | 'Due' | 'Overdue' | 'Vacant';
  phone: string;
}

// ── DEMO TENANTS ARRAY DECLARED ON THE FILE ─────────────────────────────────
export const DEMO_TENANTS: LandlordTenantItem[] = [
  {
    id: '1',
    initials: 'AK',
    avatarBg: '#FEF3C7',
    avatarColor: '#D97706',
    name: 'Amit Kumar',
    room: '204',
    monthlyRent: '₹12,000/MO',
    status: 'Paid',
    phone: '+91 98112 34567',
  },
  {
    id: '2',
    initials: 'PS',
    avatarBg: '#DBEAFE',
    avatarColor: '#2563EB',
    name: 'Priya Sharma',
    room: '105',
    monthlyRent: '₹10,000/MO',
    status: 'Overdue',
    phone: '+91 98223 45678',
  },
  {
    id: '3',
    initials: 'RS',
    avatarBg: '#F3E8FF',
    avatarColor: '#7C3AED',
    name: 'Rahul Singh',
    room: '103',
    monthlyRent: '₹12,000/MO',
    status: 'Overdue',
    phone: '+91 98334 56789',
  },
  {
    id: '4',
    initials: 'NV',
    avatarBg: '#FEF3C7',
    avatarColor: '#D97706',
    name: 'Neha Verma',
    room: '104',
    monthlyRent: '₹11,000/MO',
    status: 'Due',
    phone: '+91 98445 67890',
  },
  {
    id: '5',
    initials: 'KP',
    avatarBg: '#DBEAFE',
    avatarColor: '#2563EB',
    name: 'Karan Patel',
    room: '201',
    monthlyRent: '₹13,000/MO',
    status: 'Paid',
    phone: '+91 98556 78901',
  },
];

// ── MEMOIZED TENANT CARD COMPONENT ───────────────────────────────────────────
const TenantCardRow = memo(function TenantCardRow({
  item,
  theme,
  onPress,
}: {
  item: LandlordTenantItem;
  theme: any;
  onPress: (item: LandlordTenantItem) => void;
}) {
  let badgeBg = '#DCFCE7'; // Light green
  let badgeColor = '#16A34A'; // Green

  if (item.status === 'Overdue') {
    badgeBg = '#FEE2E2'; // Light red
    badgeColor = '#DC2626';
  } else if (item.status === 'Due') {
    badgeBg = '#FEF3C7'; // Light amber
    badgeColor = '#D97706';
  } else if (item.status === 'Vacant') {
    badgeBg = '#F1F5F9';
    badgeColor = '#64748B';
  }

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.tenantCard,
        { backgroundColor: theme.surface, borderColor: theme.line },
        theme.sh1,
        pressed && styles.pressedCard,
      ]}>
      {/* Avatar Circle */}
      <View style={[styles.avatarCircle, { backgroundColor: item.avatarBg }]}>
        <Text style={[styles.avatarText, { color: item.avatarColor }]}>
          {item.initials}
        </Text>
      </View>

      {/* Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.tenantName, { color: theme.ink }]}>
          {item.name}
        </Text>
        <Text style={[styles.tenantSub, { color: theme.ink3 }]}>
          ROOM {item.room} · {item.monthlyRent}
        </Text>
      </View>

      {/* Status Pill Badge */}
      <View style={[styles.statusPill, { backgroundColor: badgeBg }]}>
        <Text style={[styles.statusDot, { color: badgeColor }]}>● </Text>
        <Text style={[styles.statusText, { color: badgeColor }]}>
          {item.status}
        </Text>
      </View>
    </Pressable>
  );
});

// ── MAIN LANDLORD TENANTS SCREEN ─────────────────────────────────────────────
export function LandlordTenantsScreen() {
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TenantFilterPill>('All');

  const filterPills: TenantFilterPill[] = useMemo(
    () => ['All', 'Paid', 'Due', 'Overdue', 'Vacant'],
    []
  );

  const filteredTenants = useMemo(() => {
    return DEMO_TENANTS.filter((tenant) => {
      // Pill Filter Match
      const matchesPill =
        activeFilter === 'All' ? true : tenant.status === activeFilter;

      // Query Search Match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tenant.name.toLowerCase().includes(q) ||
        tenant.room.toLowerCase().includes(q) ||
        tenant.phone.toLowerCase().includes(q);

      return matchesPill && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home' as any);
    }
  }, []);

  const handleAddTenant = useCallback(() => {
    router.push('/auth/add-tenant' as any);
  }, []);

  const handleSelectTenant = useCallback((tenant: LandlordTenantItem) => {
    router.push({
      pathname: '/(tabs)/pay',
      params: { tenant: tenant.name },
    } as any);
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      
      {/* Top Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: theme.surface2 }]}>
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go Back"
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <Ionicons name="arrow-back" size={20} color={theme.ink} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.ink }]}>Tenants</Text>

        <Pressable
          onPress={handleAddTenant}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Add Tenant"
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}>
          <Ionicons name="add" size={24} color={theme.ink} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Search Input Bar */}
        <View
          style={[
            styles.searchBarContainer,
            { backgroundColor: theme.surface, borderColor: theme.line },
          ]}>
          <View style={styles.searchIconBox}>
            <Ionicons name="search" size={20} color={theme.ink3} />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search name, phone, room..."
            placeholderTextColor={theme.ink3}
            style={[styles.searchInput, { color: theme.ink }]}
          />
          {searchQuery.length > 0 && (
            <Pressable hitSlop={6} onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.ink3} />
            </Pressable>
          )}
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsRow}>
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

        {/* Tenants List */}
        <View style={styles.tenantsListContainer}>
          {filteredTenants.map((tenant) => (
            <TenantCardRow
              key={tenant.id}
              item={tenant}
              theme={theme}
              onPress={handleSelectTenant}
            />
          ))}
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
  addBtn: {
    padding: SPACING.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },

  /* Search Bar */
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  searchIconBox: {
    paddingRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.base,
  },

  /* Filter Pills */
  filterPillsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: 2,
  },
  filterPill: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },

  /* Tenants List */
  tenantsListContainer: {
    gap: SPACING.md,
  },
  tenantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    gap: SPACING.md,
  },
  pressedCard: {
    opacity: 0.85,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.heavy,
  },
  detailsContainer: {
    flex: 1,
    gap: 2,
  },
  tenantName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  tenantSub: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.3,
  },

  /* Status Pill Badge */
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  statusDot: {
    fontSize: 9,
  },
  statusText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
  },
});
