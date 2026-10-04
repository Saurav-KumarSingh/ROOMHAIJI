import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: theme.surface2 }]}>
        <Text style={[styles.title, { color: theme.ink }]}>This screen does not exist.</Text>
        <Link
          href="/"
          style={[
            styles.link,
            {
              backgroundColor: theme.surface,
              borderColor: theme.line,
            },
          ]}>
          <Text style={[styles.linkText, { color: theme.primary }]}>Go to home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  link: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
