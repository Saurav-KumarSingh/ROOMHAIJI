import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
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

export type ManagementType = 'one_flat' | 'multiple_flats' | 'building_rooms';

interface PropertyTypeOption {
  id: string;
  label: string;
}

const MANAGEMENT_OPTIONS: {
  type: ManagementType;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    type: 'one_flat',
    title: 'One Flat',
    subtitle: 'Single independent flat or house',
    icon: 'home-outline',
  },
  {
    type: 'multiple_flats',
    title: 'Multiple Flats',
    subtitle: '2 or more individual flats or apartments',
    icon: 'business-outline',
  },
  {
    type: 'building_rooms',
    title: 'Building / Rooms',
    subtitle: 'Entire building, PG, or multi-room property',
    icon: 'layers-outline',
  },
];

const PROPERTY_TYPE_OPTIONS: PropertyTypeOption[] = [
  { id: 'building_rooms', label: 'Building / Multiple Rooms' },
  { id: 'multiple_flats', label: 'Multiple Flats / Apartments' },
  { id: 'one_flat', label: 'Single Flat / Independent House' },
  { id: 'pg_coliving', label: 'PG / Co-living Space' },
  { id: 'commercial', label: 'Commercial / Shops' },
];

export function LandlordOnboardingScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ role?: string; phone?: string }>();

  // Multi-step state: 1, 2, or 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Management Type
  const [managementType, setManagementType] =
    useState<ManagementType>('building_rooms');

  // Step 2: Unit Count
  const [unitCount, setUnitCount] = useState<number>(12);

  // Step 3: Property Details
  const [propertyName, setPropertyName] = useState<string>('Sharma Building');
  const [selectedPropertyType, setSelectedPropertyType] =
    useState<string>('Building / Multiple Rooms');
  const [address, setAddress] = useState<string>(
    '12, MG Road, Andheri West, Mumbai - 400058',
  );
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false);

  // Focus states
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Handle Back Navigation
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/auth/phone' as any);
      }
    }
  }, [currentStep]);

  // Stepper Handlers
  const handleIncrementUnits = useCallback(() => {
    setUnitCount((prev) => Math.min(prev + 1, 999));
  }, []);

  const handleDecrementUnits = useCallback(() => {
    setUnitCount((prev) => Math.max(prev - 1, 1));
  }, []);

  // Next Step Handlers
  const handleStep1Continue = useCallback(() => {
    if (managementType === 'one_flat') {
      setSelectedPropertyType('Single Flat / Independent House');
      setUnitCount((prev) => (prev > 5 ? 1 : prev));
    } else if (managementType === 'multiple_flats') {
      setSelectedPropertyType('Multiple Flats / Apartments');
    } else {
      setSelectedPropertyType('Building / Multiple Rooms');
    }
    setCurrentStep(2);
  }, [managementType]);

  const handleStep2Continue = useCallback(() => {
    setCurrentStep(3);
  }, []);

  // Completion Handlers
  const handleComplete = useCallback(
    (addRoomsNow: boolean) => {
      Keyboard.dismiss();
      router.replace({
        pathname: '/(tabs)/home',
        params: {
          role: 'landlord',
          phone: params.phone || '',
          onboarded: 'true',
          property: propertyName,
          propertyType: selectedPropertyType,
          units: String(unitCount),
          addRoomsNow: String(addRoomsNow),
        },
      } as any);
    },
    [params.phone, propertyName, selectedPropertyType, unitCount],
  );

  // Progress Bar Percentage
  const progressPercent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return '33.3%';
      case 2:
        return '66.6%';
      case 3:
        return '100%';
    }
  }, [currentStep]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Top Navigation Bar */}
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

            <Text style={[styles.stepIndicator, { color: theme.ink3 }]}>
              {`STEP ${currentStep} OF 3`}
            </Text>
          </View>

          {/* Progress Bar Track & Indicator */}
          <View style={[styles.progressTrack, { backgroundColor: theme.line }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: progressPercent,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 1: What do you manage?
              ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.ink }]}>
                  What do you manage?
                </Text>
                <Text style={[styles.subtitle, { color: theme.ink3 }]}>
                  This helps us set up the right screens for you.
                </Text>
              </View>

              {/* Vertically Stacked Management Option Cards */}
              <View style={styles.formGroup}>
                <View style={styles.verticalCardsStack}>
                  {MANAGEMENT_OPTIONS.map((item) => {
                    const isSelected = managementType === item.type;
                    return (
                      <Pressable
                        key={item.type}
                        onPress={() => setManagementType(item.type)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: isSelected }}
                        style={({ pressed }) => [
                          styles.verticalCard,
                          {
                            backgroundColor: isSelected
                              ? theme.primary050
                              : theme.surface,
                            borderColor: isSelected
                              ? theme.primary
                              : theme.line,
                            borderWidth: isSelected ? 2 : 1.5,
                          },
                          theme.sh1,
                          pressed && styles.cardPressed,
                        ]}>
                        <View
                          style={[
                            styles.cardIconBox,
                            {
                              backgroundColor: isSelected
                                ? theme.primary100
                                : theme.surface3,
                            },
                          ]}>
                          <Ionicons
                            name={item.icon}
                            size={24}
                            color={isSelected ? theme.primary : theme.ink2}
                          />
                        </View>
                        <View style={styles.cardTextContent}>
                          <Text
                            style={[
                              styles.cardTitle,
                              {
                                color: isSelected
                                  ? theme.primary
                                  : theme.ink,
                                fontWeight: isSelected
                                  ? FONT_WEIGHT.bold
                                  : FONT_WEIGHT.semibold,
                              },
                            ]}>
                            {item.title}
                          </Text>
                          <Text
                            style={[
                              styles.cardSubtitle,
                              { color: theme.ink3 },
                            ]}>
                            {item.subtitle}
                          </Text>
                        </View>
                        <Ionicons
                          name={
                            isSelected
                              ? 'checkmark-circle'
                              : 'ellipse-outline'
                          }
                          size={22}
                          color={isSelected ? theme.primary : theme.ink3}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Spacer pushing button to the bottom */}
              <View style={styles.spacer} />

              {/* Step 1 Action Button */}
              <Pressable
                onPress={handleStep1Continue}
                accessibilityRole="button"
                accessibilityLabel="Continue to unit count"
                style={({ pressed }) => [
                  styles.bottomButton,
                  { backgroundColor: theme.primary },
                  theme.sh2,
                  pressed && styles.bottomButtonPressed,
                ]}>
                <Text style={[styles.bottomButtonText, { color: theme.white }]}>
                  Continue
                </Text>
              </Pressable>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 2: How many rental units do you have?
              ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.ink }]}>
                  How many rental units do you have?
                </Text>
                <Text style={[styles.subtitle, { color: theme.ink3 }]}>
                  Count all flats, rooms or shops you rent out.
                </Text>
              </View>

              {/* Counter Stepper & Tip Box */}
              <View style={styles.formGroup}>
                <View style={styles.stepperRow}>
                  <View
                    style={[
                      styles.stepperContainer,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.line,
                      },
                      theme.sh1,
                    ]}>
                    {/* Minus Button */}
                    <Pressable
                      onPress={handleDecrementUnits}
                      accessibilityRole="button"
                      accessibilityLabel="Decrease units"
                      style={({ pressed }) => [
                        styles.stepperBtn,
                        { borderRightColor: theme.line },
                        pressed && styles.stepperBtnPressed,
                      ]}>
                      <Ionicons name="remove" size={18} color={theme.ink} />
                    </Pressable>

                    {/* Numeric Value */}
                    <View style={styles.stepperValueContainer}>
                      <Text style={[styles.stepperValue, { color: theme.ink }]}>
                        {unitCount}
                      </Text>
                    </View>

                    {/* Plus Button */}
                    <Pressable
                      onPress={handleIncrementUnits}
                      accessibilityRole="button"
                      accessibilityLabel="Increase units"
                      style={({ pressed }) => [
                        styles.stepperBtn,
                        { borderLeftColor: theme.line },
                        pressed && styles.stepperBtnPressed,
                      ]}>
                      <Ionicons name="add" size={18} color={theme.ink} />
                    </Pressable>
                  </View>

                  {/* Units Label */}
                  <Text style={[styles.unitsLabel, { color: theme.ink3 }]}>
                    units
                  </Text>
                </View>

                {/* Tip Callout Box */}
                <View
                  style={[
                    styles.tipBox,
                    {
                      backgroundColor: theme.surface3,
                    },
                  ]}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={theme.ink}
                    style={styles.tipIcon}
                  />
                  <Text style={[styles.tipText, { color: theme.ink2 }]}>
                    <Text style={[styles.tipBold, { color: theme.ink }]}>
                      Tip:{' '}
                    </Text>
                    You can add or remove units any time. The free plan supports
                    up to 2; upgrade for unlimited.
                  </Text>
                </View>
              </View>

              {/* Spacer pushing button to the bottom */}
              <View style={styles.spacer} />

              {/* Step 2 Action Button */}
              <Pressable
                onPress={handleStep2Continue}
                accessibilityRole="button"
                accessibilityLabel="Continue to property details"
                style={({ pressed }) => [
                  styles.bottomButton,
                  { backgroundColor: theme.primary },
                  theme.sh2,
                  pressed && styles.bottomButtonPressed,
                ]}>
                <Text style={[styles.bottomButtonText, { color: theme.white }]}>
                  Continue
                </Text>
              </Pressable>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 3: Add your first property
              ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.ink }]}>
                  Add your first property
                </Text>
              </View>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <View style={styles.fieldsStack}>
                  {/* Property Name */}
                  <View style={styles.fieldItem}>
                    <Text style={[styles.label, { color: theme.ink }]}>
                      Property name{' '}
                      <Text style={{ color: theme.danger }}>*</Text>
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: theme.surface,
                          borderColor:
                            focusedField === 'name'
                              ? theme.primary
                              : theme.line,
                        },
                      ]}>
                      <TextInput
                        style={[styles.input, { color: theme.ink }]}
                        value={propertyName}
                        onChangeText={setPropertyName}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="e.g. Sharma Building"
                        placeholderTextColor={theme.ink3}
                        accessibilityLabel="Property name"
                      />
                    </View>
                  </View>

                  {/* Property Type Dropdown */}
                  <View style={styles.fieldItem}>
                    <Text style={[styles.label, { color: theme.ink }]}>
                      Property type
                    </Text>
                    <Pressable
                      onPress={() => setIsTypePickerOpen(true)}
                      accessibilityRole="button"
                      accessibilityLabel="Select property type"
                      style={({ pressed }) => [
                        styles.inputContainer,
                        styles.pickerButton,
                        {
                          backgroundColor: theme.surface,
                          borderColor: theme.line,
                        },
                        pressed && styles.bottomButtonPressed,
                      ]}>
                      <Text style={[styles.pickerText, { color: theme.ink }]}>
                        {selectedPropertyType}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={18}
                        color={theme.ink3}
                      />
                    </Pressable>
                  </View>

                  {/* Address */}
                  <View style={styles.fieldItem}>
                    <Text style={[styles.label, { color: theme.ink }]}>
                      Address
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: theme.surface,
                          borderColor:
                            focusedField === 'address'
                              ? theme.primary
                              : theme.line,
                        },
                      ]}>
                      <TextInput
                        style={[styles.input, { color: theme.ink }]}
                        value={address}
                        onChangeText={setAddress}
                        onFocus={() => setFocusedField('address')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter full address"
                        placeholderTextColor={theme.ink3}
                        accessibilityLabel="Property address"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Spacer pushing buttons to the bottom */}
              <View style={styles.spacer} />

              {/* Step 3 Action Buttons */}
              <View style={styles.step3Actions}>
                {/* Secondary Button: Add rooms later */}
                <Pressable
                  onPress={() => handleComplete(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Add rooms later"
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.line,
                    },
                    theme.sh1,
                    pressed && styles.bottomButtonPressed,
                  ]}>
                  <Text
                    style={[styles.secondaryButtonText, { color: theme.ink }]}>
                    Add rooms later
                  </Text>
                </Pressable>

                {/* Primary Button: Add Property & Rooms -> */}
                <Pressable
                  onPress={() => handleComplete(true)}
                  disabled={!propertyName.trim()}
                  accessibilityRole="button"
                  accessibilityLabel="Add property and rooms"
                  style={({ pressed }) => [
                    styles.bottomButton,
                    {
                      backgroundColor: theme.primary,
                      opacity: propertyName.trim()
                        ? pressed
                          ? 0.85
                          : 1
                        : 0.5,
                      marginTop: 0,
                    },
                    propertyName.trim() ? theme.sh2 : undefined,
                  ]}>
                  <Text
                    style={[styles.bottomButtonText, { color: theme.white }]}>
                    Add Property & Rooms →
                  </Text>
                </Pressable>
              </View>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Property Type Selection Modal */}
      <Modal
        visible={isTypePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTypePickerOpen(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsTypePickerOpen(false)}>
          <Pressable
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.surface,
                borderColor: theme.line,
              },
              theme.sh3,
            ]}
            onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: theme.ink }]}>
              Select Property Type
            </Text>

            {PROPERTY_TYPE_OPTIONS.map((item) => {
              const isSelected = selectedPropertyType === item.label;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setSelectedPropertyType(item.label);
                    setIsTypePickerOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.modalOption,
                    isSelected && {
                      backgroundColor: theme.primary050,
                    },
                    pressed && styles.bottomButtonPressed,
                  ]}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color: isSelected ? theme.primary : theme.ink,
                        fontWeight: isSelected
                          ? FONT_WEIGHT.bold
                          : FONT_WEIGHT.medium,
                      },
                    ]}>
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.primary}
                    />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
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
    justifyContent: 'space-between',
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
    opacity: 0.7,
  },
  stepIndicator: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
  },
  progressTrack: {
    height: 4,
    borderRadius: RADIUS.full,
    width: '100%',
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  header: {
    marginVertical: SPACING.lg,
    gap: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    marginTop: SPACING.xs,
  },
  formGroup: {
    marginTop: SPACING.md,
  },
  verticalCardsStack: {
    gap: SPACING.md,
  },
  verticalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    gap: SPACING.md,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContent: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 18,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    overflow: 'hidden',
    height: 52,
  },
  stepperBtn: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  stepperBtnPressed: {
    opacity: 0.6,
  },
  stepperValueContainer: {
    minWidth: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  stepperValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  unitsLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
  },
  tipBox: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  tipIcon: {
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: FONT_WEIGHT.bold,
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
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 0,
    ...TYPOGRAPHY.input,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  pickerButton: {
    justifyContent: 'space-between',
  },
  pickerText: {
    ...TYPOGRAPHY.input,
  },
  spacer: {
    flex: 1,
    minHeight: SPACING.xxl + SPACING.lg,
  },
  bottomButton: {
    marginTop: SPACING.xxl,
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonPressed: {
    opacity: 0.85,
  },
  bottomButtonText: {
    ...TYPOGRAPHY.button,
  },
  step3Actions: {
    marginTop: SPACING.xxl,
    gap: SPACING.md,
  },
  secondaryButton: {
    height: 54,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.button,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.xs,
  },
  modalTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  modalOptionText: {
    fontSize: FONT_SIZE.md,
  },
});
