import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EditProfileModal } from '@/components/EditProfileModal';
import { FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { useTheme } from '@/hooks/use-theme';

export function ProfileScreen() {
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  const { user, toggleRole, initials } = useUser();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const isLandlord = user.role === 'landlord';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
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
              styles.avatarCircle,
              {
                backgroundColor: theme.primary050,
                borderColor: theme.primary,
              },
            ]}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: theme.ink }]}>{user.name}</Text>
          <Text style={[styles.phoneText, { color: theme.ink3 }]}>{user.phone}</Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isLandlord ? theme.accent050 : theme.primary050,
                },
              ]}>
              <Text
                style={[
                  styles.badgeText,
                  { color: isLandlord ? theme.accent600 : theme.primary },
                ]}>
                {isLandlord ? '👑 Landlord' : '🏠 Tenant'}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.surface3,
                },
              ]}>
              <Text style={[styles.badgeText, { color: theme.ink2 }]}>
                {isLandlord ? `${user.totalUnits} Units` : `Room ${user.room}`}
              </Text>
            </View>
          </View>

          {/* Edit Profile Button Component */}
          <Pressable
            onPress={() => setIsEditModalVisible(true)}
            style={({ pressed }) => [
              styles.editProfileBtn,
              { backgroundColor: theme.primary050, borderColor: theme.primary },
              pressed && styles.pressed,
            ]}>
            <Ionicons name="create-outline" size={18} color={theme.primary} />
            <Text style={[styles.editProfileBtnText, { color: theme.primary }]}>
              Edit Profile
            </Text>
          </Pressable>
        </View>

        {/* Quick Role Switcher */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
            theme.sh1,
          ]}>
          <Text style={[styles.sectionTitle, { color: theme.ink }]}>User Mode</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelBox}>
              <Ionicons
                name={isLandlord ? 'business-outline' : 'home-outline'}
                size={20}
                color={theme.primary}
              />
              <Text style={[styles.itemLabel, { color: theme.ink }]}>
                Active Role: <Text style={{ fontWeight: FONT_WEIGHT.bold }}>{isLandlord ? 'Landlord' : 'Tenant'}</Text>
              </Text>
            </View>

            <Pressable
              onPress={toggleRole}
              style={({ pressed }) => [
                styles.switchBtn,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}>
              <Text style={styles.switchBtnText}>Switch to {isLandlord ? 'Tenant' : 'Landlord'}</Text>
            </Pressable>
          </View>
        </View>

        {/* Theme Settings Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
            theme.sh1,
          ]}>
          <Text style={[styles.sectionTitle, { color: theme.ink }]}>Appearance & Theme</Text>
          
          <View style={styles.modeRow}>
            <Pressable
              onPress={() => setThemeMode('light')}
              style={[
                styles.modeCard,
                {
                  backgroundColor: themeMode === 'light' ? theme.primary050 : theme.surface2,
                  borderColor: themeMode === 'light' ? theme.primary : theme.line,
                },
              ]}>
              <Ionicons
                name="sunny-outline"
                size={22}
                color={themeMode === 'light' ? theme.primary : theme.ink3}
              />
              <Text
                style={[
                  styles.modeText,
                  { color: themeMode === 'light' ? theme.primary : theme.ink3 },
                ]}>
                Light
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setThemeMode('dark')}
              style={[
                styles.modeCard,
                {
                  backgroundColor: themeMode === 'dark' ? theme.primary050 : theme.surface2,
                  borderColor: themeMode === 'dark' ? theme.primary : theme.line,
                },
              ]}>
              <Ionicons
                name="moon-outline"
                size={22}
                color={themeMode === 'dark' ? theme.primary : theme.ink3}
              />
              <Text
                style={[
                  styles.modeText,
                  { color: themeMode === 'dark' ? theme.primary : theme.ink3 },
                ]}>
                Dark
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setThemeMode('system')}
              style={[
                styles.modeCard,
                {
                  backgroundColor: themeMode === 'system' ? theme.primary050 : theme.surface2,
                  borderColor: themeMode === 'system' ? theme.primary : theme.line,
                },
              ]}>
              <Ionicons
                name="phone-portrait-outline"
                size={22}
                color={themeMode === 'system' ? theme.primary : theme.ink3}
              />
              <Text
                style={[
                  styles.modeText,
                  { color: themeMode === 'system' ? theme.primary : theme.ink3 },
                ]}>
                System
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Profile Info Details Header */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
            theme.sh1,
          ]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.ink }]}>Account Details</Text>
            <Pressable
              onPress={() => setIsEditModalVisible(true)}
              hitSlop={6}
              style={({ pressed }) => [styles.editInlineBtn, pressed && styles.pressed]}>
              <Ionicons name="pencil" size={16} color={theme.primary} />
              <Text style={[styles.editInlineText, { color: theme.primary }]}>Edit</Text>
            </Pressable>
          </View>
          
          <View style={[styles.item, { borderBottomColor: theme.line2 }]}>
            <Text style={[styles.itemLabel, { color: theme.ink3 }]}>Full Name</Text>
            <Text style={[styles.itemValue, { color: theme.ink }]}>{user.name}</Text>
          </View>

          <View style={[styles.item, { borderBottomColor: theme.line2 }]}>
            <Text style={[styles.itemLabel, { color: theme.ink3 }]}>Phone Number</Text>
            <Text style={[styles.itemValue, { color: theme.ink }]}>{user.phone}</Text>
          </View>

          <View style={[styles.item, { borderBottomColor: theme.line2 }]}>
            <Text style={[styles.itemLabel, { color: theme.ink3 }]}>Property</Text>
            <Text style={[styles.itemValue, { color: theme.ink }]}>{user.property}</Text>
          </View>

          <View style={[styles.item, { borderBottomColor: theme.line2 }]}>
            <Text style={[styles.itemLabel, { color: theme.ink3 }]}>
              {isLandlord ? 'Total Units' : 'Room Number'}
            </Text>
            <Text style={[styles.itemValue, { color: theme.ink }]}>
              {isLandlord ? user.totalUnits : user.room}
            </Text>
          </View>

          <View style={styles.item}>
            <Text style={[styles.itemLabel, { color: theme.ink3 }]}>UPI ID</Text>
            <Text style={[styles.itemValue, { color: theme.primary }]}>{user.upiId}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Reusable Edit Profile Modal */}
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
      />
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
    gap: SPACING.xs,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: SPACING.xs,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: FONT_WEIGHT.heavy,
  },
  name: {
    fontSize: 22,
    fontWeight: FONT_WEIGHT.heavy,
  },
  phoneText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.semibold,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.sm,
  },
  editProfileBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  section: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    gap: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  editInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editInlineText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  toggleLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  switchBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  pressed: {
    opacity: 0.8,
  },
  modeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  modeCard: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    gap: SPACING.xs,
  },
  modeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  itemLabel: {
    fontSize: FONT_SIZE.base,
  },
  itemValue: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
