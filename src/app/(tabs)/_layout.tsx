import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ColorValue, Platform } from 'react-native';

import { COLORS } from '@/constants/theme';

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

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          backgroundColor: COLORS.bgBase,
          borderTopColor: COLORS.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabIcon sfSymbol="house.fill" ionicon="home" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
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
}
