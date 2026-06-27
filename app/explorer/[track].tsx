import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { explorerData, TagInfo, SequencerChallenge } from '../../data/explorer';
import { loadProgress, completeLesson, UserProgress, defaultProgress } from '../../constants/storage';

export function generateStaticParams() {
  return ['html', 'css', 'js', 'python', 'java', 'delphi'].map((track) => ({ track }));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExplorerScreen() {
  const { track } = useLocalSearchParams<{ track: string }>();
  const explorer = explorerData.find((e) => e.trackId === track);

  const [category, setCategory] = useState('All');
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  // Sequencer state
  const [seqVisible, setSeqVisible] = useState(false);
  const [challenge, setChallenge] = useState<SequencerChallenge | null>(null);
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [seqComplete, setSeqComplete] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  if (!explorer) return null;

  const filteredTags =
    category === 'All' ? explorer.tags : explorer.tags.filter((t) => t.category === category);

  function openSequencer(ch: SequencerChallenge) {
    setChallenge(ch);
    setPlaced([]);
    setAvailable(shuffle([...ch.tokens, ...ch.distractors]));
    setWrongIdx(null);
    setSeqComplete(false);
    setXpEarned(false);
    setSeqVisible(true);
  }

  function handleTokenTap(token: string, idx: number) {
    if (!challenge || seqComplete) return;
    const expectedNext = challenge.tokens[placed.length];
    if (token === expectedNext) {
      const newPlaced = [...placed, token];
      setAvailable((prev) => prev.filter((_, i) => i !== idx));
      setPlaced(newPlaced);
      if (newPlaced.length === challenge.tokens.length) {
        setSeqComplete(true);
        handleXpAward(challenge);
      }
    } else {
      // Shake the wrong token
      setWrongIdx(idx);
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start(() => setWrongIdx(null));
    }
  }

  async function handleXpAward(ch: SequencerChallenge) {
    if (progress.completedLessons.includes(ch.id)) {
      setXpEarned(false);
      return;
    }
    const updated = await completeLesson(ch.id, ch.xp, progress);
    setProgress(updated);
    setXpEarned(true);
  }

  function closeSequencer() {
    setSeqVisible(false);
    setChallenge(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Sequencer Modal */}
      <Modal visible={seqVisible} animationType="slide" transparent>
        <View style={styles.seqOverlay}>
          <View style={styles.seqSheet}>
            {/* Header */}
            <View style={styles.seqHeader}>
              <Text style={styles.seqTitle}>Snap Sequencer</Text>
              <Pressable onPress={closeSequencer} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            {challenge && (
              <>
                <View style={[styles.goalCard, { borderLeftColor: explorer.color }]}>
                  <Text style={styles.goalLabel}>GOAL</Text>
                  <Text style={styles.goalText}>{challenge.goal}</Text>
                  <Text style={styles.goalXp}>+{challenge.xp} XP</Text>
                </View>

                {/* Placed tokens */}
                <Text style={styles.seqSectionLabel}>Your sequence</Text>
                <View style={styles.placedRow}>
                  {placed.length === 0 ? (
                    <Text style={styles.placedEmpty}>Tap tokens below to build the sequence →</Text>
                  ) : (
                    placed.map((token, i) => (
                      <View key={i} style={[styles.placedToken, { backgroundColor: explorer.color + '33', borderColor: explorer.color }]}>
                        <Text style={[styles.placedTokenText, { color: explorer.color }]}>{token}</Text>
                      </View>
                    ))
                  )}
                </View>

                {/* Complete state */}
                {seqComplete ? (
                  <View style={styles.seqCompleteCard}>
                    <Text style={styles.seqCompleteEmoji}>🎉</Text>
                    <Text style={styles.seqCompleteTitle}>Nailed it!</Text>
                    <Text style={styles.seqCompleteSub}>
                      {xpEarned ? `+${challenge.xp} XP earned!` : 'Already completed — no XP this time.'}
                    </Text>
                    <View style={styles.seqBtnRow}>
                      {explorer.challenges.indexOf(challenge) < explorer.challenges.length - 1 && (
                        <Pressable
                          style={styles.seqSecondaryBtn}
                          onPress={() => openSequencer(explorer.challenges[explorer.challenges.indexOf(challenge) + 1])}
                        >
                          <Text style={styles.seqSecondaryBtnText}>Next Challenge →</Text>
                        </Pressable>
                      )}
                      <Pressable style={[styles.seqPrimaryBtn, { backgroundColor: explorer.color }]} onPress={closeSequencer}>
                        <Text style={styles.seqPrimaryBtnText}>Done ✓</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <>
                    {/* Available tokens */}
                    <Text style={styles.seqSectionLabel}>Available tokens — tap in the right order</Text>
                    <View style={styles.tokenPalette}>
                      {available.map((token, idx) => {
                        const isWrong = wrongIdx === idx;
                        return (
                          <Animated.View
                            key={`${token}-${idx}`}
                            style={isWrong ? { transform: [{ translateX: shakeAnim }] } : undefined}
                          >
                            <Pressable
                              style={[styles.token, isWrong && styles.tokenWrong]}
                              onPress={() => handleTokenTap(token, idx)}
                            >
                              <Text style={[styles.tokenText, isWrong && styles.tokenTextWrong]}>
                                {token}
                              </Text>
                            </Pressable>
                          </Animated.View>
                        );
                      })}
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Track header */}
        <View style={[styles.trackHeader, { backgroundColor: explorer.color + '22' }]}>
          <Text style={styles.trackIcon}>{explorer.icon}</Text>
          <View>
            <Text style={[styles.trackName, { color: explorer.color }]}>{explorer.trackName}</Text>
            <Text style={styles.trackSub}>{explorer.tags.length} tags · {explorer.challenges.length} challenges</Text>
          </View>
        </View>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
          {explorer.categories.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.filterChip, category === cat && { backgroundColor: explorer.color }]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.filterChipText, category === cat && { color: '#000' }]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Tag cards */}
        <Text style={styles.sectionTitle}>Reference</Text>
        {filteredTags.map((tag) => {
          const isExpanded = expandedTag === tag.tag;
          return (
            <Pressable
              key={tag.tag}
              style={[styles.tagCard, isExpanded && { borderColor: explorer.color }]}
              onPress={() => setExpandedTag(isExpanded ? null : tag.tag)}
            >
              <View style={styles.tagCardHeader}>
                <View style={styles.tagLeft}>
                  <Text style={[styles.tagSyntax, { color: explorer.color }]}>{tag.tag}</Text>
                  <Text style={styles.tagLabel}>{tag.label}</Text>
                </View>
                <View style={styles.tagRight}>
                  <View style={[styles.catBadge, { backgroundColor: explorer.color + '22' }]}>
                    <Text style={[styles.catBadgeText, { color: explorer.color }]}>{tag.category}</Text>
                  </View>
                  <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                </View>
              </View>

              {isExpanded && (
                <View style={styles.tagExpanded}>
                  <Text style={styles.tagDescription}>{tag.description}</Text>

                  {tag.pairsWith && (
                    <View style={styles.pairsRow}>
                      <Text style={styles.pairsLabel}>Pairs with </Text>
                      <View style={[styles.pairsTag, { backgroundColor: explorer.color + '22' }]}>
                        <Text style={[styles.pairsTagText, { color: explorer.color }]}>{tag.pairsWith}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.exampleBlock}>
                    <Text style={styles.exampleLabel}>EXAMPLE</Text>
                    <Text style={styles.exampleCode}>{tag.example}</Text>
                  </View>

                  <Pressable
                    style={[styles.practiceBtn, { backgroundColor: explorer.color }]}
                    onPress={() => openSequencer(explorer.challenges[0])}
                  >
                    <Text style={styles.practiceBtnText}>Practice →</Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Sequencer challenges */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Sequencer Challenges</Text>
        <Text style={styles.seqIntro}>Put the tokens in the correct order to build real code.</Text>
        {explorer.challenges.map((ch, i) => {
          const done = progress.completedLessons.includes(ch.id);
          return (
            <Pressable
              key={ch.id}
              style={[styles.challengeCard, done && styles.challengeCardDone]}
              onPress={() => openSequencer(ch)}
            >
              <View style={styles.challengeCardLeft}>
                <Text style={styles.challengeNum}>#{i + 1}</Text>
                <View>
                  <Text style={styles.challengeGoal}>{ch.goal}</Text>
                  <Text style={styles.challengeXp}>+{ch.xp} XP{done ? ' · ✓ Done' : ''}</Text>
                </View>
              </View>
              <Text style={[styles.challengeArrow, { color: explorer.color }]}>▶</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 60 },

  // Track header
  trackHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 16, padding: 18, marginBottom: 20 },
  trackIcon: { fontSize: 48 },
  trackName: { fontSize: 26, fontWeight: 'bold' },
  trackSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },

  // Category filter
  filterScroll: { marginBottom: 20 },
  filterRow: { flexDirection: 'row', gap: 8, paddingRight: 20 },
  filterChip: { backgroundColor: Colors.surface, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  filterChipText: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },

  // Tag cards
  tagCard: { backgroundColor: Colors.card, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
  tagCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tagLeft: { flex: 1 },
  tagRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagSyntax: { fontFamily: 'monospace', fontSize: 15, fontWeight: 'bold' },
  tagLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  catBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  catBadgeText: { fontSize: 11, fontWeight: '600' },
  chevron: { color: Colors.textMuted, fontSize: 12 },

  tagExpanded: { marginTop: 14, gap: 12 },
  tagDescription: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  pairsRow: { flexDirection: 'row', alignItems: 'center' },
  pairsLabel: { fontSize: 13, color: Colors.textMuted },
  pairsTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  pairsTagText: { fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold' },
  exampleBlock: { backgroundColor: Colors.surface, borderRadius: 10, padding: 14 },
  exampleLabel: { fontSize: 10, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1, marginBottom: 8 },
  exampleCode: { fontFamily: 'monospace', fontSize: 13, color: Colors.accent, lineHeight: 20 },
  practiceBtn: { borderRadius: 10, padding: 12, alignItems: 'center' },
  practiceBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },

  // Sequencer challenges list
  seqIntro: { fontSize: 13, color: Colors.textMuted, marginBottom: 12, marginTop: -6 },
  challengeCard: { backgroundColor: Colors.card, borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  challengeCardDone: { opacity: 0.6 },
  challengeCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  challengeNum: { fontSize: 20, fontWeight: 'bold', color: Colors.textMuted, width: 28 },
  challengeGoal: { fontSize: 14, color: Colors.text, fontWeight: '600', flex: 1, flexWrap: 'wrap' },
  challengeXp: { fontSize: 12, color: Colors.xp, marginTop: 2 },
  challengeArrow: { fontSize: 16, marginLeft: 8 },

  // Sequencer Modal
  seqOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  seqSheet: { backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  seqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seqTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  closeBtn: { backgroundColor: Colors.surface, borderRadius: 20, width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: Colors.textMuted, fontWeight: 'bold' },

  goalCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 3 },
  goalLabel: { fontSize: 10, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1, marginBottom: 4 },
  goalText: { fontSize: 15, color: Colors.text, fontWeight: '600', lineHeight: 22 },
  goalXp: { fontSize: 12, color: Colors.xp, marginTop: 4 },

  seqSectionLabel: { fontSize: 11, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  placedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minHeight: 44, marginBottom: 20, backgroundColor: Colors.surface, borderRadius: 12, padding: 10 },
  placedEmpty: { color: Colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  placedToken: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  placedTokenText: { fontFamily: 'monospace', fontSize: 13, fontWeight: '600' },

  tokenPalette: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20 },
  token: { backgroundColor: Colors.background, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Colors.surface },
  tokenWrong: { backgroundColor: Colors.error + '22', borderColor: Colors.error },
  tokenText: { fontFamily: 'monospace', fontSize: 13, color: Colors.text },
  tokenTextWrong: { color: Colors.error },

  // Complete state
  seqCompleteCard: { alignItems: 'center', gap: 8, paddingVertical: 20 },
  seqCompleteEmoji: { fontSize: 52 },
  seqCompleteTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  seqCompleteSub: { fontSize: 14, color: Colors.textMuted },
  seqBtnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  seqPrimaryBtn: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  seqPrimaryBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  seqSecondaryBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 14, alignItems: 'center' },
  seqSecondaryBtnText: { color: Colors.text, fontWeight: '600', fontSize: 15 },
});
