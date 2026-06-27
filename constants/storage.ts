import AsyncStorage from '@react-native-async-storage/async-storage';

export type Badge = {
  id: string;
  emoji: string;
  label: string;
  description: string;
};

export const ALL_BADGES: Badge[] = [
  { id: 'first_lesson',   emoji: '🎉', label: 'First Step',      description: 'Complete your first lesson' },
  { id: 'coder',          emoji: '💻', label: 'Coder',            description: 'Complete 10 lessons' },
  { id: 'veteran',        emoji: '🏅', label: 'Veteran',          description: 'Complete 30 lessons' },
  { id: 'completionist',  emoji: '🌈', label: 'Completionist',    description: 'Complete all 60 lessons' },
  { id: 'streak_3',       emoji: '🔥', label: '3-Day Streak',     description: 'Code 3 days in a row' },
  { id: 'streak_7',       emoji: '🌟', label: 'Week Warrior',     description: 'Code 7 days in a row' },
  { id: 'xp_100',         emoji: '⚡', label: '100 XP Club',      description: 'Earn 100 XP' },
  { id: 'xp_500',         emoji: '💥', label: '500 XP Club',      description: 'Earn 500 XP' },
  { id: 'xp_1000',        emoji: '🚀', label: 'XP Legend',        description: 'Earn 1000 XP' },
  { id: 'html_master',    emoji: '🌐', label: 'HTML Master',      description: 'Finish all HTML lessons' },
  { id: 'css_master',     emoji: '🎨', label: 'CSS Artist',       description: 'Finish all CSS lessons' },
  { id: 'js_wizard',      emoji: '⚡', label: 'JS Wizard',        description: 'Finish all JS lessons' },
  { id: 'python_pro',     emoji: '🐍', label: 'Python Pro',       description: 'Finish all Python lessons' },
  { id: 'java_hero',      emoji: '☕', label: 'Java Hero',        description: 'Finish all Java lessons' },
  { id: 'delphi_legend',  emoji: '🏆', label: 'Delphi Legend',    description: 'Finish all Delphi lessons' },
  { id: 'bug_squasher',   emoji: '🐛', label: 'Bug Squasher',     description: 'Fix 5 bugs in error lessons' },
  { id: 'full_stack',     emoji: '🦸', label: 'Full Stack',       description: 'Complete all 6 tracks' },
];

export type UserProgress = {
  xp: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
  badges: string[];
  name: string;
  avatarEmoji: string;
};

const PROGRESS_KEY = 'codecraft_progress';

export const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  lastActive: '',
  completedLessons: [],
  badges: [],
  name: 'Coder',
  avatarEmoji: '🧑‍💻',
};

export async function loadProgress(): Promise<UserProgress> {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!data) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(data) };
  } catch {
    return defaultProgress;
  }
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function computeNewBadges(updated: UserProgress, allTracks: any[]): string[] {
  const earned = new Set(updated.badges);
  const newBadges: string[] = [];
  const done = updated.completedLessons;

  const award = (id: string) => {
    if (!earned.has(id)) newBadges.push(id);
  };

  if (done.length >= 1) award('first_lesson');
  if (done.length >= 10) award('coder');
  if (done.length >= 30) award('veteran');
  if (done.length >= 60) award('completionist');
  if (updated.streak >= 3) award('streak_3');
  if (updated.streak >= 7) award('streak_7');
  if (updated.xp >= 100) award('xp_100');
  if (updated.xp >= 500) award('xp_500');
  if (updated.xp >= 1000) award('xp_1000');

  if (allTracks.length > 0) {
    const allLessons = allTracks.flatMap((t: any) => t.lessons);
    const bugsDone = done.filter(id => allLessons.find((l: any) => l.id === id && l.type === 'error')).length;
    if (bugsDone >= 5) award('bug_squasher');

    const trackBadge: Record<string, string> = {
      html: 'html_master', css: 'css_master', js: 'js_wizard',
      python: 'python_pro', java: 'java_hero', delphi: 'delphi_legend',
    };
    let allComplete = true;
    for (const track of allTracks) {
      const complete = track.lessons.every((l: any) => done.includes(l.id));
      if (complete) award(trackBadge[track.id]);
      else allComplete = false;
    }
    if (allComplete && allTracks.length === 6) award('full_stack');
  }

  return newBadges;
}

export async function completeLesson(
  lessonId: string,
  xpReward: number,
  current: UserProgress,
  allTracks: any[] = []
): Promise<UserProgress> {
  if (current.completedLessons.includes(lessonId)) return current;

  const today = new Date().toDateString();
  const wasActiveYesterday =
    new Date(current.lastActive).toDateString() ===
    new Date(Date.now() - 86400000).toDateString();

  const updated: UserProgress = {
    ...current,
    xp: current.xp + xpReward,
    completedLessons: [...current.completedLessons, lessonId],
    lastActive: today,
    streak: wasActiveYesterday || current.lastActive === today ? current.streak + 1 : 1,
  };

  const newBadges = computeNewBadges(updated, allTracks);
  if (newBadges.length > 0) updated.badges = [...updated.badges, ...newBadges];

  await saveProgress(updated);
  return updated;
}
