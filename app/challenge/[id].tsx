import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { challenges } from '../(tabs)/challenges';
import { loadProgress, completeLesson } from '../../constants/storage';

export function generateStaticParams() {
  return challenges.map((c) => ({ id: c.id }));
}

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const challenge = challenges.find((c) => c.id === id);

  const [code, setCode] = useState(challenge?.starterCode ?? '');
  const [result, setResult] = useState<'pass' | 'fail' | null>(null);
  const [showHint, setShowHint] = useState(false);

  if (!challenge) return null;

  function checkAnswer() {
    if (!challenge) return;
    const trimmed = code.trim().replace(/\s+/g, ' ');
    const solution = challenge.solution.trim().replace(/\s+/g, ' ');
    setResult(trimmed === solution ? 'pass' : 'fail');
  }

  async function handleComplete() {
    if (!challenge) return;
    const progress = await loadProgress();
    await completeLesson(challenge.id, challenge.xp, progress);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.emoji}>{challenge.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.meta}>{challenge.track} · +{challenge.xp} XP</Text>
          </View>
        </View>

        <View style={styles.descCard}>
          <Text style={styles.descLabel}>CHALLENGE</Text>
          <Text style={styles.desc}>{challenge.description}</Text>
        </View>

        <Text style={styles.editorLabel}>Your Code</Text>
        <TextInput
          style={styles.editor}
          value={code}
          onChangeText={setCode}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          placeholderTextColor={Colors.textMuted}
        />

        {showHint && (
          <View style={styles.hintCard}>
            <Text style={styles.hintText}>💡 {challenge.hint}</Text>
          </View>
        )}

        {result === null && (
          <View style={styles.btnRow}>
            <Pressable style={styles.secondaryBtn} onPress={() => setShowHint(!showHint)}>
              <Text style={styles.secondaryBtnText}>{showHint ? 'Hide Hint' : 'Hint 💡'}</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={checkAnswer}>
              <Text style={styles.primaryBtnText}>Submit ✓</Text>
            </Pressable>
          </View>
        )}

        {result === 'pass' && (
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>🎉</Text>
            <Text style={styles.resultTitle}>Challenge Complete!</Text>
            <Text style={styles.resultSub}>+{challenge.xp} XP earned!</Text>
            <Pressable style={styles.primaryBtn} onPress={handleComplete}>
              <Text style={styles.primaryBtnText}>Collect XP 🚀</Text>
            </Pressable>
          </View>
        )}

        {result === 'fail' && (
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>😅</Text>
            <Text style={styles.resultTitle}>Not quite!</Text>
            <Text style={styles.resultSub}>Compare your answer with the solution:</Text>
            <View style={styles.solutionBox}>
              <Text style={styles.solutionCode}>{challenge.solution}</Text>
            </View>
            <View style={styles.btnRow}>
              <Pressable style={styles.secondaryBtn} onPress={() => setResult(null)}>
                <Text style={styles.secondaryBtnText}>Try Again</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
                <Text style={styles.primaryBtnText}>Back</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  emoji: { fontSize: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  meta: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  descCard: { backgroundColor: Colors.card, borderRadius: 14, padding: 16, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: Colors.secondary },
  descLabel: { fontSize: 11, fontWeight: 'bold', color: Colors.secondary, letterSpacing: 1.5, marginBottom: 8 },
  desc: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  editorLabel: { fontSize: 13, color: Colors.textMuted, marginBottom: 8, fontWeight: '600' },
  editor: { backgroundColor: Colors.card, color: Colors.accent, fontFamily: 'monospace', fontSize: 13, padding: 16, borderRadius: 12, minHeight: 140, textAlignVertical: 'top', marginBottom: 16, borderWidth: 1, borderColor: Colors.surface, lineHeight: 20 },
  hintCard: { backgroundColor: Colors.surface, borderRadius: 10, padding: 14, marginBottom: 16 },
  hintText: { color: Colors.xp, fontSize: 14, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  primaryBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 16, alignItems: 'center' },
  secondaryBtnText: { color: Colors.text, fontWeight: '600', fontSize: 16 },
  resultCard: { backgroundColor: Colors.card, borderRadius: 16, padding: 24, alignItems: 'center', gap: 12, marginTop: 8 },
  resultEmoji: { fontSize: 52 },
  resultTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  resultSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  solutionBox: { backgroundColor: Colors.surface, borderRadius: 10, padding: 14, width: '100%' },
  solutionCode: { fontFamily: 'monospace', color: Colors.accent, fontSize: 13 },
});
