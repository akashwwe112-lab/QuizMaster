// Game Engine for QuizMaster Arena: 1v1 Battle, Solo Quest, Daily Challenge, Survival Blitz & Flashcards

const BOT_OPPONENTS = [
  { name: 'NovaBot', avatar: '🤖', title: 'Apprentice Bot', accuracy: 0.65, minSpeed: 4, maxSpeed: 11 },
  { name: 'Athena 🦉', avatar: '🦉', title: 'Scholar AI', accuracy: 0.78, minSpeed: 3, maxSpeed: 9 },
  { name: 'CyberSam', avatar: '⚡', title: 'Speedrunner', accuracy: 0.82, minSpeed: 2, maxSpeed: 7 },
  { name: 'Dr. Quantum', avatar: '🧪', title: 'Quiz Archmage', accuracy: 0.92, minSpeed: 3, maxSpeed: 8 }
];

class GameEngine {
  constructor() {
    this.mode = null; // 'battle', 'daily', 'solo', 'blitz', 'flashcards'
    this.currentCategory = 'all';
    this.questions = [];
    this.currentIndex = 0;
    this.timer = null;
    this.timeLeft = 15;
    this.maxTime = 15;
    this.hasAnswered = false;
    this.doubleXpActive = false;
    this.eliminatedOptions = new Set();
    this.startTime = 0;

    // 1v1 Battle State
    this.opponent = null;
    this.playerScore = 0;
    this.opponentScore = 0;
    this.playerHealth = 100;
    this.opponentHealth = 100;
    this.botTimer = null;
    this.botAnswered = false;
    this.botResult = null; // { correct: bool, time: num }

    // Blitz mode state
    this.blitzStreak = 0;
    this.blitzBest = 0;

    // Session stats
    this.sessionCorrect = 0;
    this.sessionTotal = 0;
    this.sessionXp = 0;
    this.sessionCoins = 0;
  }

  // --- START GAME MODES ---

  startBattle(category = 'all', botIndex = 1) {
    this.mode = 'battle';
    this.currentCategory = category;
    this.opponent = BOT_OPPONENTS[botIndex] || BOT_OPPONENTS[0];
    this.playerScore = 0;
    this.opponentScore = 0;
    this.playerHealth = 100;
    this.opponentHealth = 100;
    this.sessionCorrect = 0;
    this.sessionTotal = 5;
    this.sessionXp = 0;
    this.sessionCoins = 0;
    this.doubleXpActive = false;
    this.currentIndex = 0;

    const allQ = QuestionManager.getQuestionsByCategory(category);
    this.questions = QuestionManager.getRandomSubset(allQ, 5);

    sounds.playClick();
    this.loadQuestion();
  }

  startDailyChallenge() {
    this.mode = 'daily';
    this.currentCategory = 'all';
    this.sessionCorrect = 0;
    this.sessionTotal = 5;
    this.sessionXp = 0;
    this.sessionCoins = 0;
    this.doubleXpActive = false;
    this.currentIndex = 0;

    this.questions = QuestionManager.getDailyChallengeQuestions();
    sounds.playClick();
    this.loadQuestion();
  }

  startSoloQuest(category = 'cs') {
    this.mode = 'solo';
    this.currentCategory = category;
    this.sessionCorrect = 0;
    this.sessionTotal = 5;
    this.sessionXp = 0;
    this.sessionCoins = 0;
    this.doubleXpActive = false;
    this.currentIndex = 0;

    const allQ = QuestionManager.getQuestionsByCategory(category);
    this.questions = QuestionManager.getRandomSubset(allQ, 5);
    sounds.playClick();
    this.loadQuestion();
  }

  startSurvivalBlitz() {
    this.mode = 'blitz';
    this.currentCategory = 'all';
    this.blitzStreak = 0;
    this.sessionCorrect = 0;
    this.sessionTotal = 0;
    this.sessionXp = 0;
    this.sessionCoins = 0;
    this.doubleXpActive = false;

    // Endless pool
    const allQ = QuestionManager.getAllQuestions();
    this.questions = [...allQ].sort(() => 0.5 - Math.random());
    this.currentIndex = 0;

    sounds.playClick();
    this.loadQuestion();
  }

  // --- QUESTION FLOW & TIMERS ---

  loadQuestion() {
    if (this.timer) clearInterval(this.timer);
    if (this.botTimer) clearTimeout(this.botTimer);

    if (this.currentIndex >= this.questions.length) {
      if (this.mode === 'blitz') {
        // Reshuffle more questions
        const moreQ = QuestionManager.getAllQuestions().sort(() => 0.5 - Math.random());
        this.questions.push(...moreQ);
      } else {
        this.finishSession();
        return;
      }
    }

    const currentQ = this.questions[this.currentIndex];
    this.hasAnswered = false;
    this.eliminatedOptions.clear();
    this.botAnswered = false;
    this.botResult = null;
    this.maxTime = this.mode === 'blitz' ? Math.max(8, 15 - Math.floor(this.blitzStreak / 2)) : 15;
    this.timeLeft = this.maxTime;
    this.startTime = Date.now();

    // Trigger UI render
    if (window.renderActiveQuestion) {
      window.renderActiveQuestion(currentQ);
    }

    // Start Question Timer
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (window.updateTimerUI) {
        window.updateTimerUI(this.timeLeft, this.maxTime);
      }

      if (this.timeLeft <= 3 && this.timeLeft > 0) {
        sounds.playWarningTick();
      } else if (this.timeLeft > 0) {
        sounds.playTick();
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.handleTimeout();
      }
    }, 1000);

    // If 1v1 Battle, simulate bot thinking and answering
    if (this.mode === 'battle' && this.opponent) {
      const answerSpeed = Math.floor(
        Math.random() * (this.opponent.maxSpeed - this.opponent.minSpeed + 1) + this.opponent.minSpeed
      );
      this.botTimer = setTimeout(() => {
        const isCorrect = Math.random() < this.opponent.accuracy;
        this.botAnswered = true;
        this.botResult = { correct: isCorrect, time: answerSpeed };

        if (window.updateBotStatus) {
          window.updateBotStatus(this.botResult);
        }

        // Damage calculation if bot is correct
        if (isCorrect) {
          this.opponentScore += 100;
          this.playerHealth = Math.max(0, this.playerHealth - 20);
        }

        if (window.updateHealthBars) {
          window.updateHealthBars(this.playerHealth, this.opponentHealth);
        }
      }, answerSpeed * 1000);
    }
  }

  handleTimeout() {
    if (this.hasAnswered) return;
    this.hasAnswered = true;
    sounds.playWrong();

    if (window.showAnswerFeedback) {
      window.showAnswerFeedback(false, -1, this.questions[this.currentIndex].answer);
    }

    if (this.mode === 'battle') {
      this.playerHealth = Math.max(0, this.playerHealth - 20);
      if (window.updateHealthBars) {
        window.updateHealthBars(this.playerHealth, this.opponentHealth);
      }
    }

    storage.state.stats.totalQuestionsAnswered++;
    storage.save();

    if (this.mode === 'blitz') {
      setTimeout(() => this.finishSession(), 1200);
      return;
    }

    setTimeout(() => {
      this.currentIndex++;
      this.loadQuestion();
    }, 2000);
  }

  submitAnswer(selectedIndex) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;
    if (this.timer) clearInterval(this.timer);

    const q = this.questions[this.currentIndex];
    const isCorrect = selectedIndex === q.answer;
    const answerTimeSeconds = (Date.now() - this.startTime) / 1000;

    storage.state.stats.totalQuestionsAnswered++;

    if (isCorrect) {
      sounds.playCorrect();
      this.sessionCorrect++;
      storage.state.stats.correctAnswers++;

      // Speed demon badge test
      if (answerTimeSeconds <= 3) {
        storage.unlockBadge('speed_demon');
      }

      // Points & Currency formula
      let xpEarned = 25;
      let coinEarned = 10;

      // Speed bonus
      if (this.timeLeft > 10) {
        xpEarned += 15;
        coinEarned += 5;
      }

      if (this.doubleXpActive) {
        xpEarned *= 2;
      }

      if (this.mode === 'daily') {
        xpEarned = Math.round(xpEarned * 1.5);
        coinEarned += 10;
      }

      this.sessionXp += xpEarned;
      this.sessionCoins += coinEarned;
      storage.addXp(xpEarned);
      storage.addCoins(coinEarned);

      if (this.mode === 'battle') {
        this.playerScore += 100;
        this.opponentHealth = Math.max(0, this.opponentHealth - 20);
      } else if (this.mode === 'blitz') {
        this.blitzStreak++;
        if (this.blitzStreak > this.blitzBest) this.blitzBest = this.blitzStreak;
        if (this.blitzStreak >= 8) storage.unlockBadge('blitz_ace');
      }
    } else {
      sounds.playWrong();
      if (this.mode === 'battle') {
        this.playerHealth = Math.max(0, this.playerHealth - 15);
      }
    }

    storage.save();

    if (window.showAnswerFeedback) {
      window.showAnswerFeedback(isCorrect, selectedIndex, q.answer);
    }

    if (window.updateHealthBars) {
      window.updateHealthBars(this.playerHealth, this.opponentHealth);
    }

    if (this.mode === 'blitz' && !isCorrect) {
      // Sudden death in blitz!
      setTimeout(() => this.finishSession(), 1500);
      return;
    }

    // Check early knockout in battle
    if (this.mode === 'battle' && (this.playerHealth <= 0 || this.opponentHealth <= 0)) {
      setTimeout(() => this.finishSession(), 1600);
      return;
    }

    setTimeout(() => {
      this.currentIndex++;
      this.loadQuestion();
    }, 2000);
  }

  // --- POWER-UPS ---

  useFiftyFifty() {
    if (this.hasAnswered) return false;
    if (this.eliminatedOptions.size > 0) return false; // Already used this question

    if (!storage.useItem('fiftyFifty')) {
      alert("You don't have any 50/50 Power-ups left! Grab some in the Shop.");
      return false;
    }

    sounds.playPowerup();
    const q = this.questions[this.currentIndex];
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.answer);
    const toEliminate = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);

    toEliminate.forEach(idx => this.eliminatedOptions.add(idx));

    if (window.applyFiftyFiftyUI) {
      window.applyFiftyFiftyUI(toEliminate);
    }
    return true;
  }

  useTimeFreeze() {
    if (this.hasAnswered) return false;

    if (!storage.useItem('freezeTime')) {
      alert("You don't have any Time Freeze items left! Buy more in the Shop.");
      return false;
    }

    sounds.playPowerup();
    this.timeLeft += 15;
    this.maxTime = Math.max(this.maxTime, this.timeLeft);

    if (window.updateTimerUI) {
      window.updateTimerUI(this.timeLeft, this.maxTime);
    }
    return true;
  }

  useDoubleXp() {
    if (this.doubleXpActive) return false;

    if (!storage.useItem('doubleXp')) {
      alert("You don't have any 2x XP Elixirs left! Visit the Shop.");
      return false;
    }

    sounds.playPowerup();
    this.doubleXpActive = true;
    if (window.showDoubleXpActiveUI) {
      window.showDoubleXpActiveUI();
    }
    return true;
  }

  // --- SESSION COMPLETION ---

  finishSession() {
    if (this.timer) clearInterval(this.timer);
    if (this.botTimer) clearTimeout(this.botTimer);

    let isVictory = false;

    if (this.mode === 'battle') {
      isVictory = this.playerScore > this.opponentScore || this.opponentHealth <= 0;
      if (isVictory) {
        storage.state.stats.battlesWon++;
        storage.unlockBadge('first_win');
        sounds.playVictory();
      } else {
        storage.state.stats.battlesLost++;
        sounds.playDefeat();
      }
    } else if (this.mode === 'daily') {
      isVictory = this.sessionCorrect >= 3;
      storage.recordDailyActivity();
      storage.state.stats.dailyChallengesCompleted++;
      if (isVictory) sounds.playVictory();
      else sounds.playDefeat();
    } else if (this.mode === 'blitz') {
      isVictory = this.blitzStreak >= 5;
      if (isVictory) sounds.playVictory();
      else sounds.playDefeat();
    } else {
      isVictory = this.sessionCorrect >= 3;
      if (isVictory) sounds.playVictory();
      else sounds.playDefeat();
    }

    if (this.sessionCorrect === this.questions.length && this.questions.length >= 5) {
      storage.unlockBadge('quiz_master');
    }

    storage.save();

    if (window.renderSessionSummary) {
      window.renderSessionSummary({
        mode: this.mode,
        isVictory,
        correctCount: this.sessionCorrect,
        totalCount: this.mode === 'blitz' ? this.blitzStreak : this.questions.length,
        xpEarned: this.sessionXp,
        coinsEarned: this.sessionCoins,
        blitzStreak: this.blitzStreak,
        playerScore: this.playerScore,
        opponentScore: this.opponentScore,
        opponent: this.opponent
      });
    }
  }
}

const gameEngine = new GameEngine();
