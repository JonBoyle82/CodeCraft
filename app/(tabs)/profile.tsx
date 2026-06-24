import { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/colors';
import { loadProgress, UserProgress, defaultProgress } from '../../constants/storage';
import { tracks } from '../../data/lessons';

const badges = [
  { id: 'first_lesson', emoji: '🎉', label: 'First Lesson' },
  { id: 'streak_3', emoji: '🔥', label: '3-Day Streak' },
  { id: 'html_master', emoji: '🌐', label: 'HTML Master' },
  { id: 'js_wizard', emoji: '⚡', label: 'JS Wizard' },
];

export default function ProfileScreen() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useFocusEffect(
    useCallback(() => {
      loadProgress().then(setProgress);
    }, [])
  );

  const totalLessons = tracks.reduce((a, t) => a + t.lessons.length, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧑‍💻</Text>
          </View>
          <Text style={styles.name}>Young Coder</Text>
          <Text style={styles.level}>Level {Math.floor(progress.xp / 200) + 1}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>⚡ {progress.xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🔥 {progress.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>📚 {progress.completedLessons.length}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>

        {/* XP Progress to next level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>XP Progress</Text>
          <View style={styles.xpBar}>
            <View
              style={[
                styles.xpFill,
                { width: `${((progress.xp % 200) / 200) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.xpMeta}>{progress.xp % 200} / 200 XP to next level</Text>
        </View>

        {/* Track completion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Track Progress</Text>
          {tracks.map((track) => {
            const done = track.lessons.filter((l) =>
              progress.completedLessons.includes(l.id)
            ).length;
            const pct = Math.round((done / track.lessons.length) * 100);
            return (
              <View key={track.id} style={styles.trackRow}>
                <Text style={styles.trackEmoji}>{track.icon}</Text>
                <View style={styles.trackBarWrap}>
                  <Text style={styles.trackName}>{track.name}</Text>
                  <View style={styles.progressBg}>
                    <View
                      style={[styles.progressFill, { width: `${pct}%`, backgroundColor: track.color }]}
                    />
                  </View>
                </View>
                <Text style={[styles.trackPct, { color: track.color }]}>{pct}%</Text>
              </View>
            );
          })}
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgeGrid}>
            {badges.map((b) => {
              const earned = progress.badges.includes(b.id) || progress.completedLessons.length > 0 && b.id === 'first_lesson';
              return (
                <View key={b.id} style={[styles.badge, !earned && styles.badgeLocked]}>
                  <Text style={[styles.badgeEmoji, !earned && { opacity: 0.3 }]}>{b.emoji}</Text>
                  <Text style={[styles.badgeLabel, !earned && styles.badgeLabelLocked]}>{b.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: 10,
  },
  avatarEmoji: { fontSize: 44 },
  name: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  level: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  xpBar: {
    height: 10,
    backgroundColor: Colors.surface,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  xpFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 5 },
  xpMeta: { fontSize: 12, color: Colors.textMuted },
  trackRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  trackEmoji: { fontSize: 22 },
  trackBarWrap: { flex: 1 },
  trackName: { fontSize: 13, color: Colors.text, marginBottom: 4 },
  progressBg: { height: 6, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  trackPct: { fontSize: 12, fontWeight: 'bold', width: 36, textAlign: 'right' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    width: '45%',
  },
  badgeLocked: { opacity: 0.5 },
  badgeEmoji: { fontSize: 30, marginBottom: 6 },
  badgeLabel: { fontSize: 12, color: Colors.text, textAlign: 'center' },
  badgeLabelLocked: { color: Colors.textMuted },
});
