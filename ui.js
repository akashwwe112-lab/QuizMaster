// UI Controller, DOM renderer, and Event Handlers

// Standalone High-Performance Canvas Confetti Particle System
const ConfettiCannon = {
  canvas: null,
  ctx: null,
  particles: [],
  animId: null,

  init() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'confetti-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9999';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  },

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },

  burst(count = 70) {
    this.init();
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() * 200 - 100),
        y: this.canvas.height / 2 + (Math.random() * 100 - 50),
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 22,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (!this.animId) {
      this.animate();
    }
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5; // gravity
      p.rotation += p.rotSpeed;
      p.opacity -= 0.012;

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();

      if (p.opacity <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
    }
  }
};

// UI Manager Class
class UIManager {
  constructor() {
    this.currentView = 'arena';
    this.initElements();
    this.attachEventListeners();
    this.updateHUD();
    this.renderCurrentView();
  }

  initElements() {
    // Top HUD
    this.hudLevel = document.getElementById('hud-level');
    this.hudRankTitle = document.getElementById('hud-rank-title');
    this.hudXpText = document.getElementById('hud-xp-text');
    this.hudXpBar = document.getElementById('hud-xp-bar');
    this.hudCoins = document.getElementById('hud-coins');
    this.hudStreak = document.getElementById('hud-streak');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');

    // Main views container
    this.viewContainer = document.getElementById('main-content-view');
  }

  attachEventListeners() {
    // Tab switching
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Sound toggle
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const isEnabled = sounds.toggleSound();
        this.soundToggleBtn.innerHTML = isEnabled ? '🔊' : '🔇';
      });
    }

    // Keyboard shortcuts for answering (keys 1-4)
    window.addEventListener('keydown', (e) => {
      if (gameEngine.mode && !gameEngine.hasAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1;
          const btns = document.querySelectorAll('.quiz-option-btn');
          if (btns[idx] && !btns[idx].disabled) {
            btns[idx].click();
          }
        }
      }
    });
  }

  updateHUD() {
    const s = storage.state;
    if (this.hudLevel) this.hudLevel.innerText = `Lv. ${s.level}`;
    if (this.hudRankTitle) this.hudRankTitle.innerText = s.title;

    const neededXp = storage.getXpNeededForLevel(s.level);
    const xpPercent = Math.min(100, Math.round((s.xp / neededXp) * 100));

    if (this.hudXpText) this.hudXpText.innerText = `${s.xp} / ${neededXp} XP`;
    if (this.hudXpBar) this.hudXpBar.style.width = `${xpPercent}%`;

    if (this.hudCoins) this.hudCoins.innerText = s.coins;
    if (this.hudStreak) this.hudStreak.innerText = s.streak;
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Highlight active nav tab
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('bg-indigo-600/30', 'border-indigo-500', 'text-white');
        btn.classList.remove('text-gray-400', 'border-transparent');
      } else {
        btn.classList.remove('bg-indigo-600/30', 'border-indigo-500', 'text-white');
        btn.classList.add('text-gray-400', 'border-transparent');
      }
    });

    this.renderCurrentView();
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'arena':
        this.renderArenaLobby();
        break;
      case 'daily':
        this.renderDailyChallengeLobby();
        break;
      case 'solo':
        this.renderSoloQuestLobby();
        break;
      case 'blitz':
        this.renderBlitzLobby();
        break;
      case 'decks':
        this.renderDecksView();
        break;
      case 'shop':
        this.renderShopView();
        break;
      case 'leaderboard':
        this.renderLeaderboardView();
        break;
      case 'profile':
        this.renderProfileView();
        break;
      default:
        this.renderArenaLobby();
    }
  }

  // --- ARENA LOBBY ---
  renderArenaLobby() {
    const categories = QuestionManager.getAllCategories();
    this.viewContainer.innerHTML = `
      <div class="space-y-8 animate-bounce-in max-w-5xl mx-auto">
        <div class="relative overflow-hidden rounded-3xl p-8 glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="space-y-3 text-center md:text-left">
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                PvP Duel Arena
              </span>
              <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">1v1 Quiz Battle</h1>
              <p class="text-gray-300 max-w-xl text-sm md:text-base">
                Challenge skilled AI rivals or study duel in real-time. Answer faster, unleash power-ups, deplete your opponent's HP, and claim glorious XP & coin bounties!
              </p>
            </div>
            <div class="flex items-center gap-4 bg-gray-900/60 p-4 rounded-2xl border border-white/5">
              <div class="text-center">
                <div class="text-3xl">⚔️</div>
                <div class="text-xs text-gray-400 mt-1">Wins</div>
                <div class="font-bold text-emerald-400 text-lg">${storage.state.stats.battlesWon}</div>
              </div>
              <div class="w-px h-10 bg-gray-800"></div>
              <div class="text-center">
                <div class="text-3xl">💀</div>
                <div class="text-xs text-gray-400 mt-1">Losses</div>
                <div class="font-bold text-rose-400 text-lg">${storage.state.stats.battlesLost}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Opponent Selection -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span>Choose Your Opponent</span>
            </h2>
            <span class="text-xs text-gray-400">Scaling AI intelligence & speed</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="bot-selection-grid">
            ${BOT_OPPONENTS.map((bot, idx) => `
              <div class="glass-card rounded-2xl p-5 cursor-pointer relative border-2 ${idx === 1 ? 'border-indigo-500 bg-indigo-950/20' : 'border-transparent'} hover:border-indigo-400 transition"
                   onclick="ui.selectBot(${idx})">
                <div class="text-4xl mb-3">${bot.avatar}</div>
                <h3 class="font-bold text-white text-lg">${bot.name}</h3>
                <p class="text-xs text-indigo-400 font-medium mb-3">${bot.title}</p>
                <div class="space-y-2 text-xs text-gray-400">
                  <div class="flex justify-between">
                    <span>Accuracy:</span>
                    <span class="text-emerald-400 font-semibold">${Math.round(bot.accuracy * 100)}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Speed:</span>
                    <span class="text-yellow-400 font-semibold">${bot.minSpeed}-${bot.maxSpeed}s</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Subject Selection & Battle Start -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-white">Select Subject Arena</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            ${categories.map(c => `
              <button onclick="ui.startBattleWithCategory('${c.id}')"
                      class="flex items-center gap-3 p-4 rounded-xl glass-card text-left hover:border-indigo-500 group transition">
                <span class="text-3xl group-hover:scale-110 transition transform">${c.icon}</span>
                <div>
                  <div class="font-bold text-white text-sm group-hover:text-indigo-300 transition">${c.name}</div>
                  <div class="text-xs text-gray-400 line-clamp-1">${c.desc}</div>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    this.selectedBotIdx = 1;
  }

  selectBot(idx) {
    this.selectedBotIdx = idx;
    sounds.playClick();
    const cards = document.querySelectorAll('#bot-selection-grid > div');
    cards.forEach((c, i) => {
      if (i === idx) {
        c.classList.add('border-indigo-500', 'bg-indigo-950/20');
        c.classList.remove('border-transparent');
      } else {
        c.classList.remove('border-indigo-500', 'bg-indigo-950/20');
        c.classList.add('border-transparent');
      }
    });
  }

  startBattleWithCategory(catId) {
    this.renderBattleScreen();
    gameEngine.startBattle(catId, this.selectedBotIdx || 1);
  }

  // --- DAILY CHALLENGE LOBBY ---
  renderDailyChallengeLobby() {
    const today = new Date().toISOString().slice(0, 10);
    const completedToday = storage.state.lastStreakDate === today && storage.state.stats.dailyChallengesCompleted > 0;

    this.viewContainer.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-8 animate-bounce-in">
        <div class="text-center space-y-3">
          <div class="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-flame">
            <span class="text-5xl">🔥</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-white">Daily Study Challenge</h1>
          <p class="text-gray-300 max-w-lg mx-auto text-sm md:text-base">
            Solve 5 curated high-yield questions every day to ignite and preserve your study streak, earning 1.5x bonus XP and extra coins!
          </p>
        </div>

        <div class="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-6">
          <div class="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <div class="text-xs text-amber-400 font-semibold uppercase tracking-wider">Current Streak</div>
              <div class="text-3xl font-black text-white flex items-center gap-2">
                <span>${storage.state.streak} Days</span>
                <span class="text-xl">🔥</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Streak Shields</div>
              <div class="text-2xl font-bold text-sky-400 flex items-center justify-end gap-1">
                <span>${storage.state.streakShields || 0}</span>
                <span>🛡️</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-900/60 p-4 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-3xl">🎁</span>
              <div>
                <div class="font-bold text-white text-sm">Today's Daily Bounty</div>
                <div class="text-xs text-gray-400">+150 XP • +75 Coins • Streak Fire Upgrade</div>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${completedToday ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
              ${completedToday ? '✓ Completed Today' : 'Ready to Play'}
            </span>
          </div>

          <button onclick="ui.startDaily()"
                  class="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:from-amber-600 hover:to-rose-700 shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5 text-lg flex items-center justify-center gap-2">
            <span>⚡ Enter Daily Challenge</span>
          </button>
        </div>
      </div>
    `;
  }

  startDaily() {
    this.renderBattleScreen();
    gameEngine.startDailyChallenge();
  }

  // --- SOLO QUEST LOBBY ---
  renderSoloQuestLobby() {
    const categories = QuestionManager.getAllCategories().filter(c => c.id !== 'all');
    this.viewContainer.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8 animate-bounce-in">
        <div class="text-center space-y-2">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Study Quest
          </span>
          <h1 class="text-3xl md:text-4xl font-extrabold text-white">Subject Mastery Quest</h1>
          <p class="text-gray-300 text-sm max-w-lg mx-auto">
            Hone your knowledge in specific subjects without competitive pressure. Earn XP and coins for every verified answer.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${categories.map(c => `
            <div class="glass-panel p-6 rounded-2xl border border-white/5 hover:border-indigo-500/40 transition group flex flex-col justify-between space-y-4">
              <div class="flex items-start gap-4">
                <span class="text-4xl group-hover:scale-110 transition transform">${c.icon}</span>
                <div>
                  <h3 class="font-bold text-white text-lg group-hover:text-indigo-300 transition">${c.name}</h3>
                  <p class="text-xs text-gray-400 mt-1">${c.desc}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button onclick="ui.startSolo('${c.id}')"
                        class="flex-1 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition">
                  🎯 Quiz Mode
                </button>
                <button onclick="ui.startFlashcards('${c.id}')"
                        class="px-4 py-2.5 rounded-xl font-bold text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 transition">
                  🎴 Flashcards
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  startSolo(catId) {
    this.renderBattleScreen();
    gameEngine.startSoloQuest(catId);
  }

  startFlashcards(catId) {
    const questions = QuestionManager.getQuestionsByCategory(catId);
    this.renderFlashcardViewer(questions, catId);
  }

  // --- FLASHCARD VIEWER ---
  renderFlashcardViewer(questions, catId) {
    let index = 0;
    const renderCard = () => {
      const q = questions[index];
      this.viewContainer.innerHTML = `
        <div class="max-w-xl mx-auto space-y-6 animate-bounce-in">
          <div class="flex items-center justify-between">
            <button onclick="ui.renderSoloQuestLobby()" class="text-xs text-gray-400 hover:text-white flex items-center gap-1">
              ← Back to Solo Quest
            </button>
            <span class="text-xs font-mono text-indigo-400 font-bold">Card ${index + 1} of ${questions.length}</span>
          </div>

          <div id="flashcard" class="w-full h-80 perspective-1000 cursor-pointer" onclick="this.classList.toggle('flashcard-flipped')">
            <div class="flashcard-inner rounded-3xl shadow-2xl">
              <!-- Front -->
              <div class="flashcard-front glass-panel rounded-3xl p-8 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/70 to-slate-900/80">
                <span class="text-xs text-indigo-400 uppercase tracking-widest font-bold mb-4">Question (Click to flip)</span>
                <p class="text-xl md:text-2xl font-bold text-white text-center">${q.question}</p>
                <div class="mt-8 text-xs text-gray-400 flex items-center gap-2">
                  <span>🔄 Click to reveal answer & explanation</span>
                </div>
              </div>
              <!-- Back -->
              <div class="flashcard-back glass-panel rounded-3xl p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 to-slate-900/80">
                <span class="text-xs text-emerald-400 uppercase tracking-widest font-bold mb-2">Correct Answer</span>
                <p class="text-xl font-black text-emerald-300 mb-4">${q.options[q.answer]}</p>
                <p class="text-sm text-gray-300 text-center bg-gray-900/60 p-4 rounded-xl border border-white/5">${q.explanation}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button id="prev-card-btn" class="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition">
              ← Previous
            </button>
            <button id="next-card-btn" class="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition">
              Next Card →
            </button>
          </div>
        </div>
      `;

      document.getElementById('prev-card-btn').onclick = () => {
        sounds.playClick();
        if (index > 0) {
          index--;
          renderCard();
        }
      };
      document.getElementById('next-card-btn').onclick = () => {
        sounds.playClick();
        if (index < questions.length - 1) {
          index++;
          renderCard();
        }
      };
    };

    renderCard();
  }

  // --- BLITZ MODE LOBBY ---
  renderBlitzLobby() {
    this.viewContainer.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-8 animate-bounce-in text-center">
        <div class="inline-flex p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <span class="text-5xl">⚡</span>
        </div>
        <div class="space-y-2">
          <h1 class="text-3xl md:text-5xl font-black text-white">Survival Blitz</h1>
          <p class="text-gray-300 text-sm md:text-base max-w-md mx-auto">
            Sudden death high-speed quiz arena. Time gets tighter with every correct answer. One single mistake and the run ends!
          </p>
        </div>

        <div class="glass-panel p-6 rounded-3xl border border-rose-500/20 max-w-md mx-auto">
          <div class="text-xs text-rose-400 font-bold uppercase tracking-wider mb-1">Personal Best Blitz Streak</div>
          <div class="text-4xl font-black text-white font-mono">${gameEngine.blitzBest || 0} 🔥</div>
        </div>

        <button onclick="ui.startBlitz()"
                class="px-10 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 shadow-xl shadow-rose-600/30 transition transform hover:-translate-y-0.5 text-lg">
          🔥 Launch Sudden Death
        </button>
      </div>
    `;
  }

  startBlitz() {
    this.renderBattleScreen();
    gameEngine.startSurvivalBlitz();
  }

  // --- ACTIVE IN-GAME BATTLE SCREEN ---
  renderBattleScreen() {
    const isBattle = gameEngine.mode === 'battle';

    this.viewContainer.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-6 animate-bounce-in">
        <!-- Battle Top Header -->
        <div class="glass-panel p-4 md:p-6 rounded-3xl border border-white/10 space-y-4">
          <div class="flex items-center justify-between">
            <!-- Player Info -->
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500 flex items-center justify-center text-2xl">
                ${storage.state.avatar}
              </div>
              <div>
                <div class="font-bold text-white text-sm flex items-center gap-2">
                  <span>${storage.state.username}</span>
                  <span class="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">You</span>
                </div>
                <div class="text-xs text-indigo-400 font-medium">${storage.state.title}</div>
              </div>
            </div>

            <!-- VS Badge -->
            <div class="font-black text-xl text-gray-500 font-mono tracking-widest px-3 py-1 bg-gray-900/80 rounded-xl border border-white/5">
              ${isBattle ? 'VS' : (gameEngine.mode === 'blitz' ? 'BLITZ' : 'QUIZ')}
            </div>

            <!-- Opponent Info if 1v1 -->
            ${isBattle && gameEngine.opponent ? `
              <div class="flex items-center gap-3 flex-row-reverse text-right">
                <div class="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500 flex items-center justify-center text-2xl">
                  ${gameEngine.opponent.avatar}
                </div>
                <div>
                  <div class="font-bold text-white text-sm">${gameEngine.opponent.name}</div>
                  <div class="text-xs text-rose-400 font-medium" id="bot-status-text">${gameEngine.opponent.title}</div>
                </div>
              </div>
            ` : `
              <div class="text-right">
                <div class="text-xs text-gray-400">Score</div>
                <div class="font-black text-white text-xl" id="solo-score-display">${gameEngine.sessionCorrect} / ${gameEngine.questions.length || 5}</div>
              </div>
            `}
          </div>

          <!-- Health / Score Progress Bars for 1v1 -->
          ${isBattle ? `
            <div class="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div class="flex justify-between text-xs font-mono font-bold mb-1">
                  <span class="text-emerald-400">HP: <span id="player-hp-text">100</span>%</span>
                  <span class="text-gray-400" id="player-score-text">0 PTS</span>
                </div>
                <div class="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div id="player-hp-bar" class="h-full bg-emerald-500 progress-bar-smooth" style="width: 100%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-mono font-bold mb-1">
                  <span class="text-gray-400" id="opp-score-text">0 PTS</span>
                  <span class="text-rose-400">HP: <span id="opp-hp-text">100</span>%</span>
                </div>
                <div class="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div id="opp-hp-bar" class="h-full bg-rose-500 progress-bar-smooth ml-auto" style="width: 100%"></div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Countdown Timer Bar -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-mono font-semibold text-gray-400">
              <span id="question-progress-text">Question 1 of 5</span>
              <span id="timer-text" class="text-amber-400 font-bold">15s</span>
            </div>
            <div class="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
              <div id="round-timer-bar" class="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-1000 ease-linear" style="width: 100%"></div>
            </div>
          </div>
        </div>

        <!-- Question Card -->
        <div id="question-card" class="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
          <div class="flex items-center justify-between">
            <span id="question-category-badge" class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              General
            </span>
            <div id="double-xp-badge" class="hidden px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
              ⚡ 2x XP ACTIVE
            </div>
          </div>

          <h2 id="active-question-text" class="text-xl md:text-2xl font-bold text-white leading-relaxed">
            Loading question...
          </h2>

          <!-- Options Grid -->
          <div id="options-container" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <!-- Rendered dynamically -->
          </div>

          <!-- Explanation Container (Appears after answer) -->
          <div id="explanation-box" class="hidden p-4 rounded-2xl bg-gray-900/80 border border-white/10 space-y-1 text-sm">
            <div class="font-bold text-indigo-300 flex items-center gap-1.5">
              <span>💡 Explanation</span>
            </div>
            <p id="explanation-text" class="text-gray-300 text-xs md:text-sm leading-relaxed"></p>
          </div>
        </div>

        <!-- In-Game Power-Ups HUD -->
        <div class="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/5">
          <div class="text-xs text-gray-400 font-medium">Power-Ups:</div>
          <div class="flex items-center gap-2">
            <button id="powerup-5050" onclick="gameEngine.useFiftyFifty()"
                    class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 transition">
              <span>✂️ 50/50</span>
              <span class="px-1.5 py-0.2 bg-indigo-600 rounded-md text-[10px]">${storage.state.inventory.fiftyFifty || 0}</span>
            </button>
            <button id="powerup-freeze" onclick="gameEngine.useTimeFreeze()"
                    class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 transition">
              <span>⏳ Freeze</span>
              <span class="px-1.5 py-0.2 bg-indigo-600 rounded-md text-[10px]">${storage.state.inventory.freezeTime || 0}</span>
            </button>
            <button id="powerup-double" onclick="gameEngine.useDoubleXp()"
                    class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 transition">
              <span>🧪 2x XP</span>
              <span class="px-1.5 py-0.2 bg-indigo-600 rounded-md text-[10px]">${storage.state.inventory.doubleXp || 0}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- SHOP VIEW ---
  renderShopView() {
    this.viewContainer.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8 animate-bounce-in">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 class="text-3xl font-black text-white flex items-center gap-3">
              <span>Power-Up Armory</span>
              <span class="text-2xl">🛍️</span>
            </h1>
            <p class="text-gray-400 text-sm mt-1">Upgrade your duel arsenal and protect your daily streaks with earned coins.</p>
          </div>
          <div class="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-lg">
            <span>🪙 ${storage.state.coins}</span>
            <span class="text-xs text-amber-300 font-semibold uppercase tracking-wider">Coins</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${SHOP_ITEMS.map(item => `
            <div class="glass-panel p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition flex flex-col justify-between space-y-4">
              <div class="flex items-start gap-4">
                <span class="text-4xl p-3 bg-gray-800/80 rounded-2xl border border-white/10">${item.icon}</span>
                <div class="space-y-1">
                  <h3 class="font-bold text-white text-lg">${item.name}</h3>
                  <p class="text-xs text-gray-400 leading-relaxed">${item.desc}</p>
                </div>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-gray-800/60">
                <div class="font-black text-amber-400 font-mono text-base">🪙 ${item.price}</div>
                <button onclick="ui.purchaseItem('${item.id}')"
                        class="px-4 py-2 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-gray-950 transition transform hover:-translate-y-0.5">
                  Purchase
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  purchaseItem(itemId) {
    const result = storage.buyItem(itemId);
    if (result.success) {
      sounds.playPowerup();
      this.updateHUD();
      this.renderShopView();
      alert(`Success: ${result.msg}`);
    } else {
      sounds.playWrong();
      alert(`Error: ${result.msg}`);
    }
  }

  // --- LEADERBOARDS ---
  renderLeaderboardView() {
    const s = storage.state;
    // Simulated live competitive rivals
    const rivals = [
      { rank: 1, name: 'QuantumMaster', avatar: '👑', title: 'Grandmaster', score: 9850, level: 32 },
      { rank: 2, name: 'CyberSamurai', avatar: '⚡', title: 'Archmage', score: 8420, level: 27 },
      { rank: 3, name: 'SophiaBrain', avatar: '🦉', title: 'Master Tactician', score: 7190, level: 21 },
      { rank: 4, name: s.username, avatar: s.avatar, title: s.title, score: Math.max(1200, (s.stats.battlesWon * 250) + (s.stats.correctAnswers * 30)), level: s.level, isYou: true },
      { rank: 5, name: 'CodeNinja_42', avatar: '💻', title: 'Erudite Scholar', score: 3200, level: 12 },
      { rank: 6, name: 'AlexTheLearner', avatar: '🚀', title: 'Novice Scholar', score: 1850, level: 7 }
    ].sort((a, b) => b.score - a.score).map((r, i) => ({ ...r, rank: i + 1 }));

    this.viewContainer.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-6 animate-bounce-in">
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-black text-white flex items-center justify-center gap-2">
            <span>Global Arena Rankings</span>
            <span>🏆</span>
          </h1>
          <p class="text-gray-400 text-xs md:text-sm">Compete for the weekly championship podium.</p>
        </div>

        <div class="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div class="divide-y divide-gray-800">
            ${rivals.map(r => `
              <div class="p-4 flex items-center justify-between ${r.isYou ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : 'hover:bg-gray-800/30'} transition">
                <div class="flex items-center gap-4">
                  <div class="w-8 text-center font-black font-mono ${r.rank === 1 ? 'text-amber-400 text-xl' : (r.rank === 2 ? 'text-gray-300 text-lg' : (r.rank === 3 ? 'text-amber-600 text-lg' : 'text-gray-500'))}">
                    ${r.rank === 1 ? '🥇' : (r.rank === 2 ? '🥈' : (r.rank === 3 ? '🥉' : `#${r.rank}`))}
                  </div>
                  <div class="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl">
                    ${r.avatar}
                  </div>
                  <div>
                    <div class="font-bold text-white text-sm flex items-center gap-2">
                      <span>${r.name}</span>
                      ${r.isYou ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500 text-white font-bold">YOU</span>' : ''}
                    </div>
                    <div class="text-xs text-gray-400">${r.title} • Lv. ${r.level}</div>
                  </div>
                </div>
                <div class="font-mono font-black text-white text-sm md:text-base">
                  ${r.score.toLocaleString()} <span class="text-xs text-indigo-400 font-semibold">PTS</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- CUSTOM DECKS & BUILDER ---
  renderDecksView() {
    const customDecks = storage.getCustomDecks();

    this.viewContainer.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8 animate-bounce-in">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 class="text-3xl font-black text-white flex items-center gap-2">
              <span>Deck Architect & Study Sets</span>
              <span>🎴</span>
            </h1>
            <p class="text-gray-400 text-sm mt-1">Create your own quiz questions, import exam flashcards, or export decks.</p>
          </div>
          <div class="flex gap-2">
            <button onclick="ui.showCreateDeckModal()"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5">
              <span>+ Create Deck</span>
            </button>
            <button onclick="ui.importDeckPrompt()"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 transition">
              📥 Import JSON
            </button>
          </div>
        </div>

        ${customDecks.length === 0 ? `
          <div class="glass-panel p-12 rounded-3xl text-center space-y-4 border border-dashed border-gray-700">
            <span class="text-5xl">📚</span>
            <h3 class="text-xl font-bold text-white">No Custom Decks Yet</h3>
            <p class="text-gray-400 text-sm max-w-sm mx-auto">
              Build your own study deck with custom questions or import flashcards to quiz yourself and duel friends!
            </p>
            <button onclick="ui.showCreateDeckModal()" class="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white">
              Create First Study Deck
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${customDecks.map(deck => `
              <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <div class="flex items-start justify-between">
                  <div class="space-y-1">
                    <h3 class="font-bold text-white text-lg">${deck.title}</h3>
                    <p class="text-xs text-gray-400">${deck.questions.length} Questions</p>
                  </div>
                  <button onclick="ui.exportDeck('${deck.id}')" class="text-xs text-indigo-400 hover:text-indigo-300">
                    📤 Export
                  </button>
                </div>
                <div class="flex gap-2 pt-2">
                  <button onclick="ui.startSolo('${deck.id}')" class="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white">
                    🎯 Quiz
                  </button>
                  <button onclick="ui.startFlashcards('${deck.id}')" class="flex-1 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-200">
                    🎴 Flashcards
                  </button>
                  <button onclick="ui.deleteDeck('${deck.id}')" class="px-3 py-2 rounded-xl text-xs font-bold bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-500/30">
                    🗑️
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  showCreateDeckModal() {
    const modalHtml = `
      <div id="deck-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-bounce-in">
        <div class="glass-panel max-w-lg w-full p-6 rounded-3xl border border-indigo-500/40 space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-white">Create Study Deck</h2>
            <button onclick="document.getElementById('deck-modal').remove()" class="text-gray-400 hover:text-white">✕</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs text-gray-400 block mb-1">Deck Title</label>
              <input id="modal-deck-title" type="text" placeholder="e.g. JavaScript Async & Promises"
                     class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm focus:border-indigo-500 outline-none"/>
            </div>

            <div class="border-t border-gray-800 pt-3">
              <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Sample Question</div>
              <input id="modal-q-text" type="text" placeholder="Enter question..."
                     class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm mb-2 outline-none"/>
              <input id="modal-opt-0" type="text" placeholder="Option A (Correct Answer)"
                     class="w-full bg-emerald-950/30 border border-emerald-500/40 rounded-xl px-4 py-2 text-emerald-200 text-sm mb-2 outline-none"/>
              <input id="modal-opt-1" type="text" placeholder="Option B (Wrong)"
                     class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm mb-2 outline-none"/>
              <input id="modal-opt-2" type="text" placeholder="Option C (Wrong)"
                     class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm mb-2 outline-none"/>
              <input id="modal-opt-3" type="text" placeholder="Option D (Wrong)"
                     class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm mb-2 outline-none"/>
              <textarea id="modal-exp" placeholder="Explanation for learners..."
                        class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm outline-none resize-none h-16"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button onclick="document.getElementById('deck-modal').remove()" class="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white">
              Cancel
            </button>
            <button onclick="ui.saveDeckFromModal()" class="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white">
              Save Deck
            </button>
          </div>
        </div>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);
  }

  saveDeckFromModal() {
    const title = document.getElementById('modal-deck-title').value.trim();
    const qText = document.getElementById('modal-q-text').value.trim();
    const opt0 = document.getElementById('modal-opt-0').value.trim();
    const opt1 = document.getElementById('modal-opt-1').value.trim();
    const opt2 = document.getElementById('modal-opt-2').value.trim();
    const opt3 = document.getElementById('modal-opt-3').value.trim();
    const exp = document.getElementById('modal-exp').value.trim() || 'Custom study question.';

    if (!title || !qText || !opt0 || !opt1) {
      alert("Please provide at least a Deck Title, Question, and two Options.");
      return;
    }

    const newDeck = {
      id: 'deck_' + Date.now(),
      title,
      questions: [
        {
          id: 'custom_' + Date.now(),
          difficulty: 2,
          question: qText,
          options: [opt0, opt1, opt2 || 'None of the above', opt3 || 'All of the above'],
          answer: 0,
          explanation: exp
        }
      ]
    };

    storage.saveCustomDeck(newDeck);
    sounds.playLevelUp();
    document.getElementById('deck-modal').remove();
    this.renderDecksView();
  }

  deleteDeck(deckId) {
    if (confirm("Delete this custom deck?")) {
      storage.deleteCustomDeck(deckId);
      this.renderDecksView();
    }
  }

  exportDeck(deckId) {
    const deck = storage.getCustomDecks().find(d => d.id === deckId);
    if (!deck) return;
    const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title.toLowerCase().replace(/\s+/g, '_')}_deck.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importDeckPrompt() {
    const jsonStr = prompt("Paste deck JSON here:");
    if (!jsonStr) return;
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.title && Array.isArray(parsed.questions)) {
        parsed.id = 'deck_' + Date.now();
        storage.saveCustomDeck(parsed);
        alert(`Deck "${parsed.title}" imported successfully!`);
        this.renderDecksView();
      } else {
        alert("Invalid deck JSON structure.");
      }
    } catch (e) {
      alert("Error parsing JSON: " + e.message);
    }
  }

  // --- PLAYER PROFILE & BADGES ---
  renderProfileView() {
    const s = storage.state;
    const avatars = ['🧙‍♂️', '🦉', '⚡', '🚀', '👑', '🐱', '🤖', '🦊', '🐉', '🧪'];

    this.viewContainer.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8 animate-bounce-in">
        <!-- Profile Header -->
        <div class="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-6">
          <div class="w-24 h-24 rounded-3xl bg-indigo-600/30 border-2 border-indigo-500 flex items-center justify-center text-5xl shadow-xl shadow-indigo-500/20">
            ${s.avatar}
          </div>
          <div class="space-y-2 text-center md:text-left flex-1">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <h1 class="text-2xl md:text-3xl font-black text-white">${s.username}</h1>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 w-fit mx-auto md:mx-0">
                ${s.title}
              </span>
            </div>
            <p class="text-xs text-gray-400">Level ${s.level} Scholar • Member of QuizMaster Arena</p>
            <!-- Avatar Picker -->
            <div class="flex items-center gap-2 pt-2 justify-center md:justify-start">
              <span class="text-xs text-gray-400 mr-1">Avatar:</span>
              ${avatars.map(av => `
                <button onclick="ui.changeAvatar('${av}')" class="text-lg p-1.5 rounded-lg hover:bg-gray-800 transition ${s.avatar === av ? 'bg-indigo-600' : ''}">
                  ${av}
                </button>
              `).join('')}
            </div>
          </div>
          <button onclick="ui.editUsername()" class="px-4 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-200 transition">
            ✏️ Edit Name
          </button>
        </div>

        <!-- Badges & Achievements -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span>Achievements & Badges</span>
              <span>🎖️</span>
            </h2>
            <span class="text-xs text-gray-400">${s.unlockedBadges.length} / ${BADGES.length} Unlocked</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${BADGES.map(b => {
              const isUnlocked = s.unlockedBadges.includes(b.id);
              return `
                <div class="p-4 rounded-2xl border transition ${isUnlocked ? 'glass-card border-indigo-500/40 glow-primary' : 'bg-gray-900/40 border-gray-800 opacity-50 grayscale'}">
                  <div class="flex items-start gap-3">
                    <span class="text-3xl">${b.icon}</span>
                    <div>
                      <div class="font-bold text-white text-sm">${b.name}</div>
                      <div class="text-xs text-gray-400 mt-0.5 leading-snug">${b.desc}</div>
                      <div class="text-[11px] font-bold text-amber-400 mt-2">Reward: +${b.reward} Coins</div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  changeAvatar(av) {
    sounds.playClick();
    storage.state.avatar = av;
    storage.save();
    this.renderProfileView();
  }

  editUsername() {
    const newName = prompt("Enter new username:", storage.state.username);
    if (newName && newName.trim()) {
      storage.state.username = newName.trim().slice(0, 20);
      storage.save();
      this.renderProfileView();
    }
  }
}

// Global UI Hook implementations
window.renderActiveQuestion = function(q) {
  const qText = document.getElementById('active-question-text');
  const catBadge = document.getElementById('question-category-badge');
  const optContainer = document.getElementById('options-container');
  const expBox = document.getElementById('explanation-box');
  const progressText = document.getElementById('question-progress-text');

  if (expBox) expBox.classList.add('hidden');
  if (catBadge) catBadge.innerText = q.categoryName || 'General';
  if (qText) qText.innerText = q.question;
  if (progressText) {
    progressText.innerText = `Question ${gameEngine.currentIndex + 1} of ${gameEngine.questions.length || 5}`;
  }

  if (optContainer) {
    optContainer.innerHTML = q.options.map((opt, i) => `
      <button class="quiz-option-btn p-4 rounded-2xl text-left font-semibold text-white text-sm md:text-base flex items-center gap-3"
              id="opt-btn-${i}"
              onclick="gameEngine.submitAnswer(${i})">
        <span class="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-gray-400">
          ${i + 1}
        </span>
        <span class="flex-1">${opt}</span>
      </button>
    `).join('');
  }
};

window.updateTimerUI = function(timeLeft, maxTime) {
  const timerText = document.getElementById('timer-text');
  const timerBar = document.getElementById('round-timer-bar');

  if (timerText) {
    timerText.innerText = `${timeLeft}s`;
    if (timeLeft <= 4) timerText.classList.add('text-rose-500');
    else timerText.classList.remove('text-rose-500');
  }

  if (timerBar) {
    const pct = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
    timerBar.style.width = `${pct}%`;
    if (timeLeft <= 4) {
      timerBar.classList.add('bg-rose-500');
      timerBar.classList.remove('from-emerald-500', 'to-indigo-500');
    } else {
      timerBar.classList.remove('bg-rose-500');
      timerBar.classList.add('from-emerald-500', 'to-indigo-500');
    }
  }
};

window.updateHealthBars = function(playerHp, oppHp) {
  const pBar = document.getElementById('player-hp-bar');
  const oBar = document.getElementById('opp-hp-bar');
  const pText = document.getElementById('player-hp-text');
  const oText = document.getElementById('opp-hp-text');
  const pScore = document.getElementById('player-score-text');
  const oScore = document.getElementById('opp-score-text');

  if (pBar) pBar.style.width = `${playerHp}%`;
  if (oBar) oBar.style.width = `${oppHp}%`;
  if (pText) pText.innerText = playerHp;
  if (oText) oText.innerText = oppHp;
  if (pScore) pScore.innerText = `${gameEngine.playerScore} PTS`;
  if (oScore) oScore.innerText = `${gameEngine.opponentScore} PTS`;
};

window.updateBotStatus = function(result) {
  const status = document.getElementById('bot-status-text');
  if (status) {
    status.innerText = result.correct ? '⚡ Answered Correctly!' : '❌ Missed question';
    status.classList.add(result.correct ? 'text-emerald-400' : 'text-rose-400');
  }
};

window.showAnswerFeedback = function(isCorrect, selectedIdx, correctIdx) {
  const buttons = document.querySelectorAll('.quiz-option-btn');
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIdx) {
      btn.classList.add('correct');
    } else if (idx === selectedIdx && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  const qCard = document.getElementById('question-card');
  if (qCard && !isCorrect) {
    qCard.classList.add('animate-shake');
    setTimeout(() => qCard.classList.remove('animate-shake'), 500);
  }

  const expBox = document.getElementById('explanation-box');
  const expText = document.getElementById('explanation-text');
  const currentQ = gameEngine.questions[gameEngine.currentIndex];

  if (expBox && expText && currentQ) {
    expText.innerText = currentQ.explanation;
    expBox.classList.remove('hidden');
  }
};

window.applyFiftyFiftyUI = function(eliminatedIndices) {
  eliminatedIndices.forEach(idx => {
    const btn = document.getElementById(`opt-btn-${idx}`);
    if (btn) btn.classList.add('eliminated');
  });
  // Update powerup inventory counter in UI
  const counter = document.querySelector('#powerup-5050 span:last-child');
  if (counter) counter.innerText = storage.state.inventory.fiftyFifty || 0;
};

window.showDoubleXpActiveUI = function() {
  const badge = document.getElementById('double-xp-badge');
  if (badge) badge.classList.remove('hidden');
  const counter = document.querySelector('#powerup-double span:last-child');
  if (counter) counter.innerText = storage.state.inventory.doubleXp || 0;
};

window.renderSessionSummary = function(data) {
  ui.updateHUD();

  if (data.isVictory) {
    ConfettiCannon.burst(90);
  }

  ui.viewContainer.innerHTML = `
    <div class="max-w-xl mx-auto space-y-6 animate-bounce-in text-center">
      <div class="glass-panel p-8 rounded-3xl border ${data.isVictory ? 'border-emerald-500/40 glow-success' : 'border-rose-500/40'} space-y-6">
        <div class="inline-flex p-4 rounded-3xl ${data.isVictory ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} text-6xl">
          ${data.isVictory ? '🏆' : '💀'}
        </div>

        <div>
          <h1 class="text-3xl md:text-4xl font-black text-white">
            ${data.isVictory ? 'Glorious Victory!' : 'Session Complete'}
          </h1>
          <p class="text-gray-400 text-sm mt-1">
            ${data.mode === 'battle' ? (data.isVictory ? `You conquered ${data.opponent.name}!` : `Defeated by ${data.opponent.name}. Train harder!`) : 'Great study effort!'}
          </p>
        </div>

        <!-- Rewards Cards -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-gray-900/60 p-4 rounded-2xl border border-white/5">
            <div class="text-xs text-indigo-400 font-bold uppercase tracking-wider">XP Gained</div>
            <div class="text-2xl font-black text-white font-mono">+${data.xpEarned}</div>
          </div>
          <div class="bg-gray-900/60 p-4 rounded-2xl border border-white/5">
            <div class="text-xs text-amber-400 font-bold uppercase tracking-wider">Coins Earned</div>
            <div class="text-2xl font-black text-amber-400 font-mono">+${data.coinsEarned}</div>
          </div>
        </div>

        <div class="text-xs text-gray-400">
          Accuracy: <span class="font-bold text-white">${Math.round((data.correctCount / Math.max(1, data.totalCount)) * 100)}%</span> (${data.correctCount} of ${data.totalCount} correct)
        </div>

        <div class="flex gap-3 pt-2">
          <button onclick="ui.switchView('arena')"
                  class="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-gray-800 hover:bg-gray-700 text-white transition">
            🏠 Return to Lobby
          </button>
          <button onclick="${data.mode === 'battle' ? `ui.startBattleWithCategory('${gameEngine.currentCategory}')` : `ui.switchView('${data.mode}')`}"
                  class="flex-1 py-3.5 rounded-2xl font-black text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition">
            ⚔️ Play Again
          </button>
        </div>
      </div>
    </div>
  `;
};

// Initialize UI
let ui = null;
window.addEventListener('DOMContentLoaded', () => {
  ui = new UIManager();
});
