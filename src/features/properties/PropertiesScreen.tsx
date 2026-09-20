import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { memo, useCallback } from 'react';
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
import { useUser } from '@/context/user-context';
import { useTheme } from '@/hooks/use-theme';

// ── DEMO PROPERTIES DATA DECLARED ON THE FILE ────────────────────────────────
export interface PropertyItem {
  id: string;
  title: string;
  address: string;
  iconBg: string;
  rooms: number;
  occupied: number;
  vacant: number;
  expectedRent: string;
}

export const DEMO_PROPERTIES: PropertyItem[] = [
  {
    id: '1',
    title: 'Sharma Building',
    address: '12, MG Road, Andheri West, Mumbai',
    iconBg: '#4F46E5', // Indigo
    rooms: 12,
    occupied: 10,
    vacant: 2,
    expectedRent: '₹1.85L',
  },
  {
    id: '2',
    title: 'Green Villa Flat',
    address: 'B-204, Baner, Pune',
    iconBg: '#D97706', // Amber/Orange
    rooms: 1,
    occupied: 1,
    vacant: 0,
    expectedRent: '₹22K',
  },
];

// ── PROPERTY CARD COMPONENT ──────────────────────────────────────────────────
const PropertyCard = memo(function PropertyCard({
  item,
  theme,
  onView,
  onManage,
}: {
  item: PropertyItem;
  theme: any;
  onView: (id: string) => void;
  onManage: (id: string) => void;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.line },
        theme.sh1,
      ]}>
      {/* Top Title Row */}
      <View style={styles.cardTopRow}>
        <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
          <Ionicons name="home" size={22} color="#FFFFFF" />
        </View>
        <View style={styles.titleDetails}>
          <Text style={[styles.propertyTitle, { color: theme.ink }]}>
            {item.title}
          </Text>
          <Text style={[styles.propertyAddress, { color: theme.ink3 }]}>
            {item.address}
          </Text>
        </View>
      </View>

      {/* 4 Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricBox, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.metricVal, { color: theme.ink }]}>
            {item.rooms}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.ink3 }]}>Rooms</Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.metricVal, { color: theme.ok }]}>
            {item.occupied}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.ink3 }]}>
            Occupied
          </Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.metricVal, { color: theme.ink }]}>
            {item.vacant}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.ink3 }]}>Vacant</Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: theme.surface2 }]}>
          <Text style={[styles.metricVal, { color: theme.ink }]}>
            {item.expectedRent}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.ink3 }]}>
            Expected
          </Text>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.cardActionsRow}>
        <Pressable
          onPress={() => onView(item.id)}
          style={({ pressed }) => [
            styles.viewBtn,
            { backgroundColor: theme.primary050 },
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.viewBtnText, { color: theme.primary }]}>View</Text>
        </Pressable>

        <Pressable
          onPress={() => onManage(item.id)}
          style={({ pressed }) => [
            styles.manageBtn,
            { backgroundColor: theme.surface, borderColor: theme.line },
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.manageBtnText, { color: theme.ink }]}>
            Manage
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

// ── MAIN PROPERTIES SCREEN ───────────────────────────────────────────────────
export function PropertiesScreen() {
  const { theme } = useTheme();
  const { user } = useUser();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home' as any);
    }
  }, []);

  const handleAddProperty = useCallback(() => {
    router.push({
      pathname: '/auth/add-room-detail',
      params: { role: 'landlord' },
    } as any);
  }, []);

  const handleViewProperty = useCallback((id: string) => {
    router.push({
      pathname: '/(tabs)/receipts',
      params: { propertyId: id, role: 'landlord' },
    } as any);
  }, []);

  const handleManageProperty = useCallback((id: string) => {
    router.push({
      pathname: '/auth/add-room-detail',
      params: { propertyId: id, role: 'landlord' },
    } as any);
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      
      {/* Top App Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: theme.surface2 }]}>
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go Back"
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <Ionicons name="arrow-back" size={20} color={theme.ink} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.ink }]}>Properties</Text>

        <Pressable
          onPress={handleAddProperty}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Add Property"
          style={({ pressed }) => [styles.addHeaderBtn, pressed && styles.pressed]}>
          <Ionicons name="add" size={24} color={theme.ink} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Render Demo Properties Array */}
        {DEMO_PROPERTIES.map((property) => (
          <PropertyCard
            key={property.id}
            item={property}
            theme={theme}
            onView={handleViewProperty}
            onManage={handleManageProperty}
          />
        ))}

        {/* Bottom Add Property Card Button */}
        <Pressable
          onPress={handleAddProperty}
          accessibilityRole="button"
          accessibilityLabel="Add Property"
          style={({ pressed }) => [
            styles.addPropertyCardBtn,
            { backgroundColor: theme.surface, borderColor: theme.line },
            theme.sh1,
            pressed && styles.pressedCard,
          ]}>
          <Ionicons name="add" size={20} color={theme.ink} />
          <Text style={[styles.addPropertyCardText, { color: theme.ink }]}>
            Add Property
          </Text>
        </Pressable>

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
  addHeaderBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xxl,
    gap: SPACING.xl,
  },

  /* Card */
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    gap: SPACING.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleDetails: {
    flex: 1,
    gap: 2,
  },
  propertyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  propertyAddress: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },

  /* Metrics Grid */
  metricsRow: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
  },
  metricBox: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    gap: 2,
  },
  metricVal: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.heavy,
  },
  metricLabel: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.medium,
  },

  /* Actions Row */
  cardActionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  viewBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtnText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  manageBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageBtnText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },

  /* Add Property Bottom Card */
  addPropertyCardBtn: {
    height: 54,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  addPropertyCardText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  pressed: {
    opacity: 0.7,
  },
  pressedCard: {
    opacity: 0.85,
  },
});
