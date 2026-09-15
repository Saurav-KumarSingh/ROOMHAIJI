import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

import { PaymentSuccessModal } from './payment-success-modal';

export type PaymentMethod = 'upi' | 'netbank' | 'cash';

export interface RentalDetailItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export const PayRentScreen = memo(function PayRentScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    amount?: string;
    month?: string;
    landlordName?: string;
    propertyName?: string;
    roomNo?: string;
    dueDate?: string;
  }>();

  // Dynamic parameters with fallback values matching the mockup design
  const amount = params.amount || '₹12,000';
  const month = params.month || 'August 2026';
  const landlordName = params.landlordName || 'Rajesh Sharma';
  const propertyName = params.propertyName || 'Sharma Building';
  const roomNo = params.roomNo || '204';
  const dueDate = params.dueDate || '5 August 2026';

  // Interactive Payment State
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const rentalDetails: RentalDetailItem[] = useMemo(
    () => [
      {
        id: 'landlord',
        icon: 'person-outline',
        label: 'Landlord',
        value: landlordName,
      },
      {
        id: 'property',
        icon: 'business-outline',
        label: 'Property',
        value: propertyName,
      },
      {
        id: 'room',
        icon: 'key-outline',
        label: 'Room',
        value: roomNo,
      },
      {
        id: 'dueDate',
        icon: 'calendar-outline',
        label: 'Due date',
        value: dueDate,
      },
    ],
    [landlordName, propertyName, roomNo, dueDate],
  );

  const paymentMethods = useMemo(
    () => [
      {
        id: 'upi' as PaymentMethod,
        label: 'UPI',
        icon: 'wallet-outline' as keyof typeof Ionicons.glyphMap,
      },
      {
        id: 'netbank' as PaymentMethod,
        label: 'Netbank',
        icon: 'business-outline' as keyof typeof Ionicons.glyphMap,
      },
      {
        id: 'cash' as PaymentMethod,
        label: 'Cash',
        icon: 'cash-outline' as keyof typeof Ionicons.glyphMap,
      },
    ],
    [],
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home');
    }
  }, []);

  const handlePayPress = useCallback(() => {
    setIsProcessing(true);
    // Simulate short network request / gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 1000);
  }, []);

  const getButtonText = () => {
    switch (selectedMethod) {
      case 'upi':
        return 'Pay via UPI';
      case 'netbank':
        return 'Pay via Netbank';
      case 'cash':
        return 'Pay via Cash';
      default:
        return 'Pay Rent';
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.surface2 }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <Pressable
            accessibilityLabel="Back"
            accessibilityRole="button"
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={22} color={theme.ink} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.ink }]}>
            Pay Rent
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* 1. Hero Summary Banner */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
            theme.sh1,
          ]}
        >
          <Text style={[styles.heroAmount, { color: theme.ink }]}>
            {amount}
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.ink3 }]}>
            Rent for {month}
          </Text>
        </View>

        {/* 2. Rental Information Card */}
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
            theme.sh1,
          ]}
        >
          {rentalDetails.map((item, index) => {
            const isLast = index === rentalDetails.length - 1;
            return (
              <View key={item.id}>
                <View style={styles.detailItemRow}>
                  {/* Left Icon Badge */}
                  <View
                    style={[
                      styles.iconBadge,
                      { backgroundColor: theme.primary050 },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={theme.primary}
                    />
                  </View>

                  {/* Text Content */}
                  <View style={styles.detailTextCol}>
                    <Text style={[styles.detailLabel, { color: theme.ink }]}>
                      {item.label}
                    </Text>
                    <Text
                      style={[styles.detailValue, { color: theme.ink3 }]}
                    >
                      {item.value}
                    </Text>
                  </View>
                </View>

                {!isLast && (
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.line2 },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* 3. Payment Method Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.ink3 }]}>
            PAY USING
          </Text>
        </View>

        <View style={styles.paymentMethodsGrid}>
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <Pressable
                key={method.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Pay using ${method.label}`}
                onPress={() => setSelectedMethod(method.id)}
                style={({ pressed }) => [
                  styles.methodCard,
                  {
                    backgroundColor: isSelected
                      ? theme.primary050
                      : theme.surface,
                    borderColor: isSelected
                      ? theme.primary
                      : theme.line,
                    borderWidth: isSelected ? 1.5 : 1,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={method.icon}
                  size={24}
                  color={isSelected ? theme.primary : theme.ink2}
                />
                <Text
                  style={[
                    styles.methodLabel,
                    {
                      color: isSelected ? theme.primary : theme.ink2,
                      fontWeight: isSelected
                        ? FONT_WEIGHT.bold
                        : FONT_WEIGHT.semibold,
                    },
                  ]}
                >
                  {method.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 4. Action Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={getButtonText()}
          disabled={isProcessing}
          onPress={handlePayPress}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.primary },
            theme.sh2,
            (pressed || isProcessing) && styles.pressed,
          ]}
        >
          {isProcessing ? (
            <ActivityIndicator color={theme.white} size="small" />
          ) : (
            <View style={styles.btnContentRow}>
              <Ionicons
                name={
                  selectedMethod === 'cash'
                    ? 'cash'
                    : selectedMethod === 'netbank'
                    ? 'card'
                    : 'grid'
                }
                size={20}
                color={theme.white}
                style={styles.actionBtnIcon}
              />
              <Text style={[styles.actionBtnText, { color: theme.white }]}>
                {getButtonText()}
              </Text>
            </View>
          )}
        </Pressable>
      </ScrollView>

      {/* Success Modal */}
      <PaymentSuccessModal
        amount={amount}
        landlordName={landlordName}
        month={month}
        onClose={() => setShowSuccessModal(false)}
        paymentMethod={selectedMethod}
        propertyName={propertyName}
        roomNo={roomNo}
        visible={showSuccessModal}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  /* Header Bar */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    height: 44,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
  },
  headerSpacer: {
    width: 36,
  },

  /* Hero Card */
  heroCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },

  /* Details Card */
  detailsCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  detailTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  divider: {
    height: 1,
    width: '100%',
  },

  /* Section Header */
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  /* Payment Methods Grid */
  paymentMethodsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  methodCard: {
    flex: 1,
    height: 76,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xs,
    gap: SPACING.xs,
  },
  methodLabel: {
    fontSize: FONT_SIZE.sm,
  },

  /* Action Button */
  actionButton: {
    width: '100%',
    height: 54,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnIcon: {
    marginRight: SPACING.sm,
  },
  actionBtnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },

  pressed: {
    opacity: 0.85,
  },
});
