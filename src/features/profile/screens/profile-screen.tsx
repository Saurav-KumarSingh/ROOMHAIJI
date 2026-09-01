import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, RADIUS, SPACING } from '@/constants/theme';

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.avatar}
              contentFit="contain"
            />
          </View>
          <Text style={styles.name}>Roomhaiji User</Text>
          <Text style={styles.badge}>Development Profile</Text>
        </View>

        {/* Feature Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Architecture</Text>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Expo SDK</Text>
            <Text style={styles.itemValue}>57.0.18</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Navigation</Text>
            <Text style={styles.itemValue}>Expo Router v57</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>UI Styling</Text>
            <Text style={styles.itemValue}>Pure React Native + Expo Image</Text>
          </View>
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
    gap: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  badge: {
    color: COLORS.accent,
    backgroundColor: COLORS.accentBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.md,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  section: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  itemValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
