# Changelog

All notable changes to CodeCraft are documented here.

---

## [0.3.0] — 2026-06-27

### Added
- **Java track** (☕) — 10 lessons covering variables, methods, OOP, ArrayList, inheritance, and more
- **Delphi track** (🏆) — 10 lessons covering Pascal syntax, procedures, functions, records, arrays, and more
- **Builder tab** (🔨) — visual code block assembler with:
  - Tap-to-add code blocks across 4 categories: Structure, Media, Style, Interactive
  - Inline editing of any dropped block
  - Smart contextual suggestions ("what could go next")
  - Live HTML preview rendered in-browser via iframe
  - Clear all and remove individual blocks
- **Challenge detail screens** — each challenge now opens a full screen with:
  - Description, code editor, hint system, pass/fail result
  - XP awarded on completion and saved to progress
- **8 bonus challenges** across HTML, CSS, JS, Python, Java, and Delphi (FizzBuzz, Calculator, Grade Checker, Dark Mode Toggle, etc.)
- **Lesson type system** — 3 lesson types per track:
  - `learn` — read concept, write answer
  - `error` — find and fix the bug in provided code
  - `fill` — fill in the blanks to complete code

### Fixed
- **XP not updating** — Learn and Profile tabs now refresh progress on focus using `useFocusEffect`
- **Challenges not clickable** — replaced static cards with `Pressable` components and added navigation
- **Track cards not navigating** — replaced `TouchableOpacity` with `Pressable` across all screens for better web compatibility
- **Base path routing** — set `experiments.baseUrl: "/CodeCraft/"` so all tab and lesson navigation works correctly on GitHub Pages

### Changed
- All 4 original tracks (HTML, CSS, JS, Python) expanded from 3 lessons to 10 lessons each
- Total lessons: **60** (10 per track × 6 tracks)
- Tab bar updated to 4 tabs: Learn, Builder, Challenges, Profile

---

## [0.2.0] — 2026-06-27

### Added
- GitHub Pages deployment via GitHub Actions (`.github/workflows/deploy.yml`)
- Web export configuration (`web.output: static`, `experiments.baseUrl`)
- `react-native-web`, `react-dom`, `@expo/metro-runtime` for web support
- `generateStaticParams` on lesson screen for static route generation

### Fixed
- PowerShell execution policy blocking `npx` commands
- Missing `react-dom` dependency causing web export failure
- GitHub Pages environment protection rule blocking `master` branch deploys
- Base path 404 — added `publicPath` then migrated to `experiments.baseUrl`

---

## [0.1.0] — 2026-06-27

### Added
- Initial project scaffold using Expo SDK 56 + expo-router
- 3 tabs: Learn, Challenges, Profile
- 4 learning tracks: HTML (3 lessons), CSS (1), JavaScript (1), Python (1)
- Lesson flow: read concept → code challenge → pass/fail result with hint
- XP and streak system with AsyncStorage persistence
- Badge system on profile screen
- Per-track progress bars on Learn and Profile screens
- Dark theme design system (`constants/colors.ts`)
- MIT License and README

---

## Roadmap

- [ ] AI tutor hint system (Claude API integration)
- [ ] Syntax-highlighted code editor (CodeMirror or Monaco)
- [ ] 50 lessons per track
- [ ] Animated XP pop-ups and level-up celebrations
- [ ] Leaderboard (opt-in)
- [ ] User accounts and cloud sync
- [ ] Mobile app store release via EAS Build
- [ ] Offline support
