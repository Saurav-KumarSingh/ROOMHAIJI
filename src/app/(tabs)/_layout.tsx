import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router, Tabs, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ComponentProps, memo, useCallback, useMemo } from 'react';
import {
  ColorValue,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/user-context';
import { useTheme } from '@/hooks/use-theme';

/**
 * Tab icon helper with platform parity
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

/**
 * Custom Bottom Tab Bar for Landlord & Tenant mode with central Floating FAB (+) button
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useTheme();
  const { user } = useUser();
  const params = useLocalSearchParams<{ role?: string }>();

  const isLandlord = user.role === 'landlord' || params.role === 'landlord';

  const handleFabPress = useCallback(() => {
    router.push('/auth/add-tenant' as any);
  }, []);

  if (!isLandlord) {
    // Tenant standard tab bar rendering
    return (
      <View
        style={[
          styles.tabBarContainer,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.line,
          },
        ]}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const label = options.title ?? route.name;
          const color = isFocused ? theme.primary : theme.ink3;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              style={styles.tabItem}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color,
                size: 22,
              })}
              <Text style={[styles.tabLabel, { color }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  const landlordTabs = useMemo(
    () => [
      { key: 'home', routeName: 'home', label: 'Home', ionicon: 'home-outline' as const, sfSymbol: 'house.fill' },
      { key: 'pay', routeName: 'pay', label: 'Properties', ionicon: 'business-outline' as const, sfSymbol: 'building.2.fill' },
      { key: 'fab', routeName: 'fab', label: 'FAB', ionicon: 'add' as const, sfSymbol: 'plus' },
      { key: 'issues', routeName: 'issues', label: 'Payments', ionicon: 'card-outline' as const, sfSymbol: 'creditcard.fill' },
      { key: 'receipts', routeName: 'receipts', label: 'Tenants', ionicon: 'people-outline' as const, sfSymbol: 'person.2.fill' },
    ],
    []
  );

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.line,
        },
      ]}>
      {landlordTabs.map((tab) => {
        if (tab.key === 'fab') {
          return (
            <View key="center-fab-wrapper" style={styles.fabWrapper}>
              <Pressable
                onPress={handleFabPress}
                accessibilityRole="button"
                accessibilityLabel="Add Room or Tenant"
                style={({ pressed }) => [
                  styles.centerFabBtn,
                  {
                    backgroundColor: theme.primary,
                    borderColor: theme.surface,
                    shadowColor: theme.primary,
                  },
                  pressed && styles.pressedFab,
                ]}>
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </Pressable>
            </View>
          );
        }

        const routeIndex = state.routes.findIndex((r: any) => r.name === tab.routeName);
        const isFocused = routeIndex !== -1 && state.index === routeIndex;
        const color = isFocused ? theme.primary : theme.ink3;

        const handlePress = () => {
          if (routeIndex !== -1) {
            const route = state.routes[routeIndex];
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }
        };

        return (
          <Pressable
            key={tab.key}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            style={styles.tabItem}>
            <TabIcon
              sfSymbol={tab.sfSymbol}
              ionicon={tab.ionicon}
              color={color}
              size={22}
            />
            <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default memo(function TabsLayout() {
  const { theme } = useTheme();
  const { user } = useUser();
  const params = useLocalSearchParams<{ role?: string }>();

  const isLandlord = user.role === 'landlord' || params.role === 'landlord';

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      {/* Tab 1: Home */}
      <Tabs.Screen name="home" options={{ title: 'Home' }} />

      {/* Tab 2: Pay / Properties */}
      <Tabs.Screen
        name="pay"
        options={{ title: isLandlord ? 'Properties' : 'Pay' }}
      />

      {/* Tab 3: Receipts / Tenants */}
      <Tabs.Screen
        name="receipts"
        options={{ title: isLandlord ? 'Tenants' : 'Receipts' }}
      />

      {/* Tab 4: Issues / Payments */}
      <Tabs.Screen
        name="issues"
        options={{ title: isLandlord ? 'Payments' : 'Issues' }}
      />

      {/* Tab 5: Profile */}
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
});

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 6,
    paddingTop: 6,
    borderTopWidth: 1,
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 11.5,
    fontWeight: FONT_WEIGHT.medium as any,
  },

  /* Floating Center FAB (+) Button */
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerFabBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28, // Floating elevation above top edge of tab bar
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  pressedFab: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
});
