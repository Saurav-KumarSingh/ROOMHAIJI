import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { useTheme } from '@/hooks/use-theme';

export interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EditProfileModal({ visible, onClose }: EditProfileModalProps) {
  const { theme } = useTheme();
  const { user, updateProfile } = useUser();

  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editProperty, setEditProperty] = useState(user.property);
  const [editRoom, setEditRoom] = useState(user.room);
  const [editUpiId, setEditUpiId] = useState(user.upiId);

  const isLandlord = user.role === 'landlord';

  // Sync state whenever modal opens or user profile updates
  useEffect(() => {
    if (visible) {
      setEditName(user.name);
      setEditPhone(user.phone);
      setEditProperty(user.property);
      setEditRoom(user.room);
      setEditUpiId(user.upiId);
    }
  }, [visible, user]);

  const handleSave = () => {
    updateProfile({
      name: editName.trim() || user.name,
      phone: editPhone.trim() || user.phone,
      property: editProperty.trim() || user.property,
      room: editRoom.trim() || user.room,
      upiId: editUpiId.trim() || user.upiId,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.line }]}>
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="create-outline" size={22} color={theme.primary} />
              <Text style={[styles.modalTitle, { color: theme.ink }]}>Edit Profile</Text>
            </View>
            <Pressable hitSlop={8} onPress={onClose} accessibilityLabel="Close modal">
              <Ionicons name="close" size={22} color={theme.ink3} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.formContent}>
            
            {/* Input: Full Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>FULL NAME</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter full name"
                placeholderTextColor={theme.ink3}
                style={[
                  styles.input,
                  { color: theme.ink, borderColor: theme.line, backgroundColor: theme.surface2 },
                ]}
              />
            </View>

            {/* Input: Phone */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>PHONE NUMBER</Text>
              <TextInput
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                placeholderTextColor={theme.ink3}
                style={[
                  styles.input,
                  { color: theme.ink, borderColor: theme.line, backgroundColor: theme.surface2 },
                ]}
              />
            </View>

            {/* Input: Property Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>PROPERTY / BUILDING</Text>
              <TextInput
                value={editProperty}
                onChangeText={setEditProperty}
                placeholder="Building name"
                placeholderTextColor={theme.ink3}
                style={[
                  styles.input,
                  { color: theme.ink, borderColor: theme.line, backgroundColor: theme.surface2 },
                ]}
              />
            </View>

            {/* Input: Room Number or Total Units */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>
                {isLandlord ? 'TOTAL UNITS' : 'ROOM NUMBER'}
              </Text>
              <TextInput
                value={editRoom}
                onChangeText={setEditRoom}
                placeholder={isLandlord ? '12' : '204'}
                placeholderTextColor={theme.ink3}
                style={[
                  styles.input,
                  { color: theme.ink, borderColor: theme.line, backgroundColor: theme.surface2 },
                ]}
              />
            </View>

            {/* Input: UPI ID */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.ink3 }]}>UPI ID FOR PAYMENTS</Text>
              <TextInput
                value={editUpiId}
                onChangeText={setEditUpiId}
                placeholder="yourname@upi"
                autoCapitalize="none"
                placeholderTextColor={theme.ink3}
                style={[
                  styles.input,
                  { color: theme.ink, borderColor: theme.line, backgroundColor: theme.surface2 },
                ]}
              />
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: theme.primary },
                pressed && styles.pressedBtn,
              ]}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save Profile</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '88%',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  formContent: {
    gap: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  formGroup: {
    gap: SPACING.xs,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZE.base,
  },
  saveBtn: {
    height: 50,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  pressedBtn: {
    opacity: 0.9,
  },
});
