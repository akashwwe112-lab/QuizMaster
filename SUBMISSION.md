# QuizMaster Arena: Level Up Your Learning 🎮

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

---

## What I Built

I built **QuizMaster Arena**, an arcade-inspired study battle game that turns dry flashcards and stressful exam prep into an addictive, gamified 1v1 battle duel.

### Who I Built It For & The Problem
I built this for my close friend Alex, who has been preparing for tech certifications and university exams. Alex constantly struggled with:
- **Study Burnout & Procrastination**: Traditional flashcards feel like a chore, making it painful to study consistently.
- **Streak Anxiety**: Losing a multi-day streak after missing a single hectic day was demotivating.
- **Lack of Feedback**: Passive rereading leads to the illusion of competence without real active recall or time pressure.

**QuizMaster Arena** solves this by turning every study session into an arcade duel:
- **1v1 Battle Arena**: Players battle adaptive AI rivals (`NovaBot`, `Athena 🦉`, `CyberSam ⚡`, `Dr. Quantum 🧪`) where correct answers deal damage and errors cost health.
- **Daily Challenge & Streaks**: 5 curated high-yield questions every day with a 1.5x XP multiplier and fire animations.
- **Streak Aegis Shields**: An in-game shield item you can purchase in the armory that protects your streak if life gets in the way.
- **Study Deck Architect**: Create your own custom study decks or import/export flashcards as JSON to share with study partners.
- **Power-Up Armory**: Earn coins to buy **50/50 Eliminations**, **Time Freeze (+15s)**, and **2x XP Elixirs**.
- **Retro Arcade Synth**: Powered by native Web Audio API, generating retro chimes, clock ticks, and victory fanfares directly in the browser without external media assets.

---

## Demo

- **Local Preview**: Launch [`index.html`](index.html) in any modern web browser.
- **Controls**: Full keyboard accessibility — hit <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd>, or <kbd>4</kbd> to lock in answers rapidly!
- **Key Modes**:
  1. **1v1 Battle**: Choose your subject and opponent bot to enter combat.
  2. **Daily Challenge**: Complete today's 5-question mission to build your study flame.
  3. **Subject Quest & 3D Flashcards**: Flip cards to study explanations before entering the arena.
  4. **Survival Blitz**: Sudden death speedrun where one mistake ends your streak.

---

## Code

{% github akashwwe112-lab/QuizMaster %}

The complete source code is available on GitHub:
👉 **[GitHub Repository: akashwwe112-lab/QuizMaster](https://github.com/akashwwe112-lab/QuizMaster)**

The application is completely open-source, client-side, and offline-first:

```text
dev cllange/
├── index.html          # Responsive gaming HUD & layout
├── css/
│   └── styles.css      # Glassmorphism, 3D flip card animations, and neon styling
├── js/
│   ├── audio.js        # Procedural Web Audio API sound generator
│   ├── questions.js    # Multi-subject question banks & daily challenge generator
│   ├── storage.js      # LocalStorage manager, XP curves, ranks, and shop inventory
│   ├── game.js         # 1v1 combat duel logic, AI simulation, and blitz timers
│   └── ui.js           # Dynamic UI renderer, keyboard events, and canvas confetti
├── README.md           # Documentation & user manual
└── SUBMISSION.md       # Hackathon submission post
```

---

## How I Built It

QuizMaster Arena was built using an autonomous agentic pair-programming workflow:

1. **Architecture & Zero-Dependency Design**:
   - Engineered as an offline-first single page application (SPA) with vanilla JavaScript, modern CSS, and Tailwind CSS.
   - Designed to run cleanly without requiring `npm install`, build steps, or server backends, ensuring my friend can run it on any laptop or phone.

2. **Native Web Audio API Synthesis (`js/audio.js`)**:
   - Rather than relying on bulky audio files or fragile external CDN MP3 links that can fail offline, all sound effects (harmonious arpeggios for correct answers, buzzer thuds for mistakes, clock ticks, and triumphant brass fanfares) are procedurally synthesized in real time using the Web Audio API.

3. **Core Combat & Bot Simulation Engine (`js/game.js`)**:
   - Implemented an opponent bot system featuring varying reaction latency and accuracy curves, matching casual learners and hardcore speedrunners alike.
   - Integrated power-up logic (50/50 option pruning, timer freezes, double XP multiplier).

4. **Persistent Progression & Local Economy (`js/storage.js`)**:
   - Created a leveling system (Levels 1–50+ with rank titles from *Novice Scholar* to *Supreme Archmage*), coin rewards, and 10+ unlockable achievements.
   - Built a streak tracker with *Aegis Shield* mechanics that safely preserves progress in browser `localStorage`.

5. **Flashcard Deck Builder & 3D Flip Review (`js/ui.js`)**:
   - Implemented a custom deck builder with JSON export/import and a 3D perspective flip card study mode for pre-battle prep.

---

## Why Does Open Innovation Matter?

Open innovation and open-source development represent the true spirit of learning:
- **No Paywalls on Education**: Students and learners shouldn't be locked out of essential flashcard and study tools by monthly paywalls or subscription limits.
- **Offline & Private**: Educational tools shouldn't harvest personal data or require mandatory sign-ins. Because QuizMaster Arena is 100% client-side and open, all study data and custom notes stay private on the user's device.
- **Hackable & Adaptable**: Anyone can fork the repository, add their own subjects (medical exams, bar exams, vocabulary drills), customize audio frequencies, or plug in local AI models to automatically generate questions from class notes.

---

## My Agent Session

This project was built pair-programming with **Google Antigravity** using DeepMind agentic coding workflows. When Windows system assemblies prevented running local shell commands, the agent pivoted immediately to architect a fully self-contained, zero-dependency browser application with built-in Web Audio synthesis and local persistence.

---

## Prize Categories

- **Build for a Friend**
- **Education & Productivity**
- **Open Source Web Apps**
