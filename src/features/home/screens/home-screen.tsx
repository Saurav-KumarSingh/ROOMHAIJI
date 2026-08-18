import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const overview = [
  { label: 'App shell', value: 'Expo Router' },
  { label: 'Architecture', value: 'Feature based' },
  { label: 'Status', value: 'Production ready' },
];

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Roomhaiji</Text>
          <Text style={styles.title}>A clean foundation for your app</Text>
          <Text style={styles.subtitle}>
            This project has been trimmed down to a simple, maintainable structure with clear
            feature boundaries and only the core app routing needed for production.
          </Text>
        </View>

        <View style={styles.grid}>
          {overview.map((item) => (
            <View key={item.label} style={styles.card}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 24,
    gap: 20,
  },
  hero: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  kicker: {
    color: '#7dd3fc',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flexBasis: '31%',
    minWidth: 160,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardValue: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
});
