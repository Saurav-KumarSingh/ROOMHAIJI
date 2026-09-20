import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
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
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type StepType = 1 | 2 | 3 | 4;

// ── MEMOIZED STEP PROGRESS INDICATOR ─────────────────────────────────────────
interface StepSegmentProps {
  currentStep: StepType;
  onSelectStep: (step: StepType) => void;
  theme: any;
}

const StepSegmentTrack = memo(function StepSegmentTrack({
  currentStep,
  onSelectStep,
  theme,
}: StepSegmentProps) {
  const steps: { id: StepType; label: string }[] = useMemo(
    () => [
      { id: 1, label: '1 Details' },
      { id: 2, label: '2 Rent' },
      { id: 3, label: '3 Agree' },
      { id: 4, label: '4 Invite' },
    ],
    []
  );

  return (
    <View style={[styles.stepSegmentTrack, { backgroundColor: theme.surface3 }]}>
      {steps.map((step) => {
        const isActive = currentStep === step.id;
        return (
          <Pressable
            key={step.id}
            onPress={() => onSelectStep(step.id)}
            style={[
              styles.stepSegmentPill,
              isActive && [
                styles.stepSegmentPillActive,
                { backgroundColor: theme.surface },
                theme.sh1,
              ],
            ]}>
            <Text
              style={[
                styles.stepSegmentText,
                { color: isActive ? theme.ink : theme.ink3 },
                isActive && styles.stepSegmentTextActive,
              ]}>
              {step.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

// ── MEMOIZED STEP 1 FORM ─────────────────────────────────────────────────────
interface Step1FormProps {
  fullName: string;
  setFullName: (v: string) => void;
  mobileNumber: string;
  setMobileNumber: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  kycDoc: string;
  setKycDoc: (v: string) => void;
  emergencyContact: string;
  setEmergencyContact: (v: string) => void;
  theme: any;
}

const Step1TenantDetails = memo(function Step1TenantDetails({
  fullName,
  setFullName,
  mobileNumber,
  setMobileNumber,
  email,
  setEmail,
  kycDoc,
  setKycDoc,
  emergencyContact,
  setEmergencyContact,
  theme,
}: Step1FormProps) {
  return (
    <View style={styles.formContainer}>
      <Text style={[styles.sectionTitle, { color: theme.ink }]}>
        Tenant Details
      </Text>

      {/* Full Name */}
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.ink }]}>
          Full name <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
          placeholderTextColor={theme.ink3}
          style={[
            styles.textInput,
            {
              color: theme.ink,
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
          ]}
        />
      </View>

      {/* Mobile Number */}
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.ink }]}>
          Mobile number <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <View style={styles.phoneInputRow}>
          <View
            style={[
              styles.countryCodeBox,
              {
                backgroundColor: theme.surface3,
                borderColor: theme.line,
              },
            ]}>
            <Text style={[styles.countryCodeText, { color: theme.primary }]}>
              +91
            </Text>
          </View>
          <TextInput
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor={theme.ink3}
            style={[
              styles.textInput,
              styles.phoneInputFlex,
              {
                color: theme.ink,
                backgroundColor: theme.surface,
                borderColor: theme.line,
              },
            ]}
          />
        </View>
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.ink }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="name@gmail.com"
          placeholderTextColor={theme.ink3}
          style={[
            styles.textInput,
            {
              color: theme.ink,
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
          ]}
        />
      </View>

      {/* KYC / Aadhaar */}
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.ink }]}>
          Aadhaar / PAN <Text style={styles.optionalBadgeText}>(OPTIONAL)</Text>
        </Text>
        <TextInput
          value={kycDoc}
          onChangeText={setKycDoc}
          placeholder="For agreement & KYC"
          placeholderTextColor={theme.ink3}
          style={[
            styles.textInput,
            {
              color: theme.ink,
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
          ]}
        />
      </View>

      {/* Emergency Contact */}
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.ink }]}>
          Emergency contact
        </Text>
        <TextInput
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          placeholder="Name & number"
          placeholderTextColor={theme.ink3}
          style={[
            styles.textInput,
            {
              color: theme.ink,
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
          ]}
        />
      </View>
    </View>
  );
});

// ── MAIN ADD TENANT SCREEN ───────────────────────────────────────────────────
export function AddTenantScreen() {
  const { theme } = useTheme();

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState<StepType>(1);

  // Form Field States
  const [fullName, setFullName] = useState('Amit Kumar');
  const [mobileNumber, setMobileNumber] = useState('98112 34567');
  const [email, setEmail] = useState('amit.k@gmail.com');
  const [kycDoc, setKycDoc] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Step 2 Rent States
  const [rentAmount, setRentAmount] = useState('12000');
  const [depositAmount, setDepositAmount] = useState('24000');
  const [dueDate, setDueDate] = useState('5');

  const handleClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home' as any);
    }
  }, []);

  const handleSelectStep = useCallback((step: StepType) => {
    setCurrentStep(step);
  }, []);

  const handleContinue = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as StepType);
    } else {
      handleClose();
    }
  }, [currentStep, handleClose]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        
        {/* Top Header Bar */}
        <View style={[styles.topHeader, { backgroundColor: theme.surface, borderBottomColor: theme.line }]}>
          <Pressable
            onPress={handleClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}>
            <Ionicons name="close" size={22} color={theme.ink} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.ink }]}>Add Tenant</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* 4-Step Pill Progress Bar */}
          <StepSegmentTrack
            currentStep={currentStep}
            onSelectStep={handleSelectStep}
            theme={theme}
          />

          {/* ── STEP 1 ──────────────────────────────────────────────────────── */}
          {currentStep === 1 && (
            <Step1TenantDetails
              fullName={fullName}
              setFullName={setFullName}
              mobileNumber={mobileNumber}
              setMobileNumber={setMobileNumber}
              email={email}
              setEmail={setEmail}
              kycDoc={kycDoc}
              setKycDoc={setKycDoc}
              emergencyContact={emergencyContact}
              setEmergencyContact={setEmergencyContact}
              theme={theme}
            />
          )}

          {/* ── STEP 2 ──────────────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <View style={styles.formContainer}>
              <Text style={[styles.sectionTitle, { color: theme.ink }]}>
                Rent & Deposit
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.ink }]}>
                  Monthly Rent (₹) <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  value={rentAmount}
                  onChangeText={setRentAmount}
                  keyboardType="number-pad"
                  placeholder="12000"
                  placeholderTextColor={theme.ink3}
                  style={[
                    styles.textInput,
                    {
                      color: theme.ink,
                      backgroundColor: theme.surface,
                      borderColor: theme.line,
                    },
                  ]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.ink }]}>
                  Security Deposit (₹)
                </Text>
                <TextInput
                  value={depositAmount}
                  onChangeText={setDepositAmount}
                  keyboardType="number-pad"
                  placeholder="24000"
                  placeholderTextColor={theme.ink3}
                  style={[
                    styles.textInput,
                    {
                      color: theme.ink,
                      backgroundColor: theme.surface,
                      borderColor: theme.line,
                    },
                  ]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.ink }]}>
                  Due Date of Month
                </Text>
                <TextInput
                  value={dueDate}
                  onChangeText={setDueDate}
                  keyboardType="number-pad"
                  placeholder="5"
                  placeholderTextColor={theme.ink3}
                  style={[
                    styles.textInput,
                    {
                      color: theme.ink,
                      backgroundColor: theme.surface,
                      borderColor: theme.line,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* ── STEP 3 ──────────────────────────────────────────────────────── */}
          {currentStep === 3 && (
            <View style={styles.formContainer}>
              <Text style={[styles.sectionTitle, { color: theme.ink }]}>
                Agreement & Terms
              </Text>
              
              <View style={[styles.infoBox, { backgroundColor: theme.primary050, borderColor: theme.primary100 }]}>
                <Ionicons name="document-text-outline" size={24} color={theme.primary} />
                <Text style={[styles.infoBoxText, { color: theme.ink }]}>
                  Standard 11-month rental agreement will be generated automatically for {fullName || 'Tenant'}.
                </Text>
              </View>
            </View>
          )}

          {/* ── STEP 4 ──────────────────────────────────────────────────────── */}
          {currentStep === 4 && (
            <View style={styles.formContainer}>
              <Text style={[styles.sectionTitle, { color: theme.ink }]}>
                Invite Tenant
              </Text>

              <View style={[styles.inviteCard, { backgroundColor: theme.surface, borderColor: theme.line }, theme.sh2]}>
                <Ionicons name="sparkles-outline" size={32} color={theme.primary} />
                <Text style={[styles.inviteCodeTitle, { color: theme.ink }]}>
                  Invite Code Generated
                </Text>
                <View style={[styles.codeBox, { backgroundColor: theme.surface3 }]}>
                  <Text style={[styles.codeText, { color: theme.primary }]}>ROOM-204</Text>
                </View>
                <Text style={[styles.inviteSub, { color: theme.ink3 }]}>
                  Share this code with {fullName} to join Room 204 on RoomHaiji.
                </Text>
              </View>
            </View>
          )}

          {/* Primary Action Button */}
          <Pressable
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            style={({ pressed }) => [
              styles.continueBtn,
              { backgroundColor: theme.primary },
              theme.sh2,
              pressed && styles.pressedBtn,
            ]}>
            <Text style={styles.continueBtnText}>
              {currentStep === 4 ? 'Finish & Save' : 'Continue →'}
            </Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  pressed: {
    opacity: 0.7,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.xl,
  },

  /* 4-Step Pill Progress Segment */
  stepSegmentTrack: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    padding: 4,
    gap: 4,
  },
  stepSegmentPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  stepSegmentPillActive: {
    borderRadius: RADIUS.md,
  },
  stepSegmentText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.medium,
  },
  stepSegmentTextActive: {
    fontWeight: FONT_WEIGHT.bold,
  },

  /* Form Container */
  formContainer: {
    gap: SPACING.lg,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.heavy,
  },
  inputGroup: {
    gap: SPACING.xs + 2,
  },
  inputLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  requiredAsterisk: {
    color: '#DC2626',
    fontWeight: FONT_WEIGHT.bold,
  },
  optionalBadgeText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.medium,
    color: '#94A3B8',
  },
  textInput: {
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZE.base,
  },

  /* Phone Input Row */
  phoneInputRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  countryCodeBox: {
    width: 64,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  phoneInputFlex: {
    flex: 1,
  },

  /* Step 3 & 4 helpers */
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  infoBoxText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    flex: 1,
  },
  inviteCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    gap: SPACING.md,
  },
  inviteCodeTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  codeBox: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  codeText: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT.heavy,
    letterSpacing: 2,
  },
  inviteSub: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },

  /* Continue Button */
  continueBtn: {
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  pressedBtn: {
    opacity: 0.9,
  },
});
