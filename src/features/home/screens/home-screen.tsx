import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, RADIUS, SPACING } from '@/constants/theme';

const highlights = [
  { label: 'Platform', value: 'Expo SDK 57' },
  { label: 'Routing', value: 'Expo Router' },
  { label: 'Structure', value: 'Feature Based' },
];

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Brand Hero */}
        <View style={styles.hero}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('@/assets/images/Logo_3D.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
          <View style={styles.heroTextContainer}>
            <Text style={styles.kicker}>Welcome to</Text>
            <Text style={styles.title}>ROOMHAIJI</Text>
            <Text style={styles.subtitle}>
              Your modern, reliable platform for finding and managing rooms effortlessly.
            </Text>
          </View>
        </View>

        {/* Quick Highlights */}
        <View style={styles.grid}>
          {highlights.map((item) => (
            <View key={item.label} style={styles.card}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Development Ready Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.statusDot} />
          <Text style={styles.infoText}>
            Project is streamlined and optimized for production development.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgBase,
  },
  content: {
    padding: SPACING.xl,
    gap: 18,
  },
  hero: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.lg,
  },
  logoWrapper: {
    width: 110,
    height: 110,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  heroTextContainer: {
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  kicker: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  card: {
    flex: 1,
    minWidth: 100,
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cardLabel: {
    color: COLORS.textTertiary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: SPACING.xs + 2,
    textTransform: 'uppercase',
  },
  cardValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgBanner,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    gap: SPACING.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.statusGreen,
  },
  infoText: {
    flex: 1,
    color: COLORS.textBanner,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
