import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { tracks, Lesson } from '../../data/lessons';
import { loadProgress, completeLesson, UserProgress, defaultProgress } from '../../constants/storage';

type Phase = 'learn' | 'challenge' | 'result';

export function generateStaticParams() {
  return tracks.flatMap((t) => t.lessons.map((l) => ({ id: l.id })));
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [phase, setPhase] = useState<Phase>('learn');
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    const found = tracks.flatMap((t) => t.lessons).find((l) => l.id === id);
    if (found) {
      setLesson(found);
      setCode(found.challenge.starterCode);
    }
    loadProgress().then(setProgress);
  }, [id]);

  if (!lesson) return null;

  const alreadyDone = progress.completedLessons.includes(lesson.id);

  function checkAnswer() {
    if (!lesson) return;
    const trimmed = code.trim().replace(/\s+/g, ' ');
    const solution = lesson.challenge.solution.trim().replace(/\s+/g, ' ');
    const isCorrect = trimmed === solution;
    setCorrect(isCorrect);
    setPhase('result');
  }

  async function handleComplete() {
    if (!lesson) return;
    if (!alreadyDone) {
      const updated = await completeLesson(lesson.id, lesson.xp, progress);
      setProgress(updated);
    }
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Track badge */}
        <View style={[styles.trackBadge, { backgroundColor: Colors.track[lesson.track] + '33' }]}>
          <Text style={[styles.trackBadgeText, { color: Colors.track[lesson.track] }]}>
            {lesson.track.toUpperCase()} · {lesson.xp} XP
          </Text>
        </View>

        <Text style={styles.lessonTitle}>{lesson.title}</Text>

        {/* ── LEARN PHASE ── */}
        {phase === 'learn' && (
          <>
            <View style={styles.contentCard}>
              {lesson.content.split('\n').map((line, i) => {
                if (line.startsWith('```')) return null;
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <Text key={i} style={styles.bold}>
                      {line.replace(/\*\*/g, '')}
                    </Text>
                  );
                }
                if (line.startsWith('`') && line.endsWith('`')) {
                  return (
                    <Text key={i} style={styles.inlineCode}>
                      {line.replace(/`/g, '')}
                    </Text>
                  );
                }
                if (line.trim() === '') return <View key={i} style={{ height: 10 }} />;
                return (
                  <Text key={i} style={styles.contentText}>
                    {line}
                  </Text>
                );
              })}
            </View>

            <Pressable style={styles.primaryBtn} onPress={() => setPhase('challenge')}>
              <Text style={styles.primaryBtnText}>Try the Challenge ⚔️</Text>
            </Pressable>
          </>
        )}

        {/* ── CHALLENGE PHASE ── */}
        {phase === 'challenge' && (
          <>
            <View style={styles.challengeCard}>
              <Text style={styles.challengeLabel}>YOUR CHALLENGE</Text>
              <Text style={styles.challengePrompt}>{lesson.challenge.prompt}</Text>
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
                <Text style={styles.hintText}>💡 {lesson.challenge.hint}</Text>
              </View>
            )}

            <View style={styles.btnRow}>
              <Pressable
                style={styles.secondaryBtn}
                onPress={() => setShowHint(!showHint)}
              >
                <Text style={styles.secondaryBtnText}>{showHint ? 'Hide Hint' : 'Hint 💡'}</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={checkAnswer}>
                <Text style={styles.primaryBtnText}>Submit ✓</Text>
              </Pressable>
            </View>
          </>
        )}

        {/* ── RESULT PHASE ── */}
        {phase === 'result' && (
          <View style={styles.resultCard}>
            {correct ? (
              <>
                <Text style={styles.resultEmoji}>🎉</Text>
                <Text style={styles.resultTitle}>Nailed it!</Text>
                <Text style={styles.resultSub}>
                  {alreadyDone ? 'You already earned the XP for this one.' : `+${lesson.xp} XP earned!`}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.resultEmoji}>😅</Text>
                <Text style={styles.resultTitle}>Not quite!</Text>
                <Text style={styles.resultSub}>Compare your answer with the solution below:</Text>
                <View style={styles.solutionBox}>
                  <Text style={styles.solutionCode}>{lesson.challenge.solution}</Text>
                </View>
              </>
            )}

            <View style={styles.btnRow}>
              {!correct && (
                <Pressable style={styles.secondaryBtn} onPress={() => setPhase('challenge')}>
                  <Text style={styles.secondaryBtnText}>Try Again</Text>
                </Pressable>
              )}
              <Pressable style={styles.primaryBtn} onPress={handleComplete}>
                <Text style={styles.primaryBtnText}>{correct ? 'Continue 🚀' : 'Back to Learn'}</Text>
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
  trackBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  trackBadgeText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  lessonTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 20 },
  contentCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  contentText: { fontSize: 15, color: Colors.text, lineHeight: 24 },
  bold: { fontSize: 15, color: Colors.text, fontWeight: 'bold', lineHeight: 24 },
  inlineCode: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: Colors.accent,
    backgroundColor: Colors.surface,
    padding: 4,
    borderRadius: 4,
  },
  challengeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  challengeLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  challengePrompt: { fontSize: 16, color: Colors.text, lineHeight: 24 },
  editorLabel: { fontSize: 13, color: Colors.textMuted, marginBottom: 8, fontWeight: '600' },
  editor: {
    backgroundColor: Colors.card,
    color: Colors.accent,
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 16,
    borderRadius: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.surface,
    lineHeight: 22,
  },
  hintCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  hintText: { color: Colors.xp, fontSize: 14, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 12 },
  primaryBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryBtnText: { color: Colors.text, fontWeight: '600', fontSize: 16 },
  resultCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  resultEmoji: { fontSize: 56 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  resultSub: { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },
  solutionBox: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    width: '100%',
    marginVertical: 8,
  },
  solutionCode: { fontFamily: 'monospace', color: Colors.accent, fontSize: 14 },
});
