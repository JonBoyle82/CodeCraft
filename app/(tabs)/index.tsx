import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { tracks } from '../../data/lessons';
import { loadProgress, UserProgress, defaultProgress } from '../../constants/storage';

export default function LearnScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey, Coder! 👋</Text>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>⚡ {progress.xp} XP</Text>
          </View>
        </View>

        {/* Streak */}
        {progress.streak > 0 && (
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>{progress.streak} day streak! Keep it up!</Text>
          </View>
        )}

        {/* Tracks */}
        <Text style={styles.sectionTitle}>Choose Your Track</Text>
        {tracks.map((track) => {
          const completed = track.lessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;
          const pct = Math.round((completed / track.lessons.length) * 100);

          return (
            <Pressable
              key={track.id}
              style={({ pressed }) => [
                styles.trackCard,
                { borderLeftColor: track.color, opacity: pressed ? 0.8 : 1 },
                Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
              ]}
              onPress={() =>
                router.push({
                  pathname: '/lesson/[id]',
                  params: { id: track.lessons[Math.min(completed, track.lessons.length - 1)].id },
                })
              }
            >
              <View style={styles.trackHeader}>
                <Text style={styles.trackIcon}>{track.icon}</Text>
                <View style={styles.trackInfo}>
                  <Text style={styles.trackName}>{track.name}</Text>
                  <Text style={styles.trackDesc}>{track.description}</Text>
                </View>
                <Text style={styles.trackPct}>{pct}%</Text>
              </View>

              {/* Progress bar */}
              <View style={styles.progressBg}>
                <View
                  style={[styles.progressFill, { width: `${pct}%`, backgroundColor: track.color }]}
                />
              </View>

              <Text style={styles.trackMeta}>
                {completed}/{track.lessons.length} lessons · {track.lessons.reduce((a, l) => a + l.xp, 0)} XP available
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  xpBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  xpText: { color: Colors.xp, fontWeight: 'bold', fontSize: 14 },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    gap: 10,
  },
  streakEmoji: { fontSize: 28 },
  streakText: { color: Colors.text, fontSize: 15, fontWeight: '600' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textMuted,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trackCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
  },
  trackHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  trackIcon: { fontSize: 32, marginRight: 12 },
  trackInfo: { flex: 1 },
  trackName: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  trackDesc: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  trackPct: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  progressBg: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  trackMeta: { fontSize: 12, color: Colors.textMuted },
});
