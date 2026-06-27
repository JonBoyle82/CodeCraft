import { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  Pressable, TextInput, Modal,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/colors';
import { loadProgress, saveProgress, UserProgress, defaultProgress, ALL_BADGES } from '../../constants/storage';
import { tracks } from '../../data/lessons';

const AVATAR_OPTIONS = [
  '🧑‍💻', '👩‍💻', '🧑‍🎮', '🦸', '🧙', '🐱', '🦊', '🐶',
  '🐉', '🤖', '👾', '🦄', '🐸', '🐧', '🦋', '🎮',
];

export default function ProfileScreen() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProgress().then(setProgress);
    }, [])
  );

  const totalLessons = tracks.reduce((a, t) => a + t.lessons.length, 0);
  const level = Math.floor(progress.xp / 200) + 1;
  const xpIntoLevel = progress.xp % 200;

  async function saveName() {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    const updated = { ...progress, name: trimmed };
    await saveProgress(updated);
    setProgress(updated);
    setEditingName(false);
  }

  async function pickAvatar(emoji: string) {
    const updated = { ...progress, avatarEmoji: emoji };
    await saveProgress(updated);
    setProgress(updated);
    setShowAvatarPicker(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar picker modal */}
      <Modal visible={showAvatarPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Choose your avatar</Text>
            <View style={styles.emojiGrid}>
              {AVATAR_OPTIONS.map((emoji) => (
                <Pressable key={emoji} style={styles.emojiOption} onPress={() => pickAvatar(emoji)}>
                  <Text style={styles.emojiOptionText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.cancelBtn} onPress={() => setShowAvatarPicker(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <Pressable onPress={() => setShowAvatarPicker(true)} style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{progress.avatarEmoji}</Text>
            <View style={styles.editBadge}><Text style={styles.editBadgeText}>✏️</Text></View>
          </Pressable>

          {editingName ? (
            <View style={styles.nameEditRow}>
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
                maxLength={20}
                onSubmitEditing={saveName}
                returnKeyType="done"
              />
              <Pressable style={styles.saveNameBtn} onPress={saveName}>
                <Text style={styles.saveNameBtnText}>Save</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => { setNameInput(progress.name); setEditingName(true); }}>
              <Text style={styles.name}>{progress.name} ✏️</Text>
            </Pressable>
          )}
          <Text style={styles.level}>Level {level}</Text>
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

        {/* XP progress bar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>XP Progress</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${(xpIntoLevel / 200) * 100}%` as any }]} />
          </View>
          <Text style={styles.xpMeta}>{xpIntoLevel} / 200 XP to level {level + 1}</Text>
        </View>

        {/* Track progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Track Progress</Text>
          {tracks.map((track) => {
            const done = track.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
            const pct = Math.round((done / track.lessons.length) * 100);
            return (
              <View key={track.id} style={styles.trackRow}>
                <Text style={styles.trackEmoji}>{track.icon}</Text>
                <View style={styles.trackBarWrap}>
                  <Text style={styles.trackName}>{track.name}</Text>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: track.color }]} />
                  </View>
                </View>
                <Text style={[styles.trackPct, { color: track.color }]}>{pct}%</Text>
              </View>
            );
          })}
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Badges · {progress.badges.length}/{ALL_BADGES.length}
          </Text>
          <View style={styles.badgeGrid}>
            {ALL_BADGES.map((b) => {
              const earned = progress.badges.includes(b.id);
              return (
                <View key={b.id} style={[styles.badge, !earned && styles.badgeLocked]}>
                  <Text style={[styles.badgeEmoji, !earned && { opacity: 0.25 }]}>{b.emoji}</Text>
                  <Text style={[styles.badgeLabel, !earned && styles.badgeLabelLocked]}>{b.label}</Text>
                  {earned && <Text style={styles.badgeDesc}>{b.description}</Text>}
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
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Colors.primary, marginBottom: 10 },
  avatarEmoji: { fontSize: 44 },
  editBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: Colors.primary, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  editBadgeText: { fontSize: 10 },
  nameEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nameInput: { backgroundColor: Colors.surface, color: Colors.text, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, fontSize: 18, fontWeight: 'bold', minWidth: 140 },
  saveNameBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  saveNameBtnText: { color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  level: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: Colors.card, borderRadius: 12, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  xpBar: { height: 10, backgroundColor: Colors.surface, borderRadius: 5, overflow: 'hidden', marginBottom: 6 },
  xpFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 5 },
  xpMeta: { fontSize: 12, color: Colors.textMuted },
  trackRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  trackEmoji: { fontSize: 22 },
  trackBarWrap: { flex: 1 },
  trackName: { fontSize: 13, color: Colors.text, marginBottom: 4 },
  progressBg: { height: 6, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  trackPct: { fontSize: 12, fontWeight: 'bold', width: 36, textAlign: 'right' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badge: { backgroundColor: Colors.card, borderRadius: 12, padding: 12, alignItems: 'center', width: '30%' },
  badgeLocked: { opacity: 0.45 },
  badgeEmoji: { fontSize: 26, marginBottom: 4 },
  badgeLabel: { fontSize: 11, color: Colors.text, textAlign: 'center', fontWeight: '600' },
  badgeLabelLocked: { color: Colors.textMuted },
  badgeDesc: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  pickerCard: { backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  pickerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 16, textAlign: 'center' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 16 },
  emojiOption: { backgroundColor: Colors.surface, borderRadius: 12, width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
  emojiOptionText: { fontSize: 28 },
  cancelBtn: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, alignItems: 'center' },
  cancelBtnText: { color: Colors.text, fontWeight: '600', fontSize: 16 },
});
