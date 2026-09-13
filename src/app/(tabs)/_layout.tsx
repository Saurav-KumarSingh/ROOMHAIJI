import { Ionicons } from '@expo/vector-icons';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ComponentProps, memo, useMemo } from 'react';
import { ColorValue, Platform } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/**
 * Renders a tab icon with platform parity:
 * - iOS   → native SF Symbol via `expo-symbols` (crisp, adaptive weight)
 * - Android/Web → Ionicons from `@expo/vector-icons` (bundled with Expo)
 */
const TabIcon = memo(function TabIcon({
  sfSymbol,
  ionicon,
  color,
  size,
}: {
  sfSymbol: string;
  ionicon: ComponentProps<typeof Ionicons>['name'];
  color: ColorValue;
  size: number;
}) {
  if (Platform.OS === 'ios') {
    return <SymbolView name={sfSymbol as any} tintColor={color} size={size} />;
  }
  return <Ionicons name={ionicon} color={color} size={size} />;
});

export default memo(function TabsLayout() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ role?: string }>();

  const isLandlord = params.role === 'landlord';

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.ink3,
      tabBarStyle: {
        backgroundColor: theme.surface,
        borderTopColor: theme.line,
        height: Platform.OS === 'ios' ? 88 : 64,
        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600' as const,
      },
    }),
    [theme],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      {/* Tab 1: Home (Both Roles) */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabIcon sfSymbol="house.fill" ionicon="home" color={color} size={22} />
          ),
        }}
      />

      {/* Tab 2: Pay (Tenant) vs Properties (Landlord) */}
      <Tabs.Screen
        name="pay"
        options={{
          title: isLandlord ? 'Properties' : 'Pay',
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol={isLandlord ? 'building.2.fill' : 'plus.circle.fill'}
              ionicon={isLandlord ? 'business-outline' : 'add'}
              color={color}
              size={22}
            />
          ),
        }}
      />

      {/* Tab 3: Receipts (Tenant) vs Tenants (Landlord) */}
      <Tabs.Screen
        name="receipts"
        options={{
          title: isLandlord ? 'Tenants' : 'Receipts',
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol={isLandlord ? 'person.2.fill' : 'doc.text.fill'}
              ionicon={isLandlord ? 'people-outline' : 'document-text-outline'}
              color={color}
              size={22}
            />
          ),
        }}
      />

      {/* Tab 4: Issues (Tenant) vs Payments (Landlord) */}
      <Tabs.Screen
        name="issues"
        options={{
          title: isLandlord ? 'Payments' : 'Issues',
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol={isLandlord ? 'creditcard.fill' : 'wrench.and.screwdriver.fill'}
              ionicon={isLandlord ? 'card-outline' : 'construct-outline'}
              color={color}
              size={22}
            />
          ),
        }}
      />

      {/* Tab 5: Profile (Both Roles) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabIcon
              sfSymbol="person.crop.circle.fill"
              ionicon="person-outline"
              color={color}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
});
