// LocalStorage State and Progression Management

const BADGES = [
  { id: 'first_win', name: 'First Blood', icon: '⚔️', desc: 'Win your first 1v1 Quiz Battle', reward: 50 },
  { id: 'streak_3', name: 'Flame Ignited', icon: '🔥', desc: 'Reach a 3-day study streak', reward: 100 },
  { id: 'streak_7', name: 'Inferno Master', icon: '⚡', desc: 'Reach a 7-day study streak', reward: 250 },
  { id: 'level_5', name: 'Scholar', icon: '📜', desc: 'Reach Level 5', reward: 100 },
  { id: 'level_10', name: 'Grandmaster', icon: '👑', desc: 'Reach Level 10', reward: 300 },
  { id: 'quiz_master', name: 'Sharpshooter', icon: '🎯', desc: 'Score 100% in a quiz session', reward: 75 },
  { id: 'speed_demon', name: 'Speed Demon', icon: '🏎️', desc: 'Answer correctly within 3 seconds', reward: 50 },
  { id: 'big_spender', name: 'Shopaholic', icon: '🛍️', desc: 'Buy an item from the Power-Up Shop', reward: 50 },
  { id: 'deck_builder', name: 'Deck Architect', icon: '🎴', desc: 'Create your own custom study deck', reward: 100 },
  { id: 'blitz_ace', name: 'Survival King', icon: '🛡️', desc: 'Answer 8+ consecutive questions in Blitz mode', reward: 150 }
];

const SHOP_ITEMS = [
  {
    id: 'fiftyFifty',
    name: '50 / 50 Elimination',
    icon: '✂️',
    price: 60,
    desc: 'Instantly removes 2 wrong options from the question.'
  },
  {
    id: 'freezeTime',
    name: 'Time Freeze (+15s)',
    icon: '⏳',
    price: 50,
    desc: 'Pauses pressure and grants +15 extra seconds on the clock.'
  },
  {
    id: 'doubleXp',
    name: '2x XP Elixir',
    icon: '🧪',
    price: 90,
    desc: 'Doubles all XP earned in your current game session.'
  },
  {
    id: 'streakShield',
    name: 'Streak Aegis Shield',
    icon: '🛡️',
    price: 150,
    desc: 'Automatically protects your daily streak if you miss a day.'
  }
];

class StorageManager {
  constructor() {
    this.STORAGE_KEY = 'quizmaster_save_v1';
    this.state = this.loadState();
    this.checkDailyStreak();
  }

  getDefaultState() {
    return {
      username: 'ScholarHero',
      avatar: '🧙‍♂️',
      title: 'Novice Scholar',
      level: 1,
      xp: 0,
      coins: 100, // starter balance
      streak: 1,
      lastStreakDate: new Date().toISOString().slice(0, 10),
      streakShields: 1,
      inventory: {
        fiftyFifty: 2,
        freezeTime: 2,
        doubleXp: 1
      },
      stats: {
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        battlesWon: 0,
        battlesLost: 0,
        dailyChallengesCompleted: 0,
        highestStreak: 1
      },
      unlockedBadges: [],
      customDecks: []
    };
  }

  loadState() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return this.getDefaultState();
      const parsed = JSON.parse(data);
      // Merge with default in case of missing keys
      const def = this.getDefaultState();
      return {
        ...def,
        ...parsed,
        inventory: { ...def.inventory, ...(parsed.inventory || {}) },
        stats: { ...def.stats, ...(parsed.stats || {}) }
      };
    } catch (e) {
      console.error("Failed to load save state", e);
      return this.getDefaultState();
    }
  }

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }

  getXpNeededForLevel(level) {
    return level * 150;
  }

  addXp(amount) {
    let earned = Math.max(0, amount);
    this.state.xp += earned;
    let leveledUp = false;
    let newLevel = this.state.level;

    while (this.state.xp >= this.getXpNeededForLevel(this.state.level)) {
      this.state.xp -= this.getXpNeededForLevel(this.state.level);
      this.state.level += 1;
      newLevel = this.state.level;
      leveledUp = true;
      this.addCoins(50); // bonus coins per level
      this.updateRankTitle();
    }

    if (leveledUp) {
      if (this.state.level >= 5) this.unlockBadge('level_5');
      if (this.state.level >= 10) this.unlockBadge('level_10');
    }

    this.save();
    return { leveledUp, newLevel, currentXp: this.state.xp, neededXp: this.getXpNeededForLevel(this.state.level) };
  }

  updateRankTitle() {
    const lvl = this.state.level;
    if (lvl >= 25) this.state.title = 'Supreme Archmage';
    else if (lvl >= 15) this.state.title = 'Grandmaster';
    else if (lvl >= 10) this.state.title = 'Master Tactician';
    else if (lvl >= 5) this.state.title = 'Erudite Scholar';
    else if (lvl >= 3) this.state.title = 'Keen Apprentice';
    else this.state.title = 'Novice Scholar';
  }

  addCoins(amount) {
    this.state.coins += amount;
    this.save();
    return this.state.coins;
  }

  spendCoins(amount) {
    if (this.state.coins >= amount) {
      this.state.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  buyItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, msg: "Item not found." };

    if (!this.spendCoins(item.price)) {
      return { success: false, msg: "Not enough coins!" };
    }

    if (itemId === 'streakShield') {
      this.state.streakShields = (this.state.streakShields || 0) + 1;
    } else {
      this.state.inventory[itemId] = (this.state.inventory[itemId] || 0) + 1;
    }

    this.unlockBadge('big_spender');
    this.save();
    return { success: true, msg: `Purchased ${item.name}!`, item };
  }

  useItem(itemId) {
    if (this.state.inventory[itemId] && this.state.inventory[itemId] > 0) {
      this.state.inventory[itemId]--;
      this.save();
      return true;
    }
    return false;
  }

  unlockBadge(badgeId) {
    if (!this.state.unlockedBadges.includes(badgeId)) {
      this.state.unlockedBadges.push(badgeId);
      const badge = BADGES.find(b => b.id === badgeId);
      if (badge && badge.reward) {
        this.addCoins(badge.reward);
      }
      this.save();
      return badge;
    }
    return null;
  }

  checkDailyStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = this.state.lastStreakDate;

    if (!lastDate) {
      this.state.lastStreakDate = today;
      this.state.streak = 1;
      this.save();
      return;
    }

    if (lastDate === today) {
      // Already active today
      return;
    }

    const last = new Date(lastDate);
    const current = new Date(today);
    const diffDays = Math.round((current - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day - handled when user plays or completes challenge
    } else if (diffDays > 1) {
      // Missed one or more days! Check shield
      if (this.state.streakShields > 0) {
        this.state.streakShields--;
        // Shield protected streak!
        this.lastStreakProtected = true;
      } else {
        // Streak lost
        this.state.streak = 1;
      }
      this.state.lastStreakDate = today;
      this.save();
    }
  }

  recordDailyActivity() {
    const today = new Date().toISOString().slice(0, 10);
    if (this.state.lastStreakDate !== today) {
      this.state.streak = (this.state.streak || 1) + 1;
      this.state.lastStreakDate = today;
      if (this.state.streak > (this.state.stats.highestStreak || 1)) {
        this.state.stats.highestStreak = this.state.streak;
      }
      if (this.state.streak >= 3) this.unlockBadge('streak_3');
      if (this.state.streak >= 7) this.unlockBadge('streak_7');
      this.addCoins(30); // daily streak reward
      this.save();
    }
  }

  getCustomDecks() {
    return this.state.customDecks || [];
  }

  saveCustomDeck(deck) {
    if (!this.state.customDecks) this.state.customDecks = [];
    const idx = this.state.customDecks.findIndex(d => d.id === deck.id);
    if (idx >= 0) {
      this.state.customDecks[idx] = deck;
    } else {
      this.state.customDecks.push(deck);
      this.unlockBadge('deck_builder');
    }
    this.save();
  }

  deleteCustomDeck(deckId) {
    this.state.customDecks = (this.state.customDecks || []).filter(d => d.id !== deckId);
    this.save();
  }
}

const storage = new StorageManager();
