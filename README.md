# QuizMaster Arena 🎮 — Gamified Study Game & Quiz Battle

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/akashwwe112-lab/QuizMaster)

**Repository**: [https://github.com/akashwwe112-lab/QuizMaster](https://github.com/akashwwe112-lab/QuizMaster)

**QuizMaster Arena** transforms study sessions, flashcards, and exam preparation into a gamified arcade battle experience. Earn XP, collect coins, unlock rare badges, maintain daily study streaks, and battle AI rivals or friends in real-time quiz duels.

---

## 🌟 Key Features

### 1. ⚔️ 1v1 Quiz Battle Arena
- **Real-time 1v1 duels**: Battle simulated AI rivals (`NovaBot`, `Athena 🦉`, `CyberSam ⚡`, `Dr. Quantum 🧪`) with varying accuracy and reaction speeds.
- **Dynamic HP & Score meters**: Correct answers deal damage to the opponent; incorrect answers cost you health!
- **Power-Ups in Combat**:
  - `50/50`: Eliminates two incorrect answers.
  - `Time Freeze`: Pauses time and grants +15 extra seconds on the clock.
  - `2x XP Elixir`: Doubles all XP earned during the match.

### 2. 🔥 Daily Challenges & Streaks
- **Curated 5-Question Daily Set**: Deterministically generated daily challenges.
- **Streak Multipliers**: Earn 1.5x bonus XP and extra coins.
- **Streak Shield Protection**: Purchase Aegis Shields from the shop to protect your streak from resetting if you miss a study day.

### 3. 📚 Subject Quests & 🎴 Flashcard Review
- **Rich Question Banks**:
  - 💻 **Computer Science**: Algorithms, data structures, Python, SQL, web architecture.
  - 🔬 **Science & Nature**: Physics, biology, chemistry, astronomy.
  - 📜 **World History**: Ancient civilisations, world events, milestones.
  - 📐 **Mathematics & Logic**: Algebra, calculus, probability, riddles.
  - 🌍 **World Geography**: Capitals, landmarks, topography.
- **3D Flip Flashcards**: Review questions with front/back flip animations before jumping into battles.

### 4. 🎴 Custom Deck Architect
- **Build Your Own Decks**: Create custom study decks for any class, exam, or language.
- **JSON Import / Export**: Share study decks with classmates or backup your decks.

### 5. ⚡ Survival Blitz (Sudden Death)
- Rapid-fire continuous questions with shrinking time limits.
- One wrong answer ends the run! Test your maximum streak.

### 6. 🏆 Progression, Economy & Badges
- **Levels & Ranks**: Progress from *Novice Scholar* to *Supreme Archmage*.
- **Coin Economy & Power-Up Shop**: Earn coins through correct answers, speed bonuses, and streak milestones to spend on power-ups.
- **10+ Achievements**: Unlock badges like *First Blood*, *Speed Demon*, *Inferno Master*, and *Sharpshooter*.
- **Customizable Profile**: Choose custom avatars (🧙‍♂️, 🦉, ⚡, 🚀, 👑, 🤖, etc.) and titles.

### 7. 🔊 Procedural Web Audio Engine & Confetti
- 100% self-contained audio using the browser's native **Web Audio API** (retro chimes, buzzers, victory fanfares, and ticking clocks).
- Canvas particle confetti animations on wins and level-ups.
- Zero external audio files or downloads required.

---

## 🚀 How to Play

1. **Launch the game**:
   - Double-click `index.html` in your file explorer, or open it in any modern browser (Chrome, Edge, Firefox, Safari).
2. **Keyboard Hotkeys**:
   - Press <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd>, or <kbd>4</kbd> during questions to select options instantly!
3. **Save Data**:
   - All progress (XP, levels, coins, streaks, inventory, and custom decks) is automatically persisted in browser `localStorage`.

---

## 📁 Project Structure

```text
dev cllange/
├── index.html          # Main application interface and HUD
├── css/
│   └── styles.css      # Custom animations, glassmorphism, flashcard flip 3D
├── js/
│   ├── audio.js        # Procedural Web Audio API sound synthesizer
│   ├── questions.js    # Built-in question banks and daily challenge generator
│   ├── storage.js      # LocalStorage manager, XP curve, leveling, shop inventory
│   ├── game.js         # Battle state machine, 1v1 AI engine, blitz mode, timers
│   └── ui.js           # DOM controller, modal dialogs, canvas confetti cannon
└── README.md           # Game manual and documentation
```
