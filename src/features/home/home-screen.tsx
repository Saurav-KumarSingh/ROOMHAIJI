import { Image, type ImageSource } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const LOGO_SOURCE: ImageSource = require('@/assets/images/Logo_3D.png');

const highlights = [
  { label: 'Platform', value: 'Expo SDK 57' },
  { label: 'Routing', value: 'Expo Router' },
  { label: 'Theme', value: 'Light & Dark' },
];

export function HomeScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Brand Hero */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
            theme.sh2,
          ]}>
          <View style={[styles.logoWrapper, theme.sh2]}>
            <Image source={LOGO_SOURCE} style={styles.logo} contentFit="contain" />
          </View>
          <View style={styles.heroTextContainer}>
            <Text style={[styles.kicker, { color: theme.primary }]}>Welcome to</Text>
            <Text style={[styles.title, { color: theme.ink }]}>ROOMHAIJI</Text>
            <Text style={[styles.subtitle, { color: theme.ink2 }]}>
              Your modern, reliable platform for finding and managing rooms effortlessly.
            </Text>
          </View>
        </View>

        {/* Quick Highlights */}
        <View style={styles.grid}>
          {highlights.map((item) => (
            <View
              key={item.label}
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.line,
                },
                theme.sh1,
              ]}>
              <Text style={[styles.cardLabel, { color: theme.ink3 }]}>{item.label}</Text>
              <Text style={[styles.cardValue, { color: theme.ink }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Development Ready Banner */}
        <View
          style={[
            styles.infoBanner,
            {
              backgroundColor: theme.primary050,
              borderColor: theme.primary100,
            },
          ]}>
          <View style={[styles.statusDot, { backgroundColor: theme.ok }]} />
          <Text style={[styles.infoText, { color: theme.primary700 }]}>
            Modern professional theme active with full light & dark mode support.
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
  content: {
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  hero: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    gap: SPACING.lg,
  },
  logoWrapper: {
    width: 110,
    height: 110,
    borderRadius: RADIUS.xl,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  heroTextContainer: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
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
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    gap: SPACING.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
