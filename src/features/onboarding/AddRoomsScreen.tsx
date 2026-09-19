import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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

export interface RoomItem {
  id: string;
  number: string;
  rent: number;
}

export function AddRoomsScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    role?: string;
    phone?: string;
    property?: string;
    propertyType?: string;
    units?: string;
    fullName?: string;
    email?: string;
    upiId?: string;
    city?: string;

    // Params coming back from dedicated Add Room Detail Screen
    action?: 'add' | 'edit' | 'delete';
    roomId?: string;
    roomNumber?: string;
    roomRent?: string;
    timestamp?: string;
  }>();

  // Rooms State - Initialized empty without pre-filled sample rooms
  const [rooms, setRooms] = useState<RoomItem[]>([]);

  // Handle return parameters from /auth/add-room-detail screen
  useEffect(() => {
    if (!params.action || !params.timestamp) return;

    if (params.action === 'add' && params.roomNumber) {
      const rentNum = parseInt(params.roomRent || '10000', 10);
      setRooms((prev) => [
        ...prev,
        {
          id: params.roomId || String(Date.now()),
          number: params.roomNumber!,
          rent: rentNum,
        },
      ]);
    } else if (params.action === 'edit' && params.roomId && params.roomNumber) {
      const rentNum = parseInt(params.roomRent || '10000', 10);
      setRooms((prev) =>
        prev.map((r) =>
          r.id === params.roomId
            ? { ...r, number: params.roomNumber!, rent: rentNum }
            : r,
        ),
      );
    } else if (params.action === 'delete' && params.roomId) {
      setRooms((prev) => prev.filter((r) => r.id !== params.roomId));
    }
  }, [params.action, params.roomId, params.roomNumber, params.roomRent, params.timestamp]);

  // Navigation Back
  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/auth/landlord-onboarding' as any);
    }
  }, []);

  // Handlers to open dedicated NEW SCREEN for Adding / Editing Room
  const handleOpenAddRoom = useCallback(() => {
    const nextRoomNum = String(101 + rooms.length);
    router.push({
      pathname: '/auth/add-room-detail',
      params: {
        isEdit: 'false',
        number: nextRoomNum,
        rent: '10000',
      },
    } as any);
  }, [rooms.length]);

  const handleOpenEditRoom = useCallback((room: RoomItem) => {
    router.push({
      pathname: '/auth/add-room-detail',
      params: {
        isEdit: 'true',
        roomId: room.id,
        number: room.number,
        rent: String(room.rent),
      },
    } as any);
  }, []);

  // Final Complete Handler
  const handleFinish = useCallback(() => {
    Keyboard.dismiss();
    router.replace({
      pathname: '/(tabs)/home',
      params: {
        role: 'landlord',
        phone: params.phone || '',
        onboarded: 'true',
        fullName: params.fullName || '',
        email: params.email || '',
        upiId: params.upiId || '',
        city: params.city || '',
        property: params.property || '',
        propertyType: params.propertyType || '',
        units: String(rooms.length),
        addRoomsNow: 'true',
        rooms: JSON.stringify(rooms),
      },
    } as any);
  }, [params, rooms]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Top Bar Navigation */}
          <View style={styles.topBar}>
            <Pressable
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.line,
                },
                theme.sh1,
                pressed && styles.backButtonPressed,
              ]}>
              <Ionicons name="arrow-back" size={20} color={theme.ink} />
            </Pressable>

            <Text style={[styles.topBarTitle, { color: theme.ink }]}>
              Add Rooms
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.headerDivider, { backgroundColor: theme.line }]} />

          {/* Header Subtitle */}
          <View style={styles.header}>
            <Text style={[styles.subtitle, { color: theme.ink3 }]}>
              Add each unit. You can edit or add more later.
            </Text>
          </View>

          {/* Rooms List / Empty State Container */}
          <View style={styles.formGroup}>
            {rooms.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.line,
                  },
                  theme.sh1,
                ]}>
                <View
                  style={[
                    styles.emptyIconBox,
                    { backgroundColor: theme.surface3 },
                  ]}>
                  <Ionicons name="bed-outline" size={32} color={theme.ink2} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.ink }]}>
                  No rooms added yet
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.ink3 }]}>
                  Tap below to add details like room number, rent amount, and occupancy type for your property.
                </Text>
                <Pressable
                  onPress={handleOpenAddRoom}
                  accessibilityRole="button"
                  accessibilityLabel="Add first room"
                  style={({ pressed }) => [
                    styles.emptyAddBtn,
                    { backgroundColor: theme.primary },
                    theme.sh2,
                    pressed && styles.backButtonPressed,
                  ]}>
                  <Ionicons
                    name="add"
                    size={20}
                    color={theme.white}
                    style={styles.addIcon}
                  />
                  <Text style={[styles.emptyAddBtnText, { color: theme.white }]}>
                    Add First Room
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View
                style={[
                  styles.roomsCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.line,
                  },
                  theme.sh1,
                ]}>
                {rooms.map((room, index) => (
                  <View key={room.id}>
                    {index > 0 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: theme.line },
                        ]}
                      />
                    )}
                    <View style={styles.roomRow}>
                      {/* Room Badge */}
                      <View
                        style={[
                          styles.roomBadge,
                          { backgroundColor: theme.surface3 },
                        ]}>
                        <Text
                          style={[styles.roomBadgeText, { color: theme.ink }]}>
                          {room.number}
                        </Text>
                      </View>

                      {/* Room Details */}
                      <View style={styles.roomTextContent}>
                        <Text style={[styles.roomTitle, { color: theme.ink }]}>
                          {`Room ${room.number}`}
                        </Text>
                        <Text style={[styles.roomRent, { color: theme.ink3 }]}>
                          {`₹${room.rent.toLocaleString('en-IN')} / month`}
                        </Text>
                      </View>

                      {/* Edit Action Link */}
                      <Pressable
                        onPress={() => handleOpenEditRoom(room)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Edit Room ${room.number}`}
                        style={({ pressed }) => [
                          styles.editBtn,
                          pressed && styles.backButtonPressed,
                        ]}>
                        <Text style={[styles.editText, { color: theme.ink2 }]}>
                          Edit
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Spacer pushing buttons to bottom */}
          <View style={styles.spacer} />

          {/* Action Buttons Stack */}
          <View style={styles.actionsStack}>
            {rooms.length > 0 && (
              <Pressable
                onPress={handleOpenAddRoom}
                accessibilityRole="button"
                accessibilityLabel="Add another room"
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.line,
                  },
                  theme.sh1,
                  pressed && styles.backButtonPressed,
                ]}>
                <Ionicons
                  name="add"
                  size={20}
                  color={theme.ink}
                  style={styles.addIcon}
                />
                <Text style={[styles.secondaryButtonText, { color: theme.ink }]}>
                  Add Another Room
                </Text>
              </Pressable>
            )}

            {/* Save & Finish -> Primary Button */}
            <Pressable
              onPress={handleFinish}
              accessibilityRole="button"
              accessibilityLabel="Save and finish onboarding"
              style={({ pressed }) => [
                styles.bottomButton,
                { backgroundColor: theme.primary },
                theme.sh2,
                pressed && styles.backButtonPressed,
              ]}>
              <Text style={[styles.bottomButtonText, { color: theme.white }]}>
                {rooms.length > 0 ? 'Save & Finish →' : 'Finish Signup →'}
              </Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: SPACING.xxl,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.85,
  },
  topBarTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  headerDivider: {
    height: 1,
    width: '100%',
    marginBottom: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
  },
  formGroup: {
    marginTop: SPACING.xs,
  },
  emptyCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  emptyAddBtn: {
    height: 46,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAddBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  roomsCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  roomBadge: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomBadgeText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  roomTextContent: {
    flex: 1,
    gap: 2,
  },
  roomTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  roomRent: {
    fontSize: FONT_SIZE.sm,
  },
  editBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  editText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  spacer: {
    flex: 1,
    minHeight: SPACING.xxl + SPACING.lg,
  },
  actionsStack: {
    marginTop: SPACING.xxl,
    gap: SPACING.md,
  },
  secondaryButton: {
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    marginRight: 4,
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.button,
  },
  bottomButton: {
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: {
    ...TYPOGRAPHY.button,
  },
});
