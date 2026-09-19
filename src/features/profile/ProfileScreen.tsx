import { Image, type ImageSource } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const AVATAR_SOURCE: ImageSource = require('@/assets/images/logo.png');

export function ProfileScreen() {
  const { theme, colorScheme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
            theme.sh2,
          ]}>
          <View
            style={[
              styles.avatarWrapper,
              {
                borderColor: theme.accent,
              },
            ]}>
            <Image source={AVATAR_SOURCE} style={styles.avatar} contentFit="contain" />
          </View>
          <Text style={[styles.name, { color: theme.ink }]}>RoomHaiji User</Text>
          <Text
            style={[
              styles.badge,
              {
                color: theme.accent,
                backgroundColor: theme.accent050,
              },
            ]}>
            {colorScheme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
          </Text>
        </View>

        {/* Feature Management */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
            theme.sh1,
          ]}>
          <Text style={[styles.sectionTitle, { color: theme.ink }]}>App Architecture</Text>
          <View style={[styles.item, { borderBottomColor: theme.line2 }]}>
            <Text style={[styles.itemLabel, { color: theme.ink3 }]}>Theme Mode</Text>
            <Text style={[styles.itemValue, { color: theme.primary }]}>
              {colorScheme === 'dark' ? 'Dark Theme' : 'Light Theme'}
            </Text>
          </View>
          <View style={[styles.item, { borderBottomColor: theme.line2 }]}>
            <Text style={[styles.itemLabel, { color: theme.ink3 }]}>Palette</Text>
            <Text style={[styles.itemValue, { color: theme.ink }]}>Indigo + Amber</Text>
          </View>
          <View style={[styles.item, { borderBottomColor: theme.line2 }]}>
            <Text style={[styles.itemLabel, { color: theme.ink3 }]}>Navigation</Text>
            <Text style={[styles.itemValue, { color: theme.ink }]}>Expo Router v57</Text>
          </View>
          <View style={[styles.item, { borderBottomColor: theme.line2 }]}>
            <Text style={[styles.itemLabel, { color: theme.ink3 }]}>Expo SDK</Text>
            <Text style={[styles.itemValue, { color: theme.ink }]}>57.0.18</Text>
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
  content: {
    padding: SPACING.xl,
    gap: SPACING.xl,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    gap: SPACING.sm,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderWidth: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  section: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    gap: SPACING.md,
  },
  sectionTitle: {
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
  },
  itemLabel: {
    fontSize: 14,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
