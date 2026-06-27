# CodeCraft 🚀

**A gamified coding education app for teens aged 12–16.**

CodeCraft teaches real programming skills through bite-sized lessons, interactive challenges, and an XP-based progression system — making learning to code feel like a game.

🌐 **Live demo:** https://jonboyle82.github.io/CodeCraft/

---

## Features

### Learning
- **6 Programming Tracks** — HTML, CSS, JavaScript, Python, Java, and Delphi
- **60 Lessons** — 10 per track, progressively harder
- **3 Lesson Types** per track:
  - 📖 **Learn** — read the concept, then write real code
  - 🐛 **Find the Bug** — spot and fix the deliberate mistake in code
  - 🧩 **Fill the Blank** — complete the missing parts of a code snippet
- **Instant feedback** — pass/fail result with hint system

### Gamification
- **XP system** — earn points per lesson and challenge, updates live
- **Daily streaks** — keep your coding habit alive
- **Level progression** — level up every 200 XP
- **Badge system** — unlock achievements as you progress
- **Profile dashboard** — track XP, level, streak, and per-track progress

### Code Builder 🔨
- Tap code blocks from 4 categories (Structure, Media, Style, Interactive) to assemble a web page
- Edit any block inline before previewing
- Smart suggestions tell you what could come next
- **Live HTML preview** rendered instantly in the browser

### Challenges ⚔️
- 8 bonus challenges across all 6 languages
- Includes FizzBuzz, Click Counter, Dark Mode Toggle, Java Calculator, Delphi Grade Checker, and more
- Full code editor with hint system and XP reward on completion

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 56) |
| Navigation | Expo Router v4 |
| Platform | Mobile (iOS & Android) + Web |
| Storage | AsyncStorage (local persistence) |
| Deployment | GitHub Pages (static web export) |
| Language | TypeScript |

---

## Learning Tracks

| Track | Icon | Lessons | Topics |
|-------|------|---------|--------|
| HTML | 🌐 | 10 | Tags, headings, links, images, forms, tables, semantic HTML |
| CSS | 🎨 | 10 | Selectors, box model, flexbox, grid, animations, media queries |
| JavaScript | ⚡ | 10 | Variables, functions, arrays, objects, DOM, events, fetch |
| Python | 🐍 | 10 | Print, variables, input, lists, loops, dicts, functions, files |
| Java | ☕ | 10 | Data types, OOP, methods, arrays, ArrayList, inheritance |
| Delphi | 🏆 | 10 | Pascal syntax, var, procedures, functions, records, strings |

---

## Project Structure

```
CodeCraft/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab bar (Learn, Builder, Challenges, Profile)
│   │   ├── index.tsx         # Learn screen — track selection + progress
│   │   ├── builder.tsx       # Code Builder — block assembler + live preview
│   │   ├── challenges.tsx    # Challenges list
│   │   └── profile.tsx       # User profile, stats, badges
│   ├── lesson/
│   │   └── [id].tsx          # Individual lesson screen
│   ├── challenge/
│   │   └── [id].tsx          # Individual challenge screen
│   └── _layout.tsx           # Root navigation layout
├── constants/
│   ├── colors.ts             # Design system colours
│   └── storage.ts            # AsyncStorage helpers + XP/progress logic
├── data/
│   └── lessons.ts            # All 60 lessons across 6 tracks
└── .github/
    └── workflows/
        └── deploy.yml        # GitHub Pages CI/CD deployment
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo Go app on your phone (iOS or Android)

### Run locally

```bash
git clone https://github.com/JonBoyle82/CodeCraft.git
cd CodeCraft
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with Expo Go, or press `w` to open in the browser.

### Build for web

```bash
npx expo export --platform web
```

---

## Roadmap

- [ ] AI tutor hint system (Claude API)
- [ ] Syntax-highlighted code editor
- [ ] 50 lessons per track
- [ ] Animated XP pop-ups and level-up celebrations
- [ ] Opt-in leaderboard
- [ ] User accounts and cloud sync
- [ ] Mobile app store release (EAS Build)

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a full version history.

---

## License

MIT © 2026 Jon Boyle — see [LICENSE](LICENSE) for details.
