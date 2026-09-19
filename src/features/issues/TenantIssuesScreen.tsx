import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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

import { CreateIssueFormData, CreateIssueFormScreen } from './CreateIssueFormScreen';

export interface IssueItem {
  id: string;
  title: string;
  room: string;
  status: 'In progress' | 'Resolved' | 'Pending';
  dateStr: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: 'electrical' | 'plumbing' | 'furniture' | 'other';
  description?: string;
  hasPhoto?: boolean;
}

// Initial issue list matching the mockup image design exactly
const INITIAL_ISSUES: IssueItem[] = [
  {
    id: 'issue-1',
    title: 'Fan not working',
    room: 'Room 204',
    status: 'In progress',
    dateStr: 'In progress',
    icon: 'construct-outline',
    category: 'electrical',
  },
  {
    id: 'issue-2',
    title: 'Leaking tap',
    room: 'Room 204',
    status: 'Resolved',
    dateStr: 'Resolved 2 Jul',
    icon: 'checkmark',
    category: 'plumbing',
  },
];

export function TenantIssuesScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    newTitle?: string;
    newDesc?: string;
    hasPhoto?: string;
    mode?: string;
  }>();

  const [viewMode, setViewMode] = useState<'list' | 'create'>(
    params.mode === 'create' ? 'create' : 'list'
  );
  const [issues, setIssues] = useState<IssueItem[]>(INITIAL_ISSUES);

  // Automatically prepend any newly submitted issue from parameters
  useEffect(() => {
    if (params.newTitle) {
      const title = params.newTitle;
      const lowerTitle = title.toLowerCase();
      let category: IssueItem['category'] = 'other';
      let icon: keyof typeof Ionicons.glyphMap = 'construct-outline';

      if (
        lowerTitle.includes('tap') ||
        lowerTitle.includes('water') ||
        lowerTitle.includes('leak') ||
        lowerTitle.includes('pipe')
      ) {
        category = 'plumbing';
        icon = 'water-outline';
      } else if (
        lowerTitle.includes('fan') ||
        lowerTitle.includes('light') ||
        lowerTitle.includes('switch') ||
        lowerTitle.includes('power')
      ) {
        category = 'electrical';
        icon = 'construct-outline';
      } else if (
        lowerTitle.includes('bed') ||
        lowerTitle.includes('door') ||
        lowerTitle.includes('chair') ||
        lowerTitle.includes('table')
      ) {
        category = 'furniture';
        icon = 'bed-outline';
      }

      setIssues((prev) => {
        if (prev.some((item) => item.title === title && item.dateStr === 'Just now')) {
          return prev;
        }
        return [
          {
            id: `issue-${Date.now()}`,
            title,
            room: 'Room 204',
            status: 'In progress',
            dateStr: 'Just now',
            icon,
            category,
            description: params.newDesc,
            hasPhoto: params.hasPhoto === 'true',
          },
          ...prev,
        ];
      });
    }
  }, [params.newTitle, params.newDesc, params.hasPhoto]);

  const handleBack = useCallback(() => {
    if (viewMode === 'create') {
      setViewMode('list');
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home');
    }
  }, [viewMode]);

  const handleOpenReportScreen = useCallback(() => {
    setViewMode('create');
  }, []);

  const handleCreateSubmit = useCallback((formData: CreateIssueFormData) => {
    const title = formData.title;
    const lowerTitle = title.toLowerCase();
    let category: IssueItem['category'] = 'other';
    let icon: keyof typeof Ionicons.glyphMap = 'construct-outline';

    if (
      lowerTitle.includes('tap') ||
      lowerTitle.includes('water') ||
      lowerTitle.includes('leak') ||
      lowerTitle.includes('pipe')
    ) {
      category = 'plumbing';
      icon = 'water-outline';
    } else if (
      lowerTitle.includes('fan') ||
      lowerTitle.includes('light') ||
      lowerTitle.includes('switch') ||
      lowerTitle.includes('power')
    ) {
      category = 'electrical';
      icon = 'construct-outline';
    } else if (
      lowerTitle.includes('bed') ||
      lowerTitle.includes('door') ||
      lowerTitle.includes('chair') ||
      lowerTitle.includes('table')
    ) {
      category = 'furniture';
      icon = 'bed-outline';
    }

    setIssues((prev) => [
      {
        id: `issue-${Date.now()}`,
        title,
        room: 'Room 204',
        status: 'In progress',
        dateStr: 'Just now',
        icon,
        category,
        description: formData.description,
        hasPhoto: formData.hasPhoto,
      },
      ...prev,
    ]);
    setViewMode('list');
  }, []);

  // If viewMode is 'create', render form in-place inside tab screen to retain bottom navigation tab bar footer!
  if (viewMode === 'create') {
    return (
      <CreateIssueFormScreen
        onBack={() => setViewMode('list')}
        onSubmit={handleCreateSubmit}
      />
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.surface2 }]}
    >
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
          <View style={styles.headerBar}>
            <Pressable
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={10}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="arrow-back" size={22} color={theme.ink} />
            </Pressable>

            <Text style={[styles.headerTitle, { color: theme.ink }]}>
              My Issues
            </Text>

            <Pressable
              onPress={handleOpenReportScreen}
              accessibilityRole="button"
              accessibilityLabel="Add new issue"
              hitSlop={10}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="add" size={26} color={theme.ink} />
            </Pressable>
          </View>

          {/* Issue List Card Container (Read-Only Items) */}
          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: theme.surface,
                borderColor: theme.line,
              },
              theme.sh1,
            ]}
          >
            {issues.map((item, index) => {
              const isLast = index === issues.length - 1;
              const isInProgress = item.status === 'In progress';

              return (
                <View key={item.id}>
                  <View style={styles.issueItemRow}>
                    {/* Left Icon Badge */}
                    <View
                      style={[
                        styles.iconBadge,
                        {
                          backgroundColor: isInProgress
                            ? theme.warnBg
                            : theme.okBg,
                        },
                      ]}
                    >
                      <Ionicons
                        name={isInProgress ? 'construct-outline' : 'checkmark'}
                        size={20}
                        color={isInProgress ? theme.warn : theme.ok}
                      />
                    </View>

                    {/* Middle Details Text */}
                    <View style={styles.issueTextCol}>
                      <Text style={[styles.issueTitle, { color: theme.ink }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.issueSubtitle, { color: theme.ink3 }]}>
                        {item.room} · {item.dateStr}
                      </Text>
                    </View>

                    {/* Right Status Badge */}
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: isInProgress
                            ? theme.warnBg
                            : theme.okBg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusDot,
                          { color: isInProgress ? theme.warn : theme.ok },
                        ]}
                      >
                        ●{' '}
                      </Text>
                      <Text
                        style={[
                          styles.statusPillText,
                          { color: isInProgress ? theme.warn : theme.ok },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {!isLast && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: theme.line2 },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>

          {/* Spacer to follow OTP/Login screen button position */}
          <View style={styles.spacer} />

          {/* Primary Call-to-Action Button (positioned at bottom like OTP/Login screen) */}
          <Pressable
            onPress={handleOpenReportScreen}
            accessibilityRole="button"
            accessibilityLabel="Report New Issue"
            style={({ pressed }) => [
              styles.reportButton,
              { backgroundColor: theme.primary },
              theme.sh2,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons name="paper-plane-outline" size={20} color={theme.white} />
            <Text style={[styles.reportButtonText, { color: theme.white }]}>
              Report New Issue
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

  /* Header Bar */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    marginBottom: SPACING.xl,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 22,
    fontWeight: FONT_WEIGHT.heavy,
  },

  /* Issue List Card Container */
  cardContainer: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  issueItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  issueTextCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  issueTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  issueSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },

  /* Status Pill Badge */
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  statusDot: {
    fontSize: 10,
  },
  statusPillText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
  },

  divider: {
    height: 1,
    width: '100%',
  },

  /* Spacer to position button at bottom (OTP / Login screen pattern) */
  spacer: {
    flex: 1,
    minHeight: SPACING.xxl + SPACING.lg,
  },

  /* Primary Action Button */
  reportButton: {
    height: 54,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  reportButtonText: {
    ...TYPOGRAPHY.button,
    fontSize: FONT_SIZE.lg,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
