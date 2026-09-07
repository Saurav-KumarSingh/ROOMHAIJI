import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Image,
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

  // Multi-step state: 1, 2, 3, or 4
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Landlord Personal Details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [city, setCity] = useState<string>('');

  // Step 2: Management Type
  const [managementType, setManagementType] =
    useState<ManagementType>('building_rooms');

  // Step 3: Unit Count
  const [unitCount, setUnitCount] = useState<number>(12);

  // Step 4: Property Details
  const [propertyName, setPropertyName] = useState<string>('Sharma Building');
  const [selectedPropertyType, setSelectedPropertyType] =
    useState<string>('Building / Multiple Rooms');
  const [address, setAddress] = useState<string>(
    '12, MG Road, Andheri West, Mumbai - 400058',
  );
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false);

  // Photos State
  const [photos, setPhotos] = useState<string[]>([]);

  // Photo Upload Handlers
  const handleAddPhoto = useCallback(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const uri = event.target?.result as string;
            if (uri) {
              setPhotos((prev) => [...prev, uri]);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      const sampleImages = [
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      ];
      const nextImg = sampleImages[photos.length % sampleImages.length];
      setPhotos((prev) => [...prev, nextImg]);
    }
  }, [photos.length]);

  const handleRemovePhoto = useCallback((indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }, []);

  // Focus states
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validation State
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    upiId?: string;
    propertyName?: string;
  }>({});

  const [touched, setTouched] = useState<{
    fullName?: boolean;
    email?: boolean;
    upiId?: boolean;
    propertyName?: boolean;
  }>({});

  // Validation Logic
  const validateFullName = useCallback((val: string) => {
    if (!val.trim()) return 'Full name is required';
    if (val.trim().length < 2) return 'Full name must be at least 2 characters';
    return undefined;
  }, []);

  const validateEmail = useCallback((val: string) => {
    if (!val.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return 'Please enter a valid email address';
    return undefined;
  }, []);

  const validateUpiId = useCallback((val: string) => {
    if (!val.trim()) return undefined;
    const upiRegex = /^[\w.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(val.trim())) return 'Please enter a valid UPI ID (e.g. name@upi)';
    return undefined;
  }, []);

  const validatePropertyName = useCallback((val: string) => {
    if (!val.trim()) return 'Property name is required';
    return undefined;
  }, []);

  // Field Handlers
  const handleFullNameChange = useCallback(
    (text: string) => {
      setFullName(text);
      if (touched.fullName || errors.fullName) {
        setErrors((prev) => ({ ...prev, fullName: validateFullName(text) }));
      }
    },
    [touched.fullName, errors.fullName, validateFullName],
  );

  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text);
      if (touched.email || errors.email) {
        setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
      }
    },
    [touched.email, errors.email, validateEmail],
  );

  const handleUpiIdChange = useCallback(
    (text: string) => {
      setUpiId(text);
      if (touched.upiId || errors.upiId) {
        setErrors((prev) => ({ ...prev, upiId: validateUpiId(text) }));
      }
    },
    [touched.upiId, errors.upiId, validateUpiId],
  );

  const handlePropertyNameChange = useCallback(
    (text: string) => {
      setPropertyName(text);
      if (touched.propertyName || errors.propertyName) {
        setErrors((prev) => ({
          ...prev,
          propertyName: validatePropertyName(text),
        }));
      }
    },
    [touched.propertyName, errors.propertyName, validatePropertyName],
  );

  const handleBlurField = useCallback(
    (field: 'fullName' | 'email' | 'upiId' | 'propertyName' | 'city' | 'address') => {
      setFocusedField(null);
      if (field === 'fullName') {
        setTouched((prev) => ({ ...prev, fullName: true }));
        setErrors((prev) => ({ ...prev, fullName: validateFullName(fullName) }));
      } else if (field === 'email') {
        setTouched((prev) => ({ ...prev, email: true }));
        setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
      } else if (field === 'upiId') {
        setTouched((prev) => ({ ...prev, upiId: true }));
        setErrors((prev) => ({ ...prev, upiId: validateUpiId(upiId) }));
      } else if (field === 'propertyName') {
        setTouched((prev) => ({ ...prev, propertyName: true }));
        setErrors((prev) => ({ ...prev, propertyName: validatePropertyName(propertyName) }));
      }
    },
    [fullName, email, upiId, propertyName, validateFullName, validateEmail, validateUpiId, validatePropertyName],
  );

  // Handle Back Navigation
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
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
    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const upiErr = validateUpiId(upiId);

    setTouched({
      fullName: true,
      email: true,
      upiId: true,
    });

    setErrors((prev) => ({
      ...prev,
      fullName: nameErr,
      email: emailErr,
      upiId: upiErr,
    }));

    if (nameErr || emailErr || upiErr) {
      return;
    }

    setCurrentStep(2);
  }, [fullName, email, upiId, validateFullName, validateEmail, validateUpiId]);

  const handleStep2Continue = useCallback(() => {
    if (managementType === 'one_flat') {
      setSelectedPropertyType('Single Flat / Independent House');
      setUnitCount((prev) => (prev > 5 ? 1 : prev));
    } else if (managementType === 'multiple_flats') {
      setSelectedPropertyType('Multiple Flats / Apartments');
    } else {
      setSelectedPropertyType('Building / Multiple Rooms');
    }
    setCurrentStep(3);
  }, [managementType]);

  const handleStep3Continue = useCallback(() => {
    setCurrentStep(4);
  }, []);

  const handleStep4Continue = useCallback(() => {
    const propErr = validatePropertyName(propertyName);
    if (propErr) {
      setTouched((prev) => ({ ...prev, propertyName: true }));
      setErrors((prev) => ({ ...prev, propertyName: propErr }));
      return;
    }
    Keyboard.dismiss();
    router.push({
      pathname: '/auth/add-rooms',
      params: {
        role: 'landlord',
        phone: params.phone || '',
        fullName,
        email,
        upiId,
        city,
        property: propertyName,
        propertyType: selectedPropertyType,
        units: String(unitCount),
      },
    } as any);
  }, [params.phone, fullName, email, upiId, city, propertyName, selectedPropertyType, unitCount, validatePropertyName]);

  // Completion Handlers (for Add rooms later)
  const handleComplete = useCallback(
    (addRoomsNow: boolean) => {
      const propErr = validatePropertyName(propertyName);
      if (propErr) {
        setTouched((prev) => ({ ...prev, propertyName: true }));
        setErrors((prev) => ({ ...prev, propertyName: propErr }));
        return;
      }
      Keyboard.dismiss();
      router.replace({
        pathname: '/(tabs)/home',
        params: {
          role: 'landlord',
          phone: params.phone || '',
          onboarded: 'true',
          fullName,
          email,
          upiId,
          city,
          property: propertyName,
          propertyType: selectedPropertyType,
          units: String(unitCount),
          addRoomsNow: String(addRoomsNow),
        },
      } as any);
    },
    [params.phone, fullName, email, upiId, city, propertyName, selectedPropertyType, unitCount, validatePropertyName],
  );

  // Progress Bar Percentage
  const progressPercent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return '25%';
      case 2:
        return '50%';
      case 3:
        return '75%';
      case 4:
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
              {`STEP ${currentStep} OF 4`}
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
              STEP 1: Landlord Details
              ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.ink }]}>
                  Landlord Details
                </Text>
                <Text style={[styles.subtitle, { color: theme.ink3 }]}>
                  Tell us a bit about yourself to set up your profile and rent receipts.
                </Text>
              </View>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <View style={styles.fieldsStack}>
                  {/* Full Name */}
                  <View style={styles.fieldItem}>
                    <Text style={[styles.label, { color: theme.ink }]}>
                      Full Name
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: theme.surface,
                          borderColor:
                            errors.fullName && touched.fullName
                              ? theme.danger
                              : focusedField === 'fullName'
                                ? theme.primary
                                : theme.line,
                        },
                      ]}>
                      <TextInput
                        style={[styles.input, { color: theme.ink }]}
                        value={fullName}
                        onChangeText={handleFullNameChange}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => handleBlurField('fullName')}
                        placeholder="Name"
                        placeholderTextColor={theme.ink3}
                        accessibilityLabel="Full Name"
                      />
                    </View>
                    {errors.fullName && touched.fullName && (
                      <View style={styles.errorRow}>
                        <Ionicons
                          name="alert-circle-outline"
                          size={14}
                          color={theme.danger}
                        />
                        <Text style={[styles.errorText, { color: theme.danger }]}>
                          {errors.fullName}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Email Address */}
                  <View style={styles.fieldItem}>
                    <Text style={[styles.label, { color: theme.ink }]}>
                      Email Address
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: theme.surface,
                          borderColor:
                            errors.email && touched.email
                              ? theme.danger
                              : focusedField === 'email'
                                ? theme.primary
                                : theme.line,
                        },
                      ]}>
                      <TextInput
                        style={[styles.input, { color: theme.ink }]}
                        value={email}
                        onChangeText={handleEmailChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => handleBlurField('email')}
                        placeholder="Email"
                        placeholderTextColor={theme.ink3}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        accessibilityLabel="Email Address"
                      />
                    </View>
                    {errors.email && touched.email && (
                      <View style={styles.errorRow}>
                        <Ionicons
                          name="alert-circle-outline"
                          size={14}
                          color={theme.danger}
                        />
                        <Text style={[styles.errorText, { color: theme.danger }]}>
                          {errors.email}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* UPI ID */}
                  <View style={styles.fieldItem}>
                    <Text style={[styles.label, { color: theme.ink }]}>
                      UPI ID (for collecting rent)
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: theme.surface,
                          borderColor:
                            errors.upiId && touched.upiId
                              ? theme.danger
                              : focusedField === 'upiId'
                                ? theme.primary
                                : theme.line,
                        },
                      ]}>
                      <TextInput
                        style={[styles.input, { color: theme.ink }]}
                        value={upiId}
                        onChangeText={handleUpiIdChange}
                        onFocus={() => setFocusedField('upiId')}
                        onBlur={() => handleBlurField('upiId')}
                        placeholder="UPI ID"
                        placeholderTextColor={theme.ink3}
                        autoCapitalize="none"
                        accessibilityLabel="UPI ID"
                      />
                    </View>
                    {errors.upiId && touched.upiId ? (
                      <View style={styles.errorRow}>
                        <Ionicons
                          name="alert-circle-outline"
                          size={14}
                          color={theme.danger}
                        />
                        <Text style={[styles.errorText, { color: theme.danger }]}>
                          {errors.upiId}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="information-circle-outline"
                          size={16}
                          color={theme.ink3}
                        />
                        <Text style={[styles.infoText, { color: theme.ink3 }]}>
                          Used for instant tenant UPI payments and rent collection QR code.
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* City / Location */}
                  <View style={styles.fieldItem}>
                    <Text style={[styles.label, { color: theme.ink }]}>
                      Location
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: theme.surface,
                          borderColor:
                            focusedField === 'city'
                              ? theme.primary
                              : theme.line,
                        },
                      ]}>
                      <TextInput
                        style={[styles.input, { color: theme.ink }]}
                        value={city}
                        onChangeText={setCity}
                        onFocus={() => setFocusedField('city')}
                        onBlur={() => handleBlurField('city')}
                        placeholder="Location"
                        placeholderTextColor={theme.ink3}
                        accessibilityLabel="City or Location"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Spacer */}
              <View style={styles.spacer} />

              {/* Step 1 Action Button */}
              <Pressable
                onPress={handleStep1Continue}
                accessibilityRole="button"
                accessibilityLabel="Continue to property management options"
                style={({ pressed }) => [
                  styles.bottomButton,
                  {
                    backgroundColor: theme.primary,
                  },
                  theme.sh2,
                  pressed && styles.bottomButtonPressed,
                ]}>
                <Text style={[styles.bottomButtonText, { color: theme.white }]}>
                  Continue →
                </Text>
              </Pressable>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 2: What do you manage?
              ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
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

              {/* Step 2 Action Button */}
              <Pressable
                onPress={handleStep2Continue}
                accessibilityRole="button"
                accessibilityLabel="Continue to unit count"
                style={({ pressed }) => [
                  styles.bottomButton,
                  { backgroundColor: theme.primary },
                  theme.sh2,
                  pressed && styles.bottomButtonPressed,
                ]}>
                <Text style={[styles.bottomButtonText, { color: theme.white }]}>
                  Continue →
                </Text>
              </Pressable>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 3: How many rental units do you have?
              ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
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

              {/* Counter Stepper */}
              <View style={styles.formGroup}>
                <View style={styles.fieldsStack}>
                  <View style={styles.fieldItem}>
                    <Text style={[styles.label, { color: theme.ink }]}>
                      Number of units
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        styles.stepperContainer,
                        {
                          backgroundColor: theme.surface,
                          borderColor:
                            focusedField === 'unitCount'
                              ? theme.primary
                              : theme.line,
                        },
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
                        <Ionicons name="remove" size={20} color={theme.ink} />
                      </Pressable>

                      {/* Numeric Value & Label */}
                      <View style={styles.stepperCenter}>
                        <Text
                          style={[styles.stepperValueText, { color: theme.ink }]}>
                          {unitCount}
                        </Text>
                        <Text
                          style={[styles.unitsLabelText, { color: theme.ink3 }]}>
                          {unitCount === 1 ? 'unit' : 'units'}
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
                        <Ionicons name="add" size={20} color={theme.ink} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>

              {/* Spacer pushing tip & button to the bottom */}
              <View style={styles.spacer} />

              {/* Tip Callout Box near Continue Button */}
              <View
                style={[
                  styles.tipBox,
                  {
                    backgroundColor: theme.surface3,
                    borderColor: theme.line,
                    borderWidth: 1,
                    marginBottom: SPACING.md,
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

              {/* Step 3 Action Button */}
              <Pressable
                onPress={handleStep3Continue}
                accessibilityRole="button"
                accessibilityLabel="Continue to property details"
                style={({ pressed }) => [
                  styles.bottomButton,
                  { backgroundColor: theme.primary, marginTop: 0 },
                  theme.sh2,
                  pressed && styles.bottomButtonPressed,
                ]}>
                <Text style={[styles.bottomButtonText, { color: theme.white }]}>
                  Continue →
                </Text>
              </Pressable>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 4: Add your first property
              ═══════════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
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
                      Property name
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: theme.surface,
                          borderColor:
                            errors.propertyName && touched.propertyName
                              ? theme.danger
                              : focusedField === 'name'
                                ? theme.primary
                                : theme.line,
                        },
                      ]}>
                      <TextInput
                        style={[styles.input, { color: theme.ink }]}
                        value={propertyName}
                        onChangeText={handlePropertyNameChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => handleBlurField('propertyName')}
                        placeholder="e.g. Sharma Building"
                        placeholderTextColor={theme.ink3}
                        accessibilityLabel="Property name"
                      />
                    </View>
                    {errors.propertyName && touched.propertyName && (
                      <View style={styles.errorRow}>
                        <Ionicons
                          name="alert-circle-outline"
                          size={14}
                          color={theme.danger}
                        />
                        <Text style={[styles.errorText, { color: theme.danger }]}>
                          {errors.propertyName}
                        </Text>
                      </View>
                    )}
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

                  {/* Photos (OPTIONAL) */}
                  <View style={styles.fieldItem}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.label, { color: theme.ink }]}>
                        Photos{' '}
                      </Text>
                      <Text
                        style={[styles.optionalLabel, { color: theme.ink3 }]}>
                        (OPTIONAL)
                      </Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.photosRow}>
                      {/* Uploaded Photos Thumbnails */}
                      {photos.map((photoUri, index) => (
                        <View key={index} style={styles.photoSlotContainer}>
                          <Image
                            source={{ uri: photoUri }}
                            style={styles.photoThumbnail}
                          />
                          <Pressable
                            onPress={() => handleRemovePhoto(index)}
                            hitSlop={8}
                            accessibilityRole="button"
                            accessibilityLabel={`Remove photo ${index + 1}`}
                            style={styles.removePhotoBtn}>
                            <Ionicons
                              name="close-circle"
                              size={20}
                              color={theme.danger}
                            />
                          </Pressable>
                        </View>
                      ))}

                      {/* Render at least 3 total slots matching the user screenshot layout */}
                      {Array.from({
                        length: Math.max(3 - photos.length, 1),
                      }).map((_, idx) => (
                        <Pressable
                          key={`add-slot-${idx}`}
                          onPress={handleAddPhoto}
                          accessibilityRole="button"
                          accessibilityLabel="Add property photo"
                          style={({ pressed }) => [
                            styles.photoAddSlot,
                            {
                              backgroundColor: theme.surface,
                              borderColor: theme.line,
                            },
                            pressed && styles.photoSlotPressed,
                          ]}>
                          <Ionicons name="add" size={26} color={theme.ink3} />
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>

              {/* Spacer pushing buttons to the bottom */}
              <View style={styles.spacer} />

              {/* Step 4 Action Buttons */}
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
                  onPress={handleStep4Continue}
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
    paddingHorizontal: 0,
    justifyContent: 'space-between',
  },
  stepperBtn: {
    width: 52,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  stepperBtnPressed: {
    opacity: 0.6,
  },
  stepperCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  stepperValueText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  unitsLabelText: {
    fontSize: FONT_SIZE.md,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  infoText: {
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
    flex: 1,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: 16,
    flex: 1,
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.5,
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  photoAddSlot: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoSlotContainer: {
    position: 'relative',
    width: 76,
    height: 76,
  },
  photoThumbnail: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.md,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  photoSlotPressed: {
    opacity: 0.7,
  },
});
