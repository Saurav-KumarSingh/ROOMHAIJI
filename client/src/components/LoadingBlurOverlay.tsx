import { memo } from 'react';
import {
  ActivityIndicator,
  Platform,
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

export interface LoadingBlurOverlayProps {
  /**
   * Whether the loading blur overlay is visible.
   */
  visible: boolean;
  /**
   * Loading message text displayed below indicator. Default is 'Please wait...'
   */
  message?: string;
  /**
   * Optional custom backdrop color override.
   */
  backdropColor?: string;
}

export const LoadingBlurOverlay = memo(function LoadingBlurOverlay({
  visible,
  message = 'Please wait...',
  backdropColor,
}: LoadingBlurOverlayProps) {
  const { theme } = useTheme();

  if (!visible) return null;

  const defaultBackdrop = backdropColor || 'rgba(15, 23, 42, 0.68)';

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: defaultBackdrop }]}>
      <View>
        <ActivityIndicator size="large" color={theme.white} />
        <Text style={[styles.messageText, { color: theme.white }]}>
          {message}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 10,
    ...(Platform.OS === 'web'
      ? ({
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      } as any)
      : {}),
  },
  cardBox: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    minWidth: 160,
  },
  messageText: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
