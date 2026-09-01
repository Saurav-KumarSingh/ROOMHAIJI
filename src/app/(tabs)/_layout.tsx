import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ComponentProps, memo } from 'react';
import { ColorValue, Platform } from 'react-native';

import { useI18n } from '@/hooks/use-i18n';
import { useTheme } from '@/hooks/use-theme';

/**
 * Renders a tab icon with platform parity:
 * - iOS   → native SF Symbol via `expo-symbols` (crisp, adaptive weight)
 * - Android/Web → Ionicons from `@expo/vector-icons` (bundled with Expo)
 */
function TabIcon({
  sfSymbol,
  ionicon,
  color,
  size,
}: {
  sfSymbol: string;
  ionicon: ComponentProps<typeof Ionicons>['name'];
  /** ColorValue from the Tabs API */
  color: ColorValue;
  size: number;
}) {
  if (Platform.OS === 'ios') {
    return <SymbolView name={sfSymbol as any} tintColor={color} size={size} />;
  }
  return <Ionicons name={ionicon} color={color} size={size} />;
}

export default memo(function TabsLayout() {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.ink3,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.line,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color }) => (
            <TabIcon sfSymbol="house.fill" ionicon="home" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol="person.crop.circle.fill"
              ionicon="person-circle"
              color={color}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
});
