// Question bank spanning multiple subjects and difficulty tiers
const QUESTION_BANK = {
  cs: [
    {
      id: "cs_1",
      category: "cs",
      categoryName: "Computer Science",
      difficulty: 1,
      question: "What is the time complexity of looking up a key in an average Hash Table?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      answer: 0,
      explanation: "Hash tables achieve average O(1) constant time lookups by hashing keys directly to buckets."
    },
    {
      id: "cs_2",
      category: "cs",
      categoryName: "Computer Science",
      difficulty: 1,
      question: "Which of the following data structures operates on a Last-In, First-Out (LIFO) principle?",
      options: ["Queue", "Stack", "Binary Search Tree", "Linked List"],
      answer: 1,
      explanation: "A Stack follows LIFO, where the last element pushed onto the stack is the first one popped off."
    },
    {
      id: "cs_3",
      category: "cs",
      categoryName: "Computer Science",
      difficulty: 2,
      question: "In Python, which keyword is used to create an anonymous inline function?",
      options: ["def", "func", "lambda", "anon"],
      answer: 2,
      explanation: "The `lambda` keyword defines short, single-expression anonymous functions in Python."
    },
    {
      id: "cs_4",
      category: "cs",
      categoryName: "Computer Science",
      difficulty: 2,
      question: "In relational databases, which SQL clause is used to filter groups created by GROUP BY?",
      options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
      answer: 1,
      explanation: "`HAVING` filters aggregated data produced by `GROUP BY`, whereas `WHERE` filters rows before aggregation."
    },
    {
      id: "cs_5",
      category: "cs",
      categoryName: "Computer Science",
      difficulty: 2,
      question: "Which HTTP status code signifies that a requested resource was Not Found?",
      options: ["200", "401", "404", "500"],
      answer: 2,
      explanation: "HTTP 404 indicates that the server cannot find the requested URL path."
    },
    {
      id: "cs_6",
      category: "cs",
      categoryName: "Computer Science",
      difficulty: 3,
      question: "What is the worst-case time complexity of the standard QuickSort algorithm?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(2ⁿ)"],
      answer: 1,
      explanation: "QuickSort degrades to O(n²) when the chosen pivot is consistently the smallest or largest element."
    },
    {
      id: "cs_7",
      category: "cs",
      categoryName: "Computer Science",
      difficulty: 3,
      question: "Which concurrency problem occurs when two processes are each waiting for the other to release a lock?",
      options: ["Race Condition", "Deadlock", "Livelock", "Starvation"],
      answer: 1,
      explanation: "A Deadlock occurs when processes are permanently blocked waiting for resources held by each other."
    },
    {
      id: "cs_8",
      category: "cs",
      categoryName: "Computer Science",
      difficulty: 1,
      question: "What does the DOM stand for in Web Development?",
      options: ["Document Object Model", "Data Oriented Module", "Digital Ordinance Map", "Desktop Operations Manager"],
      answer: 0,
      explanation: "DOM stands for Document Object Model, representing the HTML tree structure in JavaScript."
    }
  ],
  science: [
    {
      id: "sci_1",
      category: "science",
      categoryName: "Science & Nature",
      difficulty: 1,
      question: "What is known as the powerhouse of the eukaryotic cell?",
      options: ["Ribosome", "Nucleus", "Mitochondria", "Endoplasmic Reticulum"],
      answer: 2,
      explanation: "Mitochondria generate most of the cell's supply of adenosine triphosphate (ATP), used as chemical energy."
    },
    {
      id: "sci_2",
      category: "science",
      categoryName: "Science & Nature",
      difficulty: 1,
      question: "What is the chemical symbol for the element Gold?",
      options: ["Ag", "Au", "Fe", "Pb"],
      answer: 1,
      explanation: "Au comes from the Latin word for gold, 'aurum', meaning shining dawn."
    },
    {
      id: "sci_3",
      category: "science",
      categoryName: "Science & Nature",
      difficulty: 2,
      question: "Which subatomic particle carries a negative electric charge?",
      options: ["Proton", "Neutron", "Electron", "Positron"],
      answer: 2,
      explanation: "Electrons have a negative charge, protons have a positive charge, and neutrons are neutral."
    },
    {
      id: "sci_4",
      category: "science",
      categoryName: "Science & Nature",
      difficulty: 2,
      question: "What force keeps the planets orbiting around the Sun?",
      options: ["Electromagnetic force", "Gravitational force", "Strong nuclear force", "Centrifugal force"],
      answer: 1,
      explanation: "Gravity is the attractive force between masses that maintains orbital paths."
    },
    {
      id: "sci_5",
      category: "science",
      categoryName: "Science & Nature",
      difficulty: 2,
      question: "What process do plants use to convert sunlight, water, and carbon dioxide into oxygen and glucose?",
      options: ["Respiration", "Photosynthesis", "Fermentation", "Transpiration"],
      answer: 1,
      explanation: "Photosynthesis occurs within plant chloroplasts utilizing chlorophyll to harness sunlight."
    },
    {
      id: "sci_6",
      category: "science",
      categoryName: "Science & Nature",
      difficulty: 3,
      question: "Which of the following describes the Heisenberg Uncertainty Principle?",
      options: [
        "Energy cannot be created or destroyed",
        "Position and momentum of a particle cannot both be precisely measured simultaneously",
        "Light speed is constant in all inertial reference frames",
        "Entropy of an isolated system always increases"
      ],
      answer: 1,
      explanation: "The Heisenberg Uncertainty Principle sets a fundamental limit on measuring complementary quantum variables."
    },
    {
      id: "sci_7",
      category: "science",
      categoryName: "Science & Nature",
      difficulty: 3,
      question: "What is the most abundant gas in Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      answer: 2,
      explanation: "Nitrogen makes up approximately 78% of Earth's atmosphere, followed by oxygen at ~21%."
    }
  ],
  history: [
    {
      id: "hist_1",
      category: "history",
      categoryName: "World History",
      difficulty: 1,
      question: "In which year did Christopher Columbus make his first voyage across the Atlantic to the Americas?",
      options: ["1492", "1776", "1215", "1588"],
      answer: 0,
      explanation: "Columbus set sail from Spain in August 1492 and arrived in the Bahamas in October 1492."
    },
    {
      id: "hist_2",
      category: "history",
      categoryName: "World History",
      difficulty: 1,
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "Benjamin Franklin", "George Washington", "John Adams"],
      answer: 2,
      explanation: "George Washington served as the first U.S. President from 1789 to 1797."
    },
    {
      id: "hist_3",
      category: "history",
      categoryName: "World History",
      difficulty: 2,
      question: "The Magna Carta was signed in England in which year, limiting the power of the monarchy?",
      options: ["1066", "1215", "1415", "1689"],
      answer: 1,
      explanation: "King John signed the Magna Carta at Runnymede in 1215, establishing that even the king is subject to law."
    },
    {
      id: "hist_4",
      category: "history",
      categoryName: "World History",
      difficulty: 2,
      question: "Which ancient civilization constructed the city of Machu Picchu high in the Andes?",
      options: ["Aztecs", "Mayans", "Incas", "Olmecs"],
      answer: 2,
      explanation: "The Inca Empire built Machu Picchu in modern-day Peru around 1450 CE."
    },
    {
      id: "hist_5",
      category: "history",
      categoryName: "World History",
      difficulty: 3,
      question: "The Renaissance cultural movement originated in which region during the 14th century?",
      options: ["Northern France", "Tuscany (Florence, Italy)", "Flanders", "Bavaria (Germany)"],
      answer: 1,
      explanation: "The Renaissance began in Florence, Italy, spurred by commerce, humanism, and wealthy patrons like the Medicis."
    },
    {
      id: "hist_6",
      category: "history",
      categoryName: "World History",
      difficulty: 3,
      question: "In what year did the Berlin Wall fall, signaling the impending end of the Cold War?",
      options: ["1979", "1985", "1989", "1991"],
      answer: 2,
      explanation: "The Berlin Wall was breached on November 9, 1989, leading to the reunification of Germany."
    }
  ],
  math: [
    {
      id: "math_1",
      category: "math",
      categoryName: "Mathematics & Logic",
      difficulty: 1,
      question: "What is the value of 7! (7 factorial)?",
      options: ["720", "5040", "40320", "120"],
      answer: 1,
      explanation: "7! = 7 × 6 × 5 × 4 × 3 × 2 × 1 = 5,040."
    },
    {
      id: "math_2",
      category: "math",
      categoryName: "Mathematics & Logic",
      difficulty: 1,
      question: "What is the only even prime number?",
      options: ["0", "1", "2", "4"],
      answer: 2,
      explanation: "2 is the smallest prime number and the only one that is even, as any other even number is divisible by 2."
    },
    {
      id: "math_3",
      category: "math",
      categoryName: "Mathematics & Logic",
      difficulty: 2,
      question: "In a right-angled triangle, if legs are of length 3 and 4, what is the length of the hypotenuse?",
      options: ["5", "6", "7", "4.5"],
      answer: 0,
      explanation: "By Pythagorean theorem: a² + b² = c² -> 3² + 4² = 9 + 16 = 25 -> c = 5."
    },
    {
      id: "math_4",
      category: "math",
      categoryName: "Mathematics & Logic",
      difficulty: 2,
      question: "What is log₁₀(100,000)?",
      options: ["4", "5", "6", "10"],
      answer: 1,
      explanation: "10⁵ = 100,000, therefore the base-10 logarithm is 5."
    },
    {
      id: "math_5",
      category: "math",
      categoryName: "Mathematics & Logic",
      difficulty: 3,
      question: "If you roll two fair six-sided dice, what is the probability of rolling a sum of 7?",
      options: ["1/6", "1/12", "5/36", "7/36"],
      answer: 0,
      explanation: "Pairs summing to 7 are (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 combinations out of 36 = 1/6."
    },
    {
      id: "math_6",
      category: "math",
      categoryName: "Mathematics & Logic",
      difficulty: 3,
      question: "What is the derivative of sin(x) with respect to x?",
      options: ["-sin(x)", "cos(x)", "-cos(x)", "tan(x)"],
      answer: 1,
      explanation: "The derivative of sin(x) is cos(x); the derivative of cos(x) is -sin(x)."
    }
  ],
  geography: [
    {
      id: "geo_1",
      category: "geography",
      categoryName: "Geography & World",
      difficulty: 1,
      question: "Which is the largest ocean by surface area on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      answer: 3,
      explanation: "The Pacific Ocean covers over 30% of the Earth's surface, larger than all of Earth's land area combined."
    },
    {
      id: "geo_2",
      category: "geography",
      categoryName: "Geography & World",
      difficulty: 1,
      question: "What is the capital city of Japan?",
      options: ["Kyoto", "Osaka", "Tokyo", "Yokohama"],
      answer: 2,
      explanation: "Tokyo has been the capital and the seat of the Japanese government since 1868."
    },
    {
      id: "geo_3",
      category: "geography",
      categoryName: "Geography & World",
      difficulty: 2,
      question: "Which African country has the highest population?",
      options: ["South Africa", "Nigeria", "Egypt", "Kenya"],
      answer: 1,
      explanation: "Nigeria has the largest population in Africa, exceeding 220 million people."
    },
    {
      id: "geo_4",
      category: "geography",
      categoryName: "Geography & World",
      difficulty: 2,
      question: "What mountain range separates Europe from Asia?",
      options: ["The Alps", "The Andes", "The Ural Mountains", "The Himalayas"],
      answer: 2,
      explanation: "The Ural Mountains in Russia run north to south and form a conventional boundary between Europe and Asia."
    },
    {
      id: "geo_5",
      category: "geography",
      categoryName: "Geography & World",
      difficulty: 3,
      question: "Which of the following countries is landlocked (completely surrounded by land)?",
      options: ["Paraguay", "Uruguay", "Suriname", "Guyana"],
      answer: 0,
      explanation: "Paraguay and Bolivia are the only two landlocked nations in South America."
    },
    {
      id: "geo_6",
      category: "geography",
      categoryName: "Geography & World",
      difficulty: 3,
      question: "What is the deepest known location on Earth?",
      options: ["Java Trench", "Challenger Deep", "Puerto Rico Trench", "Milwaukee Deep"],
      answer: 1,
      explanation: "Challenger Deep in the Mariana Trench reaches approximately 10,928 meters (~35,853 feet) below sea level."
    }
  ]
};

// Helper methods for questions
const QuestionManager = {
  getAllCategories() {
    return [
      { id: "all", name: "Mixed Arena", icon: "⚔️", desc: "Test your wits across all disciplines" },
      { id: "cs", name: "Computer Science", icon: "💻", desc: "Algorithms, web, systems & syntax" },
      { id: "science", name: "Science & Nature", icon: "🔬", desc: "Physics, biology, chemistry & cosmos" },
      { id: "history", name: "World History", icon: "📜", desc: "Civilizations, revolutions & milestones" },
      { id: "math", name: "Mathematics & Logic", icon: "📐", desc: "Algebra, calculus, riddles & probability" },
      { id: "geography", name: "World Geography", icon: "🌍", desc: "Nations, topography, capitals & wonders" }
    ];
  },

  getAllQuestions() {
    let pool = [];
    Object.keys(QUESTION_BANK).forEach(cat => {
      pool = pool.concat(QUESTION_BANK[cat]);
    });

    // Also include custom decks from local storage if available
    const customDecks = JSON.parse(localStorage.getItem('quizmaster_custom_decks') || '[]');
    customDecks.forEach(deck => {
      if (deck.questions && Array.isArray(deck.questions)) {
        deck.questions.forEach(q => {
          pool.push({
            ...q,
            category: deck.id,
            categoryName: deck.title
          });
        });
      }
    });

    return pool;
  },

  getQuestionsByCategory(catId) {
    if (!catId || catId === 'all') {
      return this.getAllQuestions();
    }
    if (QUESTION_BANK[catId]) {
      return [...QUESTION_BANK[catId]];
    }
    // Check custom decks
    const customDecks = JSON.parse(localStorage.getItem('quizmaster_custom_decks') || '[]');
    const foundDeck = customDecks.find(d => d.id === catId);
    if (foundDeck && foundDeck.questions) {
      return foundDeck.questions.map(q => ({
        ...q,
        category: foundDeck.id,
        categoryName: foundDeck.title
      }));
    }
    return this.getAllQuestions();
  },

  getRandomSubset(questions, count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  getDailyChallengeQuestions() {
    // Generate deterministic questions for the day based on date string
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = ((hash << 5) - hash) + today.charCodeAt(i);
      hash |= 0;
    }

    const all = this.getAllQuestions();
    const count = 5;
    const selected = [];
    const usedIndices = new Set();

    for (let i = 0; i < count; i++) {
      let idx = Math.abs((hash * (i + 1) * 31) % all.length);
      while (usedIndices.has(idx) && usedIndices.size < all.length) {
        idx = (idx + 1) % all.length;
      }
      usedIndices.add(idx);
      selected.push(all[idx]);
    }

    return selected;
  }
};
