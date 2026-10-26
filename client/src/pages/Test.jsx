import React, { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

/*
  HashLab Exam Practice

  Question bank is designed around the hashing topics appearing
  in the VIT Data Structures & Algorithms curriculum and publicly
  indexed VIT-style CAT/FAT material.

  These are practice questions, not claimed copies of any upcoming
  VIT examination.
*/

const questionBank = [
  // ============================================================
  // CAT-1
  // ============================================================

  {
    id: "cat1-01",
    exam: "CAT-1",
    marks: 5,
    topic: "Hash Functions",
    difficulty: "Easy",
    type: "Short Answer",
    question:
      "What is hashing? Explain the purpose of a hash function and state any two properties of a good hash function.",
    answer:
      "Hashing is a technique used to map a key to a location in a hash table using a hash function. A good hash function should distribute keys uniformly across the table and should be efficient to compute.",
    keyPoints: [
      "Maps a key to a hash-table location.",
      "Should distribute keys uniformly.",
      "Should be fast and deterministic.",
      "Should minimize unnecessary collisions.",
    ],
  },

  {
    id: "cat1-02",
    exam: "CAT-1",
    marks: 5,
    topic: "Hash Functions",
    difficulty: "Easy",
    type: "Numerical",
    question:
      "A hash table contains 7 locations and uses h(k) = k mod 7. Find the hash location of the keys 50, 700, 76 and 85.",
    answer:
      "50 mod 7 = 1\n700 mod 7 = 0\n76 mod 7 = 6\n85 mod 7 = 1\n\nTherefore the locations are 1, 0, 6 and 1 respectively.",
    keyPoints: [
      "50 → 1",
      "700 → 0",
      "76 → 6",
      "85 → 1",
      "50 and 85 collide at location 1.",
    ],
  },

  {
    id: "cat1-03",
    exam: "CAT-1",
    marks: 8,
    topic: "Separate Chaining",
    difficulty: "Medium",
    type: "Problem",
    question:
      "Using h(k) = k mod 7, insert the keys 50, 700, 76, 85 and 92 using separate chaining. Show the final hash table and identify the collisions.",
    answer:
      "Hash values:\n50 mod 7 = 1\n700 mod 7 = 0\n76 mod 7 = 6\n85 mod 7 = 1\n92 mod 7 = 1\n\nFinal table:\n0 → 700\n1 → 50 → 85 → 92\n2 → Empty\n3 → Empty\n4 → Empty\n5 → Empty\n6 → 76\n\nCollisions occur at location 1.",
    keyPoints: [
      "Location 0 contains 700.",
      "Location 1 contains 50, 85 and 92.",
      "Location 6 contains 76.",
      "85 collides with 50.",
      "92 also collides at location 1.",
    ],
  },

  {
    id: "cat1-04",
    exam: "CAT-1",
    marks: 8,
    topic: "Linear Probing",
    difficulty: "Medium",
    type: "Problem",
    question:
      "A hash table of size 7 uses h(k) = k mod 7 and linear probing. Insert 50, 700, 76, 85 and 92. Show every probe and the final table.",
    answer:
      "50 → h(50) = 1 → place at 1.\n700 → h(700) = 0 → place at 0.\n76 → h(76) = 6 → place at 6.\n85 → h(85) = 1 → collision at 1 → probe 2 → place at 2.\n92 → h(92) = 1 → collision at 1 → probe 2 → collision → probe 3 → place at 3.\n\nFinal table:\n0 → 700\n1 → 50\n2 → 85\n3 → 92\n4 → Empty\n5 → Empty\n6 → 76",
    keyPoints: [
      "Linear probing checks consecutive locations.",
      "85 requires one additional probe.",
      "92 requires two additional probes.",
      "Final occupied locations are 0, 1, 2, 3 and 6.",
    ],
  },

  {
    id: "cat1-05",
    exam: "CAT-1",
    marks: 5,
    topic: "Collision Resolution",
    difficulty: "Medium",
    type: "Theory",
    question:
      "Differentiate between separate chaining and open addressing.",
    answer:
      "Separate chaining stores collided keys in a chain associated with the same hash location. Open addressing stores every key inside the hash table itself and searches alternative positions when a collision occurs. Linear probing, quadratic probing and double hashing are open-addressing techniques.",
    keyPoints: [
      "Separate chaining uses an external chain/bucket structure.",
      "Open addressing keeps entries inside the table.",
      "Open addressing requires probing.",
      "Separate chaining can store multiple entries at one location.",
    ],
  },

  // ============================================================
  // CAT-2
  // ============================================================

  {
    id: "cat2-01",
    exam: "CAT-2",
    marks: 8,
    topic: "Linear Probing",
    difficulty: "Medium",
    type: "Problem",
    question:
      "A hash table of size 7 uses h(k) = k mod 7 with linear probing. Insert the keys 50, 85, 92, 73 and 101. Show the probe sequence for every key and construct the final table.",
    answer:
      "50 → 1 → place at 1.\n85 → 1 → collision → 2 → place at 2.\n92 → 1 → collision → 2 → collision → 3 → place at 3.\n73 → 3 → collision → 4 → place at 4.\n101 → 3 → collision → 4 → collision → 5 → place at 5.\n\nFinal table:\n0 → Empty\n1 → 50\n2 → 85\n3 → 92\n4 → 73\n5 → 101\n6 → Empty",
    keyPoints: [
      "50 occupies location 1.",
      "85 probes 1 → 2.",
      "92 probes 1 → 2 → 3.",
      "73 probes 3 → 4.",
      "101 probes 3 → 4 → 5.",
    ],
  },

  {
    id: "cat2-02",
    exam: "CAT-2",
    marks: 8,
    topic: "Quadratic Probing",
    difficulty: "Hard",
    type: "Problem",
    question:
      "A hash table of size 7 uses h(k) = k mod 7 and quadratic probing with the probe formula (h(k) + i²) mod 7. Insert 50, 85 and 92. Show the probe sequence and final positions.",
    answer:
      "50: h(50) = 1 → position 1.\n\n85: h(85) = 1.\ni = 1 → (1 + 1²) mod 7 = 2.\nTherefore 85 is placed at 2.\n\n92: h(92) = 1.\ni = 1 → 2, but position 2 is occupied.\ni = 2 → (1 + 4) mod 7 = 5.\nTherefore 92 is placed at 5.\n\nFinal table:\n1 → 50\n2 → 85\n5 → 92",
    keyPoints: [
      "Quadratic probing uses a quadratic offset.",
      "The first probe after collision uses i = 1.",
      "The second probe uses i = 2.",
      "92 reaches position 5.",
    ],
  },

  {
    id: "cat2-03",
    exam: "CAT-2",
    marks: 8,
    topic: "Double Hashing",
    difficulty: "Hard",
    type: "Problem",
    question:
      "Explain how double hashing resolves collisions. For a table of size 7, use h1(k) = k mod 7 and h2(k) = 1 + (k mod 6). Explain how the second hash function determines the next probe position.",
    answer:
      "Double hashing uses two hash functions. The first function determines the initial position. The second function determines the probe step size.\n\nThe general probe position is:\n(h1(k) + i × h2(k)) mod 7\n\nFor example, for k = 85:\nh1(85) = 1\nh2(85) = 1 + (85 mod 6) = 1 + 1 = 2.\n\nThe probe sequence therefore starts at 1 and then advances by 2 modulo 7.",
    keyPoints: [
      "h1 determines the initial location.",
      "h2 determines the step size.",
      "Probe formula uses i × h2(k).",
      "Double hashing reduces primary clustering compared with linear probing.",
    ],
  },

  {
    id: "cat2-04",
    exam: "CAT-2",
    marks: 10,
    topic: "Rehashing",
    difficulty: "Hard",
    type: "Problem",
    question:
      "A hash table initially contains 5 buckets. The table is rehashed whenever the load factor becomes greater than 0.7. The new table has twice the number of buckets. Explain what happens during rehashing and show the bucket count after two rehash operations.",
    answer:
      "During rehashing, a larger table is created and all existing keys are inserted again using the hash function with the new table size.\n\nInitial bucket count = 5.\nAfter first rehash = 10.\nAfter second rehash = 20.\n\nTherefore, after two rehash operations the table contains 20 buckets.",
    keyPoints: [
      "Create a larger table.",
      "Recalculate the hash position for every existing key.",
      "Insert all keys into the new table.",
      "5 → 10 → 20 buckets.",
    ],
  },

  {
    id: "cat2-05",
    exam: "CAT-2",
    marks: 10,
    topic: "Extendible Hashing",
    difficulty: "Hard",
    type: "Problem",
    question:
      "An extendible hash directory has global depth 2. How many directory entries are present? Explain what happens to the directory when a bucket overflows and its local depth equals the global depth.",
    answer:
      "The number of directory entries is 2^global depth.\n\n2² = 4 directory entries.\n\nIf a bucket overflows and its local depth equals the global depth, the directory must first be doubled. The global depth increases by one. The overflowing bucket is then split using the additional hash bit.",
    keyPoints: [
      "Global depth = 2.",
      "Directory size = 2² = 4.",
      "Local depth equal to global depth means directory doubling is required.",
      "Global depth increases after doubling.",
      "The bucket is then split.",
    ],
  },

  {
    id: "cat2-06",
    exam: "CAT-2",
    marks: 10,
    topic: "Extendible Hashing",
    difficulty: "Hard",
    type: "Problem",
    question:
      "Explain the difference between global depth and local depth in extendible hashing. Why can multiple directory entries point to the same physical bucket?",
    answer:
      "Global depth represents the number of hash bits currently used by the directory. Local depth represents the number of hash bits used to identify a particular bucket.\n\nMultiple directory entries can point to the same physical bucket because not every bucket needs to be split to the same depth. Directory entries sharing the same relevant prefix/suffix bits can therefore reference the same physical bucket.",
    keyPoints: [
      "Global depth applies to the directory.",
      "Local depth applies to an individual bucket.",
      "Different buckets can have different local depths.",
      "Multiple directory entries may reference one physical bucket.",
    ],
  },

  {
    id: "cat2-07",
    exam: "CAT-2",
    marks: 8,
    topic: "Linear Hashing",
    difficulty: "Hard",
    type: "Theory + Problem",
    question:
      "What is the purpose of the split pointer in linear hashing? Explain how the split pointer moves as buckets are split.",
    answer:
      "The split pointer identifies the next bucket that should be split. Linear hashing expands incrementally instead of doubling the complete directory at once.\n\nAfter a bucket is split, the split pointer moves to the next bucket. When all buckets in the current level have been split, the level increases and the split pointer starts again from the beginning.",
    keyPoints: [
      "Split pointer identifies the next bucket to split.",
      "Buckets are split incrementally.",
      "The pointer advances after each split.",
      "After a complete round of splits, the level increases.",
      "The pointer resets for the next round.",
    ],
  },

  {
    id: "cat2-08",
    exam: "CAT-2",
    marks: 10,
    topic: "Hashing Comparison",
    difficulty: "Hard",
    type: "Long Answer",
    question:
      "Compare linear probing, quadratic probing and double hashing with respect to probe sequence, clustering and collision handling.",
    answer:
      "Linear probing checks consecutive positions and is simple to implement, but it can suffer from primary clustering.\n\nQuadratic probing uses quadratic offsets, reducing primary clustering but potentially producing secondary clustering.\n\nDouble hashing uses a second hash function as the probe step. It generally produces a more distributed probe sequence and reduces clustering compared with linear probing.",
    keyPoints: [
      "Linear: consecutive positions.",
      "Quadratic: quadratic offsets.",
      "Double hashing: second hash function.",
      "Linear probing has primary clustering.",
      "Quadratic probing can have secondary clustering.",
      "Double hashing generally provides better probe distribution.",
    ],
  },

  // ============================================================
  // FAT
  // ============================================================

  {
    id: "fat-01",
    exam: "FAT",
    marks: 15,
    topic: "Hash Table Construction",
    difficulty: "Hard",
    type: "Long Problem",
    question:
      "Given h(k) = k mod 7, insert the keys 50, 700, 76, 85, 92, 73 and 101 using separate chaining. Construct the complete final hash table and calculate the number of collisions.",
    answer:
      "Hash calculations:\n50 mod 7 = 1\n700 mod 7 = 0\n76 mod 7 = 6\n85 mod 7 = 1\n92 mod 7 = 1\n73 mod 7 = 3\n101 mod 7 = 3\n\nFinal table:\n0 → 700\n1 → 50 → 85 → 92\n2 → Empty\n3 → 73 → 101\n4 → Empty\n5 → Empty\n6 → 76\n\nThere are 4 collision insertions after the first key occupies each location: 85, 92 and 101 cause collision events, with 92 colliding with an already chained location as well.",
    keyPoints: [
      "Bucket 0 → 700.",
      "Bucket 1 → 50, 85, 92.",
      "Bucket 3 → 73, 101.",
      "Bucket 6 → 76.",
      "Other buckets are empty.",
    ],
  },

  {
    id: "fat-02",
    exam: "FAT",
    marks: 15,
    topic: "Open Addressing",
    difficulty: "Hard",
    type: "Long Problem",
    question:
      "Using a hash table of size 7 and h(k) = k mod 7, insert 50, 85, 92, 73 and 101 using linear probing. Show the complete probe sequence for every key and the final table.",
    answer:
      "50 → 1.\n85 → 1 → 2.\n92 → 1 → 2 → 3.\n73 → 3 → 4.\n101 → 3 → 4 → 5.\n\nFinal table:\n0 → Empty\n1 → 50\n2 → 85\n3 → 92\n4 → 73\n5 → 101\n6 → Empty",
    keyPoints: [
      "Show the initial hash position.",
      "Show each collision.",
      "Show each subsequent probe.",
      "Construct the final table.",
    ],
  },

  {
    id: "fat-03",
    exam: "FAT",
    marks: 15,
    topic: "Extendible Hashing",
    difficulty: "Hard",
    type: "Long Problem",
    question:
      "Explain the insertion process in extendible hashing. Your answer should describe global depth, local depth, directory doubling and bucket splitting.",
    answer:
      "Extendible hashing uses a directory whose size is 2^global depth. Each physical bucket has its own local depth.\n\nWhen a bucket overflows, it is split. If its local depth is smaller than the global depth, the bucket can be split without doubling the directory. If local depth equals global depth, the directory must first be doubled, increasing global depth by one. The overflowing bucket is then split and its keys are redistributed according to the new hash bits.",
    keyPoints: [
      "Directory size = 2^global depth.",
      "Each bucket has a local depth.",
      "Overflow causes a bucket split.",
      "If local depth = global depth, double the directory first.",
      "Redistribute keys after splitting.",
    ],
  },

  {
    id: "fat-04",
    exam: "FAT",
    marks: 12,
    topic: "Rehashing",
    difficulty: "Hard",
    type: "Long Answer",
    question:
      "Explain rehashing with a suitable example. Why can't the old bucket positions simply be copied into the new table?",
    answer:
      "Rehashing creates a larger hash table and inserts all existing keys again using the hash function with the new table size.\n\nOld positions cannot simply be copied because the hash calculation normally depends on the table size. For example, with h(k) = k mod m, changing m changes the result of the hash function. Therefore the keys must be redistributed.",
    keyPoints: [
      "Create a larger table.",
      "Use the new table size in the hash function.",
      "Recalculate positions for all existing keys.",
      "Redistribute the keys.",
    ],
  },

  {
    id: "fat-05",
    exam: "FAT",
    marks: 10,
    topic: "Load Factor",
    difficulty: "Medium",
    type: "Numerical",
    question:
      "A hash table contains 14 keys and has a total capacity of 20 entries. Calculate the load factor. Explain what a high load factor generally means for an open-addressing hash table.",
    answer:
      "Load factor = number of stored keys / total table capacity.\n\nLoad factor = 14 / 20 = 0.70.\n\nA high load factor means the table is becoming crowded. In open addressing, this generally increases the number of probes required to find an empty location and can increase collision-related performance costs.",
    keyPoints: [
      "Load factor = 14 / 20.",
      "Load factor = 0.70 or 70%.",
      "Higher occupancy generally means more probing in open addressing.",
    ],
  },

  {
    id: "fat-06",
    exam: "FAT",
    marks: 15,
    topic: "Complete Hashing Analysis",
    difficulty: "Hard",
    type: "Long Problem",
    question:
      "Explain and compare separate chaining, linear probing, quadratic probing, double hashing and rehashing. For each method, describe how a collision is handled.",
    answer:
      "Separate chaining stores collided keys in a chain associated with the hash location.\n\nLinear probing checks the next table positions sequentially.\n\nQuadratic probing checks positions using quadratic offsets.\n\nDouble hashing uses a second hash function to determine the probe step.\n\nRehashing creates a larger table and redistributes existing keys using the new table size. Rehashing is an expansion strategy rather than merely a collision-resolution probe sequence.",
    keyPoints: [
      "Separate chaining → chain.",
      "Linear probing → next consecutive location.",
      "Quadratic probing → quadratic offset.",
      "Double hashing → second hash function.",
      "Rehashing → larger table and redistribution.",
    ],
  },
];

const examInfo = {
  CAT1: {
    label: "CAT-1",
    description: "Foundation and first-level hashing problems.",
  },
  CAT2: {
    label: "CAT-2",
    description:
      "Collision resolution, rehashing and dynamic hashing problems.",
  },
  FAT: {
    label: "FAT",
    description:
      "Long-answer and complete hashing-construction practice.",
  },
};

function Test() {
  const [examFilter, setExamFilter] = useState("ALL");
  const [topicFilter, setTopicFilter] = useState("ALL");

  const [mode, setMode] = useState("learn");

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState({});

  const [showAnswer, setShowAnswer] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [marks, setMarks] = useState(0);

  const [answerChecked, setAnswerChecked] = useState({});

  const filteredQuestions = useMemo(() => {
    return questionBank.filter((question) => {
      const examMatch =
        examFilter === "ALL" ||
        question.exam === examFilter;

      const topicMatch =
        topicFilter === "ALL" ||
        question.topic === topicFilter;

      return examMatch && topicMatch;
    });
  }, [examFilter, topicFilter]);

  const topics = useMemo(() => {
    return [...new Set(questionBank.map((question) => question.topic))];
  }, []);

  const question =
    filteredQuestions[currentIndex] || filteredQuestions[0];

  const answeredCount = filteredQuestions.filter(
    (item) =>
      answers[item.id] &&
      answers[item.id].trim() !== ""
  ).length;

  const totalMarks = filteredQuestions.reduce(
    (total, item) => total + item.marks,
    0
  );

  const currentAnswer = question
    ? answers[question.id] || ""
    : "";

  const handleExamChange = (value) => {
    setExamFilter(value);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSubmitted(false);
    setAnswers({});
    setAnswerChecked({});
    setMarks(0);
  };

  const handleTopicChange = (value) => {
    setTopicFilter(value);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSubmitted(false);
    setAnswers({});
    setAnswerChecked({});
    setMarks(0);
  };

  const handleAnswerChange = (event) => {
    if (submitted) return;

    setAnswers((previous) => ({
      ...previous,
      [question.id]: event.target.value,
    }));

    setAnswerChecked((previous) => ({
      ...previous,
      [question.id]: false,
    }));
  };

  const checkAnswer = () => {
    if (!currentAnswer.trim()) {
      return;
    }

    setAnswerChecked((previous) => ({
      ...previous,
      [question.id]: true,
    }));

    setShowAnswer(true);
  };

  const nextQuestion = () => {
    setShowAnswer(false);

    setCurrentIndex((previous) =>
      Math.min(
        previous + 1,
        filteredQuestions.length - 1
      )
    );
  };

  const previousQuestion = () => {
    setShowAnswer(false);

    setCurrentIndex((previous) =>
      Math.max(previous - 1, 0)
    );
  };

  const startTest = () => {
    setMode("test");
    setCurrentIndex(0);
    setAnswers({});
    setShowAnswer(false);
    setSubmitted(false);
    setAnswerChecked({});
    setMarks(0);
  };

  const startLearning = () => {
    setMode("learn");
    setCurrentIndex(0);
    setShowAnswer(false);
    setSubmitted(false);
  };

  const calculateMarks = () => {
    /*
      This is intentionally a simple keyword/coverage evaluator.
      It is not presented as an official VIT marking scheme.
    */

    let calculatedMarks = 0;

    filteredQuestions.forEach((item) => {
      const userAnswer = (
        answers[item.id] || ""
      ).toLowerCase();

      if (!userAnswer.trim()) {
        return;
      }

      const keywords = item.keyPoints.map((point) =>
        point
          .toLowerCase()
          .replace(/[→=().,]/g, " ")
          .split(/\s+/)
          .filter((word) => word.length > 3)
      );

      const flattenedKeywords = keywords.flat();

      const matched = flattenedKeywords.filter(
        (keyword) =>
          userAnswer.includes(keyword)
      );

      const uniqueMatches = [
        ...new Set(matched),
      ];

      const coverage =
        flattenedKeywords.length === 0
          ? 0
          : uniqueMatches.length /
            new Set(flattenedKeywords).size;

      const earned = Math.round(
        Math.min(coverage, 1) * item.marks
      );

      calculatedMarks += earned;
    });

    return calculatedMarks;
  };

  const submitTest = () => {
    const calculatedMarks = calculateMarks();

    setMarks(calculatedMarks);
    setSubmitted(true);
    setMode("review");
    setCurrentIndex(0);
    setShowAnswer(true);
  };

  const resetTest = () => {
    setAnswers({});
    setAnswerChecked({});
    setCurrentIndex(0);
    setShowAnswer(false);
    setSubmitted(false);
    setMarks(0);
    setMode("learn");
  };

  const openInSimulator = () => {
    if (!question) return;

    const simulatorAlgorithm =
      question.topic === "Separate Chaining"
        ? "separate"
        : question.topic === "Linear Probing"
        ? "linear"
        : question.topic === "Quadratic Probing"
        ? "quadratic"
        : question.topic === "Double Hashing"
        ? "double"
        : question.topic === "Rehashing"
        ? "rehashing"
        : question.topic === "Extendible Hashing"
        ? "extendible"
        : question.topic === "Linear Hashing"
        ? "linear-hashing"
        : "separate";

    window.location.href =
      `/simulator?algorithm=${simulatorAlgorithm}`;
  };

  if (!question) {
    return (
      <main className="simulator-page">
        <section className="simulator-header">
          <span className="section-label">
            HASHLAB TEST LAB
          </span>

          <h1>No questions found</h1>

          <p>
            Change the selected filters to continue.
          </p>
        </section>
      </main>
    );
  }

  const isLastQuestion =
    currentIndex === filteredQuestions.length - 1;

  return (
    <main className="simulator-page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="simulator-header">
        <span className="section-label">
          HASHLAB • EXAM PRACTICE
        </span>

        <h1>Hashing Test Lab</h1>

        <p>
          Learn the concept, write your own answer,
          reveal the model solution and practise
          CAT-1, CAT-2 and FAT-style hashing problems.
        </p>
      </section>

      {/* ======================================================
          EXAM SELECTION
      ====================================================== */}

      <section className="simulator-controls">
        <div className="control-card">
          <h2>Choose Your Practice</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="exam">
                Exam
              </label>

              <select
                id="exam"
                value={examFilter}
                onChange={(event) =>
                  handleExamChange(
                    event.target.value
                  )
                }
              >
                <option value="ALL">
                  All Questions
                </option>

                <option value="CAT-1">
                  CAT-1
                </option>

                <option value="CAT-2">
                  CAT-2
                </option>

                <option value="FAT">
                  FAT
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="topic">
                Topic
              </label>

              <select
                id="topic"
                value={topicFilter}
                onChange={(event) =>
                  handleTopicChange(
                    event.target.value
                  )
                }
              >
                <option value="ALL">
                  All Topics
                </option>

                {topics.map((topic) => (
                  <option
                    key={topic}
                    value={topic}
                  >
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mode">
                Practice Mode
              </label>

              <select
                id="mode"
                value={mode}
                onChange={(event) => {
                  const newMode =
                    event.target.value;

                  setMode(newMode);
                  setShowAnswer(
                    newMode === "review"
                  );
                }}
              >
                <option value="learn">
                  Learn & Practice
                </option>

                <option value="test">
                  Take Test
                </option>

                {submitted && (
                  <option value="review">
                    Review Answers
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className="control-actions">
            <div className="operation-buttons">
              <button
                type="button"
                onClick={startLearning}
              >
                <BookOpen size={17} />
                Learn
              </button>

              <button
                type="button"
                onClick={startTest}
              >
                <Trophy size={17} />
                Start Test
              </button>

              {submitted && (
                <button
                  type="button"
                  onClick={resetTest}
                >
                  <RotateCcw size={17} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          EXAM CARDS
      ====================================================== */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {Object.entries(examInfo).map(
          ([key, info]) => {
            const count =
              questionBank.filter(
                (item) =>
                  item.exam === info.label
              ).length;

            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  handleExamChange(info.label)
                }
                style={{
                  textAlign: "left",
                  padding: "20px",
                  borderRadius: "16px",
                  border:
                    examFilter === info.label
                      ? "2px solid var(--accent, #6366f1)"
                      : "1px solid var(--border, #e5e7eb)",
                  background:
                    "var(--surface, #fff)",
                  cursor: "pointer",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: "1.05rem",
                    marginBottom: "8px",
                  }}
                >
                  {info.label}
                </strong>

                <span
                  style={{
                    display: "block",
                    lineHeight: 1.5,
                    marginBottom: "10px",
                  }}
                >
                  {info.description}
                </span>

                <small>
                  {count} practice questions
                </small>
              </button>
            );
          }
        )}
      </section>

      {/* ======================================================
          METRICS
      ====================================================== */}

      <section className="metrics-grid">
        <div className="metric-card">
          <span>Mode</span>

          <strong>
            {mode === "learn"
              ? "Learn"
              : mode === "test"
              ? "Test"
              : "Review"}
          </strong>
        </div>

        <div className="metric-card">
          <span>Questions</span>

          <strong>
            {filteredQuestions.length}
          </strong>
        </div>

        <div className="metric-card">
          <span>Answered</span>

          <strong>
            {answeredCount}/
            {filteredQuestions.length}
          </strong>
        </div>

        <div className="metric-card">
          <span>Marks</span>

          <strong>
            {submitted
              ? `${marks}/${totalMarks}`
              : `${totalMarks}`}
          </strong>
        </div>
      </section>

      {/* ======================================================
          QUESTION
      ====================================================== */}

      <section className="hash-table-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              {question.exam} •{" "}
              {question.topic}
            </span>

            <h2>
              Question {currentIndex + 1}
            </h2>
          </div>

          <span className="bucket-count-label">
            {question.marks} Marks
          </span>
        </div>

        <div
          style={{
            maxWidth: "950px",
            margin: "0 auto",
          }}
        >
          {/* Question card */}

          <div
            style={{
              padding: "30px",
              borderRadius: "18px",
              background:
                "var(--surface, #ffffff)",
              border:
                "1px solid var(--border, #e5e7eb)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <strong>
                {question.type}
              </strong>

              <span>
                {question.difficulty}
              </span>
            </div>

            <h3
              style={{
                fontSize: "1.18rem",
                lineHeight: 1.7,
                marginBottom: "26px",
              }}
            >
              {question.question}
            </h3>

            {/* Answer input */}

            <label
              htmlFor="answerBox"
              style={{
                display: "block",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              Your Answer
            </label>

            <textarea
              id="answerBox"
              value={currentAnswer}
              onChange={handleAnswerChange}
              disabled={submitted}
              placeholder={
                mode === "learn"
                  ? "Write your answer here. Explain your steps and calculations..."
                  : "Write your exam answer here..."
              }
              rows={10}
              style={{
                width: "100%",
                resize: "vertical",
                padding: "16px",
                borderRadius: "12px",
                border:
                  "1px solid var(--border, #d1d5db)",
                background:
                  "var(--background, #fff)",
                fontSize: "1rem",
                lineHeight: 1.6,
                boxSizing: "border-box",
              }}
            />

            {/* Answer controls */}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "18px",
              }}
            >
              <button
                type="button"
                onClick={checkAnswer}
                disabled={
                  !currentAnswer.trim()
                }
              >
                <CheckCircle2 size={17} />
                Check My Answer
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowAnswer(
                    (previous) => !previous
                  )
                }
              >
                <Eye size={17} />

                {showAnswer
                  ? "Hide Model Answer"
                  : "Show Model Answer"}
              </button>

              <button
                type="button"
                onClick={openInSimulator}
              >
                <ExternalLink size={17} />
                Open in Simulator
              </button>
            </div>

            {/* ==================================================
                MODEL ANSWER
            ================================================== */}

            {showAnswer && (
              <div
                style={{
                  marginTop: "28px",
                  padding: "24px",
                  borderRadius: "16px",
                  background:
                    "rgba(59, 130, 246, 0.07)",
                  border:
                    "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "14px",
                  }}
                >
                  <CheckCircle2 size={20} />

                  <strong>
                    Model Answer
                  </strong>
                </div>

                <div
                  style={{
                    whiteSpace: "pre-line",
                    lineHeight: 1.8,
                  }}
                >
                  {question.answer}
                </div>

                {/* Key points */}

                <div
                  style={{
                    marginTop: "22px",
                  }}
                >
                  <strong>
                    Points to include:
                  </strong>

                  <ul
                    style={{
                      marginTop: "10px",
                      paddingLeft: "22px",
                      lineHeight: 1.8,
                    }}
                  >
                    {question.keyPoints.map(
                      (point) => (
                        <li key={point}>
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* ==================================================
                CHECKED ANSWER
            ================================================== */}

            {answerChecked[question.id] &&
              !showAnswer && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "18px",
                    borderRadius: "14px",
                    background:
                      "rgba(34, 197, 94, 0.08)",
                  }}
                >
                  <strong>
                    Your answer has been checked.
                  </strong>

                  <p>
                    Compare your response with
                    the model answer above to
                    identify missing points.
                  </p>
                </div>
              )}
          </div>

          {/* ==================================================
              NAVIGATION
          ================================================== */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              gap: "12px",
              marginTop: "22px",
            }}
          >
            <button
              type="button"
              onClick={previousQuestion}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            {!isLastQuestion ? (
              <button
                type="button"
                onClick={nextQuestion}
              >
                Next Question
                <ChevronRight size={17} />
              </button>
            ) : mode === "test" &&
              !submitted ? (
              <button
                type="button"
                onClick={submitTest}
              >
                <Trophy size={17} />
                Submit Test
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex(0)
                }
              >
                <RotateCcw size={17} />
                Start Again
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          TEST RESULT
      ====================================================== */}

      {submitted && (
        <section
          className="simulator-message"
          style={{
            marginTop: "24px",
          }}
        >
          <strong>
            Test Completed
          </strong>

          <span>
            Your practice result is{" "}
            {marks}/{totalMarks} marks.
            Review each question to compare
            your answer with the model solution.
          </span>
        </section>
      )}

      {/* ======================================================
          IMPORTANT NOTE
      ====================================================== */}

      <section
        style={{
          marginTop: "30px",
          padding: "20px",
          borderRadius: "16px",
          background:
            "rgba(148, 163, 184, 0.08)",
          border:
            "1px solid var(--border, #e5e7eb)",
          lineHeight: 1.7,
        }}
      >
        <strong>
          Practice-question note
        </strong>

        <p>
          These questions are designed for
          VIT-style hashing preparation from
          the documented syllabus and publicly
          indexed past-paper patterns. They are
          not represented as the exact questions
          from an upcoming CAT or FAT.
        </p>
      </section>
    </main>
  );
}

export default Test;