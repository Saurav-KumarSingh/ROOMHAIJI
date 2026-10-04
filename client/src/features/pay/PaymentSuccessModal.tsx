import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface PaymentSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  amount: string;
  month: string;
  landlordName: string;
  tenantName?: string;
  propertyName: string;
  roomNo: string;
  paymentMethod: string;
  transactionId?: string;
}

export const PaymentSuccessModal = memo(function PaymentSuccessModal({
  visible,
  onClose,
  amount,
  month,
  landlordName,
  tenantName = 'Amit Kumar',
  propertyName,
  roomNo,
  paymentMethod,
  transactionId = `TXN9F3K82Q`,
}: PaymentSuccessModalProps) {
  const { theme } = useTheme();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadReceipt = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1200);
  };

  const handleViewInReceipts = () => {
    onClose();
    router.push('/(tabs)/receipts' as any);
  };

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: theme.ink + '8C' }]}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface }, theme.sh3]}>
          <ScrollView
            contentContainerStyle={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Success Badge Banner */}
            <View style={styles.topSuccessContainer}>
              <View style={[styles.checkCircle, { backgroundColor: theme.okBg }]}>
                <Ionicons name="checkmark-circle" size={44} color={theme.ok} />
              </View>
              <Text style={[styles.title, { color: theme.ink }]}>
                Payment Successful!
              </Text>
              <Text style={[styles.subtitle, { color: theme.ink3 }]}>
                Rent for {month} paid to {landlordName}
              </Text>
            </View>

            {/* Official Rent Receipt Card UI */}
            <View
              style={[
                styles.receiptCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.line,
                },
                theme.sh1,
              ]}
            >
              {/* Receipt Header */}
              <View style={styles.cardHeaderRow}>
                <View style={[styles.logoBadge, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.logoText, { color: theme.white }]}>RH</Text>
                </View>

                <View style={styles.cardHeaderCol}>
                  <Text style={[styles.brandTitle, { color: theme.ink }]}>
                    RoomHaiji
                  </Text>
                  <Text style={[styles.brandSubtitle, { color: theme.ink3 }]}>
                    Rent Receipt · {month}
                  </Text>
                </View>
              </View>

              {/* Dotted Divider */}
              <View style={[styles.dashedLine, { borderColor: theme.line }]} />

              {/* Amount Received Hero */}
              <View style={styles.amountSection}>
                <Text style={[styles.sectionLabel, { color: theme.ink3 }]}>
                  AMOUNT RECEIVED
                </Text>
                <Text style={[styles.amountHeroText, { color: theme.ink }]}>
                  {amount}
                </Text>
              </View>

              {/* 2-Column Details Grid */}
              <View style={styles.gridContainer}>
                {/* Row 1 */}
                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>LANDLORD</Text>
                    <Text style={[styles.fieldValue, { color: theme.ink }]}>{landlordName}</Text>
                  </View>
                  <View style={styles.gridCol}>
                    <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>TENANT</Text>
                    <Text style={[styles.fieldValue, { color: theme.ink }]}>{tenantName}</Text>
                  </View>
                </View>

                {/* Row 2 */}
                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>PROPERTY</Text>
                    <Text style={[styles.fieldValue, { color: theme.ink }]}>{propertyName}</Text>
                  </View>
                  <View style={styles.gridCol}>
                    <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>ROOM / UNIT</Text>
                    <Text style={[styles.fieldValue, { color: theme.ink }]}>{roomNo}</Text>
                  </View>
                </View>

                {/* Row 3 */}
                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>RENT PERIOD</Text>
                    <Text style={[styles.fieldValue, { color: theme.ink }]}>01–31 {month}</Text>
                  </View>
                  <View style={styles.gridCol}>
                    <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>PAYMENT DATE</Text>
                    <Text style={[styles.fieldValue, { color: theme.ink }]}>{todayFormatted}</Text>
                  </View>
                </View>

                {/* Row 4 */}
                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>PAYMENT METHOD</Text>
                    <Text style={[styles.fieldValue, { color: theme.ink }]}>
                      {paymentMethod.toUpperCase()} (GPS)
                    </Text>
                  </View>
                  <View style={styles.gridCol}>
                    <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>REFERENCE NO.</Text>
                    <Text style={[styles.fieldValue, { color: theme.ink }]}>{transactionId}</Text>
                  </View>
                </View>
              </View>

              {/* Dotted Divider */}
              <View style={[styles.dashedLine, { borderColor: theme.line }]} />

              {/* Bottom Stamp & Signature Row */}
              <View style={styles.cardFooterRow}>
                {/* Landlord + Paid Stamp */}
                <View style={styles.footerLeftCol}>
                  <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>LANDLORD</Text>
                  <Text style={[styles.fieldValue, { color: theme.ink }]}>{landlordName}</Text>
                  <Text style={[styles.upiSubtitle, { color: theme.ink3 }]}>rajesh.sharma@oksbi</Text>

                  {/* PAID Dashed Stamp */}
                  <View style={[styles.paidStamp, { borderColor: theme.primary }]}>
                    <Text style={[styles.paidStampText, { color: theme.primary }]}>PAID</Text>
                  </View>
                </View>

                {/* Tenant Signature */}
                <View style={styles.footerRightCol}>
                  <View style={[styles.signatureLine, { borderTopColor: theme.ink }]}>
                    <Text style={[styles.signatureLabel, { color: theme.ink3 }]}>TENANT SIGN</Text>
                    <Text style={[styles.signatureName, { color: theme.ink2 }]}>{tenantName}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Side-by-side Download and Done Action Buttons */}
            <View style={styles.sideBySideRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Download Receipt"
                disabled={isDownloading}
                onPress={handleDownloadReceipt}
                style={({ pressed }) => [
                  styles.outlinedTileBtn,
                  {
                    borderColor: downloaded ? theme.ok : theme.line,
                    backgroundColor: downloaded ? theme.okBg : theme.surface,
                  },
                  (pressed || isDownloading) && styles.pressed,
                ]}
              >
                <Ionicons
                  name={downloaded ? 'checkmark-circle-outline' : 'download-outline'}
                  size={18}
                  color={downloaded ? theme.ok : theme.ink}
                  style={styles.btnIcon}
                />
                <Text style={[styles.outlinedTileBtnText, { color: downloaded ? theme.ok : theme.ink }]}>
                  {downloaded ? 'Downloaded' : isDownloading ? 'Saving...' : 'Download'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Done"
                onPress={onClose}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: theme.primary },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.primaryBtnText, { color: theme.white }]}>
                  Done
                </Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View All Receipts"
              onPress={handleViewInReceipts}
              style={({ pressed }) => [
                styles.viewAllBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.viewAllBtnText, { color: theme.primary }]}>
                View All Receipts →
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '94%',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  modalScroll: {
    paddingBottom: SPACING.xs,
  },

  topSuccessContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZE.h3,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    textAlign: 'center',
  },

  /* Receipt Card Styling */
  receiptCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  cardHeaderCol: {
    flex: 1,
  },
  brandTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  brandSubtitle: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.medium,
  },

  dashedLine: {
    borderStyle: 'dashed',
    borderWidth: 0.8,
    marginVertical: SPACING.md,
  },

  amountSection: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  amountHeroText: {
    fontSize: 32,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
  },

  gridContainer: {
    gap: SPACING.md,
    marginVertical: SPACING.sm,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  gridCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },

  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: SPACING.xs,
  },
  footerLeftCol: {
    flex: 1,
  },
  upiSubtitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
  },
  paidStamp: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    transform: [{ rotate: '-3deg' }],
  },
  paidStampText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.heavy,
    letterSpacing: 1,
  },

  footerRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  signatureLine: {
    borderTopWidth: 1,
    paddingTop: 4,
    alignItems: 'flex-end',
    minWidth: 100,
  },
  signatureLabel: {
    fontSize: 9.5,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  signatureName: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },

  /* Actions Row */
  sideBySideRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  outlinedTileBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlinedTileBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  btnIcon: {
    marginRight: SPACING.xs,
  },
  viewAllBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  viewAllBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  pressed: {
    opacity: 0.8,
  },
});
