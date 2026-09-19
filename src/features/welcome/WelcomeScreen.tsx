import { Ionicons } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  LANGUAGE_OPTIONS,
  type SupportedLanguage,
  type TranslationKey,
} from '@/constants/i18n';
import { RADIUS, SPACING, type ThemeTokens } from '@/constants/theme';
import { useI18n } from '@/hooks/use-i18n';
import { useTheme } from '@/hooks/use-theme';

const LOGO_SOURCE: ImageSource = require('@/assets/images/logo.png');

type Role = 'landlord' | 'tenant';

interface RoleOption {
  role: Role;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  getColors: (theme: ThemeTokens) => { icon: string; bg: string };
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'landlord',
    titleKey: 'role.landlord',
    subtitleKey: 'role.landlord.sub',
    getColors: (theme) => ({ icon: theme.primary, bg: theme.primary050 }),
  },
  {
    role: 'tenant',
    titleKey: 'role.tenant',
    subtitleKey: 'role.tenant.sub',
    getColors: (theme) => ({ icon: theme.accent, bg: theme.accent050 }),
  },
];

interface RoleCardProps {
  option: RoleOption;
  t: (key: TranslationKey) => string;
  theme: ThemeTokens;
  onPress: (role: Role) => void;
}

function RoleCard({ option, t, theme, onPress }: RoleCardProps) {
  const handlePress = useCallback(() => onPress(option.role), [onPress, option.role]);
  const colors = option.getColors(theme);
  const title = t(option.titleKey);
  const subtitle = t(option.subtitleKey);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.line },
        theme.sh1,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <View style={[styles.iconBg, { backgroundColor: colors.bg }]}>
        <Ionicons name="person-outline" size={24} color={colors.icon} />
      </View>
      <View style={styles.cardText}>
        <Text style={[styles.cardTitle, { color: theme.ink }]}>{title}</Text>
        <Text style={[styles.cardSub, { color: theme.ink3 }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.ink3} />
    </Pressable>
  );
}

interface LangButtonProps {
  value: SupportedLanguage;
  labelKey: TranslationKey;
  active: boolean;
  theme: ThemeTokens;
  t: (key: TranslationKey) => string;
  onPress: (lang: SupportedLanguage) => void;
}

function LangButton({ value, labelKey, active, theme, t, onPress }: LangButtonProps) {
  const handlePress = useCallback(() => onPress(value), [onPress, value]);
  const label = t(labelKey);

  return (
    <Pressable
      style={[
        styles.langBtn,
        {
          backgroundColor: active ? theme.primary050 : theme.surface,
          borderColor: active ? theme.primary : theme.line,
        },
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}>
      <Text
        style={[
          styles.langText,
          { color: active ? theme.primary : theme.ink3, fontWeight: active ? '600' : '500' },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function WelcomeScreen() {
  const { language, setLanguage, t } = useI18n();
  const { theme } = useTheme();

  const handleRoleSelect = useCallback((role: Role) => {
    router.push({
      pathname: '/auth/phone',
      params: { role },
    } as any);
  }, []);

  const handleLangChange = useCallback(
    (l: SupportedLanguage) => setLanguage(l),
    [setLanguage],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.surface2 }]}>
      <View style={styles.container}>
        {/* Brand logo */}
        <Image
          source={LOGO_SOURCE}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="RoomHaiji logo"
        />

        {/* Hero heading */}
        <View style={styles.hero}>
          <Text style={[styles.heading, { color: theme.ink }]}>
            {t('welcome.greeting')}{' '}
            <Text style={{ color: theme.primary }}>{t('app.name')}</Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.ink3 }]}>
            {t('app.tag')} {t('welcome.heroDesc')}
          </Text>
        </View>

        {/* Push cards to the bottom */}
        <View style={styles.spacer} />

        {/* Role selection cards */}
        <View style={styles.cards}>
          {ROLE_OPTIONS.map((option) => (
            <RoleCard
              key={option.role}
              option={option}
              t={t}
              theme={theme}
              onPress={handleRoleSelect}
            />
          ))}
        </View>

        {/* Language toggle */}
        <View style={styles.langRow}>
          {LANGUAGE_OPTIONS.map((opt) => (
            <LangButton
              key={opt.code}
              value={opt.code}
              labelKey={opt.labelKey}
              active={language === opt.code}
              theme={theme}
              t={t}
              onPress={handleLangChange}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingVertical:SPACING.xxl
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
    paddingVertical:SPACING.xxl
  },
  logo: {
    width: 100,
    height: 100,
    marginVertical:SPACING.xxl
  },
  hero: {
    marginTop: SPACING.xxl+SPACING.xxl,
    gap: SPACING.sm + 2,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
  },
  cards: {
    gap: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.75,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 13,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  langBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  langText: {
    fontSize: 14,
  },
});
