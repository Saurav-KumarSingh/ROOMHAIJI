import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
  TYPOGRAPHY,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function AddRoomDetailScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    roomId?: string;
    number?: string;
    rent?: string;
    isEdit?: string;
    existingRooms?: string;
  }>();

  const isEdit = params.isEdit === 'true';

  const [roomNumber, setRoomNumber] = useState<string>(params.number || '');
  const [rentAmount, setRentAmount] = useState<string>(params.rent || '');
  const [roomType, setRoomType] = useState<'single' | 'double' | 'hall'>('single');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/auth/add-rooms' as any);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!roomNumber.trim()) {
      setError('Please enter a room number');
      return;
    }

    const rentVal = parseInt(rentAmount.replace(/[^0-9]/g, ''), 10) || 10000;

    Keyboard.dismiss();

    router.push({
      pathname: '/auth/add-rooms',
      params: {
        action: isEdit ? 'edit' : 'add',
        roomId: params.roomId || String(Date.now()),
        roomNumber: roomNumber.trim(),
        roomRent: String(rentVal),
        timestamp: String(Date.now()),
      },
    } as any);
  }, [roomNumber, rentAmount, isEdit, params.roomId]);

  const handleDelete = useCallback(() => {
    Keyboard.dismiss();
    router.push({
      pathname: '/auth/add-rooms',
      params: {
        action: 'delete',
        roomId: params.roomId || '',
        timestamp: String(Date.now()),
      },
    } as any);
  }, [params.roomId]);

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
              {isEdit ? 'Edit Room' : 'Add Room'}
            </Text>
          </View>

          {/* Header Divider */}
          <View style={[styles.headerDivider, { backgroundColor: theme.line }]} />

          {/* Screen Subtitle */}
          <View style={styles.header}>
            <Text style={[styles.subtitle, { color: theme.ink3 }]}>
              {isEdit
                ? 'Update details for this room or rental unit.'
                : 'Enter details for the new room or rental unit.'}
            </Text>
          </View>

          {/* Form Stack */}
          <View style={styles.formGroup}>
            <View style={styles.fieldsStack}>

              {/* Room Number Input */}
              <View style={styles.fieldItem}>
                <Text style={[styles.label, { color: theme.ink }]}>
                  Room / Unit Number
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: theme.surface,
                      borderColor:
                        error && !roomNumber.trim()
                          ? theme.danger
                          : focusedField === 'number'
                            ? theme.primary
                            : theme.line,
                    },
                  ]}>
                  <TextInput
                    style={[styles.input, { color: theme.ink }]}
                    value={roomNumber}
                    onChangeText={(txt) => {
                      setRoomNumber(txt);
                      if (error) setError(null);
                    }}
                    onFocus={() => setFocusedField('number')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g. 101, 102, 2A"
                    placeholderTextColor={theme.ink3}
                    keyboardType="default"
                    accessibilityLabel="Room or Unit Number"
                  />
                </View>
                {error && !roomNumber.trim() && (
                  <View style={styles.errorRow}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={14}
                      color={theme.danger}
                    />
                    <Text style={[styles.errorText, { color: theme.danger }]}>
                      {error}
                    </Text>
                  </View>
                )}
              </View>

              {/* Monthly Rent Input */}
              <View style={styles.fieldItem}>
                <Text style={[styles.label, { color: theme.ink }]}>
                  Monthly Rent (₹)
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: theme.surface,
                      borderColor:
                        focusedField === 'rent'
                          ? theme.primary
                          : theme.line,
                    },
                  ]}>
                  <Text style={[styles.currencyPrefix, { color: theme.ink2 }]}>
                    ₹
                  </Text>
                  <TextInput
                    style={[styles.input, { color: theme.ink }]}
                    value={rentAmount}
                    onChangeText={setRentAmount}
                    onFocus={() => setFocusedField('rent')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="10,000"
                    placeholderTextColor={theme.ink3}
                    keyboardType="number-pad"
                    accessibilityLabel="Monthly Rent"
                  />
                </View>
              </View>

              {/* Room Category / Type Selection */}
              <View style={styles.fieldItem}>
                <Text style={[styles.label, { color: theme.ink }]}>
                  Room Occupancy Type
                </Text>
                <View style={styles.chipRow}>
                  <Pressable
                    onPress={() => setRoomType('single')}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          roomType === 'single'
                            ? theme.primary050
                            : theme.surface,
                        borderColor:
                          roomType === 'single'
                            ? theme.primary
                            : theme.line,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color:
                            roomType === 'single'
                              ? theme.primary
                              : theme.ink2,
                          fontWeight:
                            roomType === 'single'
                              ? FONT_WEIGHT.bold
                              : FONT_WEIGHT.medium,
                        },
                      ]}>
                      Single Room
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setRoomType('double')}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          roomType === 'double'
                            ? theme.primary050
                            : theme.surface,
                        borderColor:
                          roomType === 'double'
                            ? theme.primary
                            : theme.line,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color:
                            roomType === 'double'
                              ? theme.primary
                              : theme.ink2,
                          fontWeight:
                            roomType === 'double'
                              ? FONT_WEIGHT.bold
                              : FONT_WEIGHT.medium,
                        },
                      ]}>
                      Double / Shared
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setRoomType('hall')}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          roomType === 'hall'
                            ? theme.primary050
                            : theme.surface,
                        borderColor:
                          roomType === 'hall'
                            ? theme.primary
                            : theme.line,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color:
                            roomType === 'hall'
                              ? theme.primary
                              : theme.ink2,
                          fontWeight:
                            roomType === 'hall'
                              ? FONT_WEIGHT.bold
                              : FONT_WEIGHT.medium,
                        },
                      ]}>
                      Full Flat / Unit
                    </Text>
                  </Pressable>
                </View>
              </View>

            </View>
          </View>

          {/* Spacer pushing buttons to bottom */}
          <View style={styles.spacer} />

          {/* Action Buttons */}
          <View style={styles.actionsStack}>
            {isEdit && (
              <Pressable
                onPress={handleDelete}
                accessibilityRole="button"
                accessibilityLabel="Delete this room"
                style={({ pressed }) => [
                  styles.deleteButton,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.danger,
                  },
                  pressed && styles.backButtonPressed,
                ]}>
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={theme.danger}
                  style={styles.deleteIcon}
                />
                <Text style={[styles.deleteButtonText, { color: theme.danger }]}>
                  Delete Room
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel="Save room details"
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: theme.primary },
                theme.sh2,
                pressed && styles.backButtonPressed,
              ]}>
              <Text style={[styles.saveButtonText, { color: theme.white }]}>
                {isEdit ? 'Save Changes' : 'Save Room →'}
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
  fieldsStack: {
    gap: SPACING.lg,
  },
  fieldItem: {
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.label,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.lg,
    overflow: 'hidden',
  },
  currencyPrefix: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 0,
    ...TYPOGRAPHY.input,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 4,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
  },
  spacer: {
    flex: 1,
    minHeight: SPACING.xxl + SPACING.lg,
  },
  actionsStack: {
    marginTop: SPACING.xxl,
    gap: SPACING.md,
  },
  deleteButton: {
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    marginRight: SPACING.xs,
  },
  deleteButtonText: {
    ...TYPOGRAPHY.button,
  },
  saveButton: {
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    ...TYPOGRAPHY.button,
  },
});
