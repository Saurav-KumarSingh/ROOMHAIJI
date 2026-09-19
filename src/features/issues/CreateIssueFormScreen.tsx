import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

export interface CreateIssueFormData {
  title: string;
  description: string;
  hasPhoto: boolean;
}

interface CreateIssueFormScreenProps {
  onBack?: () => void;
  onSubmit?: (data: CreateIssueFormData) => void;
}

export function CreateIssueFormScreen({
  onBack,
  onSubmit,
}: CreateIssueFormScreenProps) {
  const { theme } = useTheme();

  const [title, setTitle] = useState('');
  const [photos, setPhotos] = useState<boolean[]>([false, false]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/issues');
    }
  }, [onBack]);

  const handleTogglePhoto = useCallback((index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      setError('Please enter an issue title');
      return;
    }

    Keyboard.dismiss();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const formData: CreateIssueFormData = {
        title: title.trim(),
        description: description.trim(),
        hasPhoto: photos.some(Boolean),
      };

      if (onSubmit) {
        onSubmit(formData);
      } else {
        router.replace({
          pathname: '/(tabs)/issues',
          params: {
            newTitle: formData.title,
            newDesc: formData.description,
            hasPhoto: formData.hasPhoto ? 'true' : 'false',
          },
        } as any);
      }
    }, 400);
  }, [title, description, photos, onSubmit]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.surface2 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar */}
          <View style={styles.headerRow}>
            <Pressable
              onPress={handleBack}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.line,
                },
                theme.sh1,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="arrow-back" size={20} color={theme.ink} />
            </Pressable>

            <Text style={[styles.headerTitle, { color: theme.ink }]}>
              Report Issue
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* Form Content Container */}
          <View style={styles.formContainer}>
            {/* Field 1: Issue Title */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.ink }]}>
                Issue title
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.surface,
                    borderColor: error ? theme.danger : theme.line,
                    color: theme.ink,
                  },
                ]}
                placeholder="e.g. Leaking tap"
                placeholderTextColor={theme.ink3}
                value={title}
                onChangeText={(txt) => {
                  setTitle(txt);
                  if (error) setError('');
                }}
                editable={!isSubmitting}
              />
              {!!error && (
                <Text style={[styles.errorText, { color: theme.danger }]}>
                  {error}
                </Text>
              )}
            </View>

            {/* Field 2: Photo (OPTIONAL) */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.fieldLabel, { color: theme.ink }]}>Photo </Text>
                <Text style={[styles.optionalTag, { color: theme.ink3 }]}>
                  (OPTIONAL)
                </Text>
              </View>

              <View style={styles.photosRow}>
                {photos.map((hasPhoto, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleTogglePhoto(idx)}
                    disabled={isSubmitting}
                    accessibilityRole="button"
                    accessibilityLabel={`Upload photo ${idx + 1}`}
                    style={({ pressed }) => [
                      styles.photoBox,
                      {
                        backgroundColor: hasPhoto ? theme.primary050 : theme.surface,
                        borderColor: hasPhoto ? theme.primary : theme.line,
                      },
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name={hasPhoto ? 'checkmark-circle' : 'camera-outline'}
                      size={22}
                      color={hasPhoto ? theme.primary : theme.ink3}
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Field 3: Description */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.ink }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.line,
                    color: theme.ink,
                  },
                ]}
                placeholder="Describe the problem..."
                placeholderTextColor={theme.ink3}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* Spacer following OTP/Login screen button layout pattern */}
          <View style={styles.spacer} />

          {/* Submit Request Action Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Submit Request"
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: theme.primary,
                opacity: isSubmitting ? 0.7 : pressed ? 0.85 : 1,
              },
              theme.sh2,
            ]}
          >
            <Ionicons name="paper-plane-outline" size={20} color={theme.white} />
            <Text style={[styles.submitButtonText, { color: theme.white }]}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  /* Header Row */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    height: 44,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 20,
    fontWeight: FONT_WEIGHT.heavy,
  },
  headerSpacer: {
    width: 42,
  },

  formContainer: {
    gap: SPACING.xl,
    marginTop: SPACING.md,
  },
  formGroup: {
    gap: SPACING.xs + 2,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalTag: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.5,
  },

  textInput: {
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },

  photosRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: 4,
  },
  photoBox: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textArea: {
    minHeight: 110,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    textAlignVertical: 'top',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },

  errorText: {
    fontSize: FONT_SIZE.caption,
    marginTop: 2,
  },

  /* Spacer to follow OTP/Login screen button position */
  spacer: {
    flex: 1,
    minHeight: SPACING.xxl + SPACING.lg,
  },

  submitButton: {
    height: 54,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  submitButtonText: {
    ...TYPOGRAPHY.button,
    fontSize: FONT_SIZE.lg,
  },
});
