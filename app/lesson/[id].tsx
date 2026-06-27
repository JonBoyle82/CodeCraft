import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
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

function normalizeCode(code: string, track: string): string {
  if (track === 'html') {
    return code.replace(/\s+/g, ' ').trim().toLowerCase().replace(/'/g, '"');
  }
  if (track === 'css') {
    return code.replace(/\s+/g, ' ').trim().toLowerCase();
  }
  // JS, Python, Java, Delphi: trim each line and drop blank lines
  return code
    .split('\n')
    .map((l) => l.trim())
    .filter((l, i, arr) => l !== '' || (i > 0 && arr[i - 1] !== ''))
    .join('\n')
    .trim();
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
  const [levelUpTo, setLevelUpTo] = useState(0);

  // XP pop animation
  const xpPopY = useRef(new Animated.Value(0)).current;
  const xpPopOpacity = useRef(new Animated.Value(0)).current;

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

  const currentTrack = tracks.find((t) => t.id === lesson.track);
  const currentIdx = currentTrack?.lessons.findIndex((l) => l.id === lesson.id) ?? -1;
  const nextLesson =
    currentIdx >= 0 && currentIdx < (currentTrack?.lessons.length ?? 0) - 1
      ? currentTrack!.lessons[currentIdx + 1]
      : null;

  function triggerXpPop() {
    xpPopY.setValue(0);
    xpPopOpacity.setValue(1);
    Animated.parallel([
      Animated.timing(xpPopY, { toValue: -70, duration: 900, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(xpPopOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }

  function checkAnswer() {
    if (!lesson) return;
    const isCorrect = normalizeCode(code, lesson.track) === normalizeCode(lesson.challenge.solution, lesson.track);
    setCorrect(isCorrect);
    setPhase('result');
    if (isCorrect && !alreadyDone) triggerXpPop();
  }

  async function saveProgress(goNext: boolean) {
    if (!lesson) return;
    let updated = progress;
    if (!alreadyDone) {
      const oldLevel = Math.floor(progress.xp / 200) + 1;
      updated = await completeLesson(lesson.id, lesson.xp, progress, tracks);
      setProgress(updated);
      const newLevel = Math.floor(updated.xp / 200) + 1;
      if (newLevel > oldLevel) {
        setLevelUpTo(newLevel);
        return; // level-up modal handles navigation
      }
    }
    if (goNext && nextLesson) {
      router.replace({ pathname: '/lesson/[id]', params: { id: nextLesson.id } });
    } else {
      router.back();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Level-up celebration modal */}
      <Modal visible={levelUpTo > 0} transparent animationType="fade">
        <View style={styles.levelUpOverlay}>
          <View style={styles.levelUpCard}>
            <Text style={styles.levelUpEmoji}>🎊</Text>
            <Text style={styles.levelUpTitle}>LEVEL UP!</Text>
            <Text style={styles.levelUpLevel}>Level {levelUpTo}</Text>
            <Text style={styles.levelUpSub}>You're on fire! Keep coding!</Text>
            <Pressable
              style={styles.levelUpBtn}
              onPress={() => {
                setLevelUpTo(0);
                if (nextLesson) {
                  router.replace({ pathname: '/lesson/[id]', params: { id: nextLesson.id } });
                } else {
                  router.back();
                }
              }}
            >
              <Text style={styles.levelUpBtnText}>Keep Going 🚀</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Track badge */}
        <View style={[styles.trackBadge, { backgroundColor: (Colors.track as any)[lesson.track] + '33' }]}>
          <Text style={[styles.trackBadgeText, { color: (Colors.track as any)[lesson.track] }]}>
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
                  return <Text key={i} style={styles.bold}>{line.replace(/\*\*/g, '')}</Text>;
                }
                if (line.startsWith('`') && line.endsWith('`')) {
                  return <Text key={i} style={styles.inlineCode}>{line.replace(/`/g, '')}</Text>;
                }
                if (line.trim() === '') return <View key={i} style={{ height: 10 }} />;
                return <Text key={i} style={styles.contentText}>{line}</Text>;
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
              <Pressable style={styles.secondaryBtn} onPress={() => setShowHint(!showHint)}>
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
                {/* XP pop */}
                <Animated.Text
                  style={[
                    styles.xpPop,
                    { transform: [{ translateY: xpPopY }], opacity: xpPopOpacity },
                  ]}
                >
                  +{lesson.xp} XP
                </Animated.Text>
                <Text style={styles.resultEmoji}>🎉</Text>
                <Text style={styles.resultTitle}>Nailed it!</Text>
                <Text style={styles.resultSub}>
                  {alreadyDone ? 'Already completed — no XP this time.' : `+${lesson.xp} XP earned!`}
                </Text>
                <View style={styles.btnRow}>
                  {nextLesson ? (
                    <>
                      <Pressable style={styles.secondaryBtn} onPress={() => saveProgress(false)}>
                        <Text style={styles.secondaryBtnText}>Tracks</Text>
                      </Pressable>
                      <Pressable style={styles.primaryBtn} onPress={() => saveProgress(true)}>
                        <Text style={styles.primaryBtnText}>Next Lesson →</Text>
                      </Pressable>
                    </>
                  ) : (
                    <Pressable style={[styles.primaryBtn, { flex: 1 }]} onPress={() => saveProgress(false)}>
                      <Text style={styles.primaryBtnText}>Continue 🚀</Text>
                    </Pressable>
                  )}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.resultEmoji}>😅</Text>
                <Text style={styles.resultTitle}>Not quite!</Text>
                <Text style={styles.resultSub}>Compare your answer with the solution below:</Text>
                <View style={styles.solutionBox}>
                  <Text style={styles.solutionCode}>{lesson.challenge.solution}</Text>
                </View>
                <View style={styles.btnRow}>
                  <Pressable style={styles.secondaryBtn} onPress={() => setPhase('challenge')}>
                    <Text style={styles.secondaryBtnText}>Try Again</Text>
                  </Pressable>
                  <Pressable style={styles.primaryBtn} onPress={() => saveProgress(false)}>
                    <Text style={styles.primaryBtnText}>Back to Learn</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 60 },
  trackBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 12 },
  trackBadgeText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  lessonTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 20 },
  contentCard: { backgroundColor: Colors.card, borderRadius: 14, padding: 18, marginBottom: 24 },
  contentText: { fontSize: 15, color: Colors.text, lineHeight: 24 },
  bold: { fontSize: 15, color: Colors.text, fontWeight: 'bold', lineHeight: 24 },
  inlineCode: { fontFamily: 'monospace', fontSize: 13, color: Colors.accent, backgroundColor: Colors.surface, padding: 4, borderRadius: 4 },
  challengeCard: { backgroundColor: Colors.surface, borderRadius: 14, padding: 16, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  challengeLabel: { fontSize: 11, fontWeight: 'bold', color: Colors.primary, letterSpacing: 1.5, marginBottom: 8 },
  challengePrompt: { fontSize: 16, color: Colors.text, lineHeight: 24 },
  editorLabel: { fontSize: 13, color: Colors.textMuted, marginBottom: 8, fontWeight: '600' },
  editor: { backgroundColor: Colors.card, color: Colors.accent, fontFamily: 'monospace', fontSize: 14, padding: 16, borderRadius: 12, minHeight: 120, textAlignVertical: 'top', marginBottom: 16, borderWidth: 1, borderColor: Colors.surface, lineHeight: 22 },
  hintCard: { backgroundColor: Colors.surface, borderRadius: 10, padding: 14, marginBottom: 16 },
  hintText: { color: Colors.xp, fontSize: 14, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  primaryBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 16, alignItems: 'center' },
  secondaryBtnText: { color: Colors.text, fontWeight: '600', fontSize: 16 },
  resultCard: { backgroundColor: Colors.card, borderRadius: 16, padding: 24, alignItems: 'center', gap: 12 },
  resultEmoji: { fontSize: 56 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  resultSub: { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },
  solutionBox: { backgroundColor: Colors.surface, borderRadius: 10, padding: 14, width: '100%', marginVertical: 8 },
  solutionCode: { fontFamily: 'monospace', color: Colors.accent, fontSize: 14 },
  xpPop: { position: 'absolute', top: 10, fontSize: 22, fontWeight: 'bold', color: Colors.xp, zIndex: 10 },
  // Level-up modal
  levelUpOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  levelUpCard: { backgroundColor: Colors.card, borderRadius: 24, padding: 36, alignItems: 'center', gap: 12, borderWidth: 2, borderColor: Colors.xp, width: '100%' },
  levelUpEmoji: { fontSize: 72 },
  levelUpTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.xp, letterSpacing: 4 },
  levelUpLevel: { fontSize: 48, fontWeight: 'bold', color: Colors.text },
  levelUpSub: { fontSize: 16, color: Colors.textMuted, textAlign: 'center' },
  levelUpBtn: { marginTop: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center' },
  levelUpBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
