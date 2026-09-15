import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo, useState } from 'react';
import {
  Modal,
  Pressable,
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
  propertyName,
  roomNo,
  paymentMethod,
  transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
}: PaymentSuccessModalProps) {
  const { theme } = useTheme();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleViewReceipt = () => {
    onClose();
    router.push('/(tabs)/receipts' as any);
  };

  const handleDownloadReceipt = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1200);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: theme.ink + '8C' }]}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface }, theme.sh3]}>
          {/* Success Check Badge */}
          <View style={[styles.checkCircle, { backgroundColor: theme.okBg }]}>
            <Ionicons name="checkmark-circle" size={48} color={theme.ok} />
          </View>

          <Text style={[styles.title, { color: theme.ink }]}>
            Payment Successful!
          </Text>
          <Text style={[styles.subtitle, { color: theme.ink3 }]}>
            Rent for {month} paid to {landlordName}
          </Text>

          {/* Amount Display Banner */}
          <View style={[styles.amountBanner, { backgroundColor: theme.surface2, borderColor: theme.line }]}>
            <Text style={[styles.amountText, { color: theme.ink }]}>{amount}</Text>
            <Text style={[styles.methodBadge, { color: theme.primary, backgroundColor: theme.primary050 }]}>
              {paymentMethod.toUpperCase()}
            </Text>
          </View>

          {/* Details Table */}
          <View style={[styles.detailsBox, { borderColor: theme.line2 }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.ink3 }]}>Txn ID</Text>
              <Text style={[styles.detailValue, { color: theme.ink }]}>{transactionId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.ink3 }]}>Property</Text>
              <Text style={[styles.detailValue, { color: theme.ink }]}>
                {propertyName} (Room {roomNo})
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.ink3 }]}>Date</Text>
              <Text style={[styles.detailValue, { color: theme.ink }]}>
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {/* Side-by-side Download and View Receipt buttons */}
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
              accessibilityLabel="View Receipt"
              onPress={handleViewReceipt}
              style={({ pressed }) => [
                styles.outlinedTileBtn,
                { borderColor: theme.line, backgroundColor: theme.surface },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="document-text-outline" size={18} color={theme.ink} style={styles.btnIcon} />
              <Text style={[styles.outlinedTileBtnText, { color: theme.ink }]}>
                View Receipt
              </Text>
            </Pressable>
          </View>

          {/* Main Primary Done Button */}
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
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.h3,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  amountBanner: {
    width: '100%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  amountText: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.bold,
  },
  methodBadge: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  detailsBox: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  detailValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  sideBySideRow: {
    width: '100%',
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  outlinedTileBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  outlinedTileBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    marginRight: SPACING.sm,
  },
  primaryBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  pressed: {
    opacity: 0.8,
  },
});
