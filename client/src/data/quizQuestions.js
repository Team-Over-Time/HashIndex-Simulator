// client/src/data/quizQuestions.js

const makeQuestion = (
  id,
  topic,
  difficulty,
  tag,
  question,
  options,
  answer,
  explanation
) => ({
  id,
  topic,
  difficulty,
  tag,
  question,
  options,
  answer,
  explanation,
  sourceType: "original-practice",
  sourceName: "HashLab original question bank",
  sourceYear: null,
  sourcePaper: null,
  sourceQuestionNumber: null,
  sourceUrl: null,
});

// These are original HashLab practice questions, not reproduced past-paper questions.
// Add exam/year/question-number/sourceUrl only after checking an official paper.
const allQuizQuestions = [
  // ───────────── 1. HASHING FUNDAMENTALS (1–9) ─────────────
  makeQuestion(1, "Hashing Fundamentals", "Easy", "Original HashLab practice",
    "What is the primary purpose of a hash function in a hash table?",
    ["Sort keys", "Map keys to table locations", "Encrypt keys", "Compress values"],
    1, "A hash function maps a key to an index or location in a hash table."),

  makeQuestion(2, "Hashing Fundamentals", "Easy", "Original HashLab practice",
    "A hash table contains 10 slots numbered 0 to 9. Which is a valid index?",
    ["10", "-1", "7", "12"],
    2, "Valid indices range from 0 through 9."),

  makeQuestion(3, "Hashing Fundamentals", "Easy", "Original HashLab practice",
    "For h(k) = k mod 7, what is h(50)?",
    ["0", "1", "2", "7"],
    1, "50 = 7 × 7 + 1, so the remainder is 1."),

  makeQuestion(4, "Hashing Fundamentals", "Medium", "Original HashLab practice",
    "For h(k) = k mod 11, what is h(100)?",
    ["0", "1", "10", "11"],
    1, "100 = 11 × 9 + 1, so the remainder is 1 (option B)."),

  makeQuestion(5, "Hashing Fundamentals", "Easy", "Original HashLab practice",
    "When two different keys map to the same table index, this is called:",
    ["Overflow", "Collision", "Sorting", "Traversal"],
    1, "A collision occurs when two keys map to the same index."),

  makeQuestion(6, "Hashing Fundamentals", "Medium", "Original HashLab practice",
    "A table stores 30 keys in 50 slots. What is its load factor?",
    ["0.6", "0.4", "1.67", "20"],
    0, "Load factor = number of stored keys / number of slots = 30/50 = 0.6."),

  makeQuestion(7, "Hashing Fundamentals", "Medium", "Original HashLab practice",
    "Which property is desirable for a hash function?",
    ["Every key maps to the same slot", "Keys distribute reasonably uniformly",
     "It must sort keys", "It must use recursion"],
    1, "Uniform distribution helps reduce collisions."),

  makeQuestion(8, "Hashing Fundamentals", "Medium", "Original HashLab practice",
    "If n keys are stored in m slots, the load factor for a simple table is:",
    ["m/n", "n + m", "n/m", "n × m"],
    2, "The load factor is the number of stored keys divided by table capacity."),

  makeQuestion(9, "Hashing Fundamentals", "Hard", "Original HashLab practice",
    "Which statement about hashing is generally correct?",
    ["Every search is guaranteed O(1)", "Average search can be O(1) with good hashing",
     "Hashing always sorts the data", "Hash tables never use extra space"],
    1, "Expected constant-time operations are possible under suitable assumptions, but worst cases can be linear."),

  // ───────────── 2. SEPARATE CHAINING (10–18) ─────────────
  makeQuestion(10, "Separate Chaining", "Easy", "Original HashLab practice",
    "Separate chaining handles collisions by:",
    ["Moving every key to the next slot", "Keeping multiple keys in a chain at a slot",
     "Increasing every key by one", "Deleting the older key"],
    1, "Each table slot refers to a collection of keys that hash to that slot."),

  makeQuestion(11, "Separate Chaining", "Easy", "Original HashLab practice",
    "With h(k) = k mod 5, where is key 17 stored?",
    ["0", "1", "2", "3"],
    2, "17 mod 5 = 2."),

  makeQuestion(12, "Separate Chaining", "Medium", "Original HashLab practice",
    "With h(k) = k mod 7, which keys among 10, 17, and 24 collide?",
    ["None", "10 and 17 only", "17 and 24 only", "All three"],
    3, "10, 17, and 24 all have remainder 3 when divided by 7."),

  makeQuestion(13, "Separate Chaining", "Medium", "Original HashLab practice",
    "Keys 12, 22, and 32 are inserted using h(k) = k mod 10. How many keys are in the chain at index 2?",
    ["0", "1", "2", "3"],
    3, "All three keys have remainder 2."),

  makeQuestion(14, "Separate Chaining", "Easy", "Original HashLab practice",
    "Which structure is commonly used to represent a chain?",
    ["Linked list", "Stack only", "Binary heap only", "Queue only"],
    0, "A linked list or another collection can hold keys for a bucket."),

  makeQuestion(15, "Separate Chaining", "Medium", "Original HashLab practice",
    "In separate chaining, a collision necessarily means:",
    ["The table is full", "Two keys map to the same bucket",
     "The hash function failed", "The table must double"],
    1, "Chaining allows multiple keys in a bucket, so a collision does not necessarily mean the table is full."),

  makeQuestion(16, "Separate Chaining", "Medium", "Original HashLab practice",
    "For separate chaining, what does the load factor n/m measure?",
    ["Average keys per bucket", "Number of empty tables", "Maximum key value", "Hash-function length"],
    0, "It represents the average number of stored keys per bucket."),

  makeQuestion(17, "Separate Chaining", "Hard", "Original HashLab practice",
    "If all n keys hash to one bucket, an unsuccessful search may require:",
    ["O(1) comparisons in all cases", "O(log n) comparisons necessarily",
     "O(n) comparisons", "O(n log n) comparisons necessarily"],
    2, "A chain containing all keys can require linear traversal."),

  makeQuestion(18, "Separate Chaining", "Medium", "Comparison practice (original)",
    "Compared with open addressing, separate chaining typically:",
    ["Stores colliding keys in a bucket collection", "Requires every slot to hold one key only",
     "Cannot delete keys", "Never allocates extra memory"],
    0, "Chaining keeps collided keys in a collection associated with the bucket."),

  // ───────────── 3. LINEAR PROBING (19–27) ─────────────
  makeQuestion(19, "Linear Probing", "Easy", "Original HashLab practice",
    "Linear probing examines which location after index i?",
    ["i - 2", "i + 1 modulo table size", "2i only", "A random location only"],
    1, "The next probe is (i + 1) mod m."),

  makeQuestion(20, "Linear Probing", "Medium", "Original HashLab practice",
    "A table has 7 slots. A key hashes to index 5, which is occupied. Where is the next probe?",
    ["4", "5", "6", "0"],
    2, "The next index is (5 + 1) mod 7 = 6."),

  makeQuestion(21, "Linear Probing", "Medium", "Original HashLab practice",
    "Which problem is particularly associated with linear probing?",
    ["Primary clustering", "Directory doubling", "Local-depth mismatch only", "Chain reversal"],
    0, "Contiguous runs of occupied slots can grow and attract more insertions."),

  makeQuestion(22, "Linear Probing", "Easy", "Original HashLab practice",
    "For a table of size 8, the probe sequence starting at 6 is:",
    ["6, 7, 0, 1", "6, 5, 4, 3", "6, 0, 2, 4", "6, 2, 7, 1"],
    0, "Linear probing increments the index and wraps around modulo 8."),

  makeQuestion(23, "Linear Probing", "Medium", "Original HashLab practice",
    "With table size 10 and h(k) = k mod 10, where does key 27 initially hash?",
    ["2", "7", "8", "9"],
    1, "27 mod 10 = 7."),

  makeQuestion(24, "Linear Probing", "Medium", "Original HashLab practice",
    "Why can deletion require special handling in open addressing?",
    ["To preserve search paths through previously occupied slots",
     "To sort the remaining keys", "To increase key values", "To force directory doubling"],
    0, "Marking a deleted slot as simply empty can make a later search stop too early."),

  makeQuestion(25, "Linear Probing", "Hard", "Original HashLab practice",
    "In the worst case, searching in a linear-probing table with n stored keys takes:",
    ["O(1) always", "O(log n)", "O(n)", "O(n²)"],
    2, "A search may inspect a linear number of slots."),

  makeQuestion(26, "Linear Probing", "Medium", "Original HashLab practice",
    "What happens when linear probing reaches the final slot?",
    ["It stops immediately", "It wraps around to index 0",
     "It doubles the key", "It switches to chaining automatically"],
    1, "Indices are computed modulo the table size."),

  makeQuestion(27, "Linear Probing", "Hard", "Original HashLab practice",
    "As a linear-probing table becomes very full, successful and unsuccessful searches generally:",
    ["Become cheaper in every case", "Need more probes on average",
     "Remain exactly one probe", "Stop requiring a hash function"],
    1, "High occupancy increases the likelihood of long probe sequences."),

  // ───────────── 4. QUADRATIC PROBING (28–36) ─────────────
  makeQuestion(28, "Quadratic Probing", "Easy", "Original HashLab practice",
    "A common quadratic-probing formula is:",
    ["(h(k) + i) mod m", "(h(k) + i²) mod m",
     "h(k) × m + i", "k mod i"],
    1, "Quadratic probing uses a quadratic offset, such as i squared."),

  makeQuestion(29, "Quadratic Probing", "Medium", "Original HashLab practice",
    "For table size 11, initial index 3, and i = 2, using (h(k) + i²) mod m, what is the probe index?",
    ["4", "5", "7", "9"],
    2, "(3 + 2²) mod 11 = 7."),

  makeQuestion(30, "Quadratic Probing", "Easy", "Original HashLab practice",
    "Quadratic probing changes the probe offset using:",
    ["A quadratic expression", "Only the previous key", "A linked list", "Directory pointers"],
    0, "The offset often follows a quadratic sequence."),

  makeQuestion(31, "Quadratic Probing", "Medium", "Comparison practice (original)",
    "Compared with linear probing, quadratic probing is designed to reduce:",
    ["Primary clustering", "The need for hashing", "All possible collisions", "The need for table slots"],
    0, "Quadratic offsets reduce primary clustering, although secondary clustering may remain."),

  makeQuestion(32, "Quadratic Probing", "Medium", "Original HashLab practice",
    "Two keys with the same initial hash value and the same probing formula generally follow:",
    ["The same probe sequence", "Opposite sequences always",
     "A linked-list chain", "A directory split sequence"],
    0, "The initial index and probe formula determine the sequence."),

  makeQuestion(33, "Quadratic Probing", "Hard", "Original HashLab practice",
    "Which statement about quadratic probing is correct?",
    ["It always visits every slot for every table size",
     "Its coverage depends on table size and formula",
     "It never experiences clustering", "It is identical to separate chaining"],
    1, "Some table-size and parameter choices do not visit all slots."),

  makeQuestion(34, "Quadratic Probing", "Medium", "Original HashLab practice",
    "Using (h + i²) mod 13 with h = 4, what is the index at i = 3?",
    ["0", "9", "12", "13"],
    0, "(4 + 3²) mod 13 = 13 mod 13 = 0 (option A)."),

  makeQuestion(35, "Quadratic Probing", "Hard", "Original HashLab practice",
    "Secondary clustering refers to keys that:",
    ["Have the same initial hash and therefore the same probe sequence",
     "Are stored in separate linked lists", "Always use different hash functions",
     "Force global depth to increase"],
    0, "Keys sharing an initial hash can follow the same quadratic probe sequence."),

  makeQuestion(36, "Quadratic Probing", "Medium", "Original HashLab practice",
    "In a quadratic-probing formula, i usually represents:",
    ["The probe attempt number", "The key's string length only",
     "The number of directories", "The number of deleted tables"],
    0, "i counts the successive probe attempts."),

  // ───────────── 5. DOUBLE HASHING (37–45) ─────────────
  makeQuestion(37, "Double Hashing", "Easy", "Original HashLab practice",
    "Double hashing uses:",
    ["Two hash functions", "Two linked lists only",
     "No hash function", "A hash function and a sorting algorithm"],
    0, "A second hash function determines the probe step."),

  makeQuestion(38, "Double Hashing", "Medium", "Original HashLab practice",
    "Using h1(k)=k mod 11 and h2(k)=1+(k mod 10), what is h1(23)?",
    ["0", "1", "2", "3"],
    1, "h1(23) = 23 mod 11 = 1 (option B)."),

  makeQuestion(39, "Double Hashing", "Medium", "Original HashLab practice",
    "A common double-hashing probe formula is:",
    ["(h1(k) + i × h2(k)) mod m",
     "(h1(k) + i²) mod m", "h1(k) × h2(k) × m", "k + m"],
    0, "The secondary hash provides the step size."),

  makeQuestion(40, "Double Hashing", "Medium", "Original HashLab practice",
    "Why should the second hash function not produce a zero step?",
    ["The probe sequence would not move to another slot",
     "It would sort the table", "It would remove all collisions",
     "It would increase the table size automatically"],
    0, "A zero step repeatedly probes the same location."),

  makeQuestion(41, "Double Hashing", "Hard", "Original HashLab practice",
    "For a table of size m, a step size coprime to m helps ensure:",
    ["The probe sequence can visit every slot",
     "All keys have different initial hashes", "No collisions occur",
     "The table needs no capacity limit"],
    0, "A step relatively prime to m traverses all residues modulo m."),

  makeQuestion(42, "Double Hashing", "Medium", "Original HashLab practice",
    "If h1(k)=4, h2(k)=3, m=11, and i=2, what is the probe index?",
    ["7", "8", "10", "2"],
    2, "(4 + 2 × 3) mod 11 = 10."),

  makeQuestion(43, "Double Hashing", "Hard", "Comparison practice (original)",
    "Compared with linear probing, double hashing often reduces clustering because:",
    ["Keys can have different probe step sizes",
     "It eliminates the table", "It stores all keys in chains",
     "It always resizes after one collision"],
    0, "Different keys may use different secondary hash values."),

  makeQuestion(44, "Double Hashing", "Medium", "Original HashLab practice",
    "In double hashing, h1 typically determines the:",
    ["Initial table index", "Number of linked lists", "Local depth", "Deletion marker"],
    0, "The first hash function determines the starting location."),

  makeQuestion(45, "Double Hashing", "Hard", "Original HashLab practice",
    "Which condition can prevent double hashing from visiting every table slot?",
    ["The step size shares a common factor with table size",
     "The key is positive", "The key is an integer", "The table has a prime size"],
    0, "If the step size and table size are not coprime, the sequence may cycle through only a subset of slots."),

  // ───────────── 6. REHASHING (46–54) ─────────────
  makeQuestion(46, "Rehashing", "Easy", "Original HashLab practice",
    "What does rehashing usually involve?",
    ["Creating a larger table and reinserting existing keys",
     "Sorting only the old bucket", "Deleting every key", "Encrypting all keys"],
    0, "When a table grows, existing keys must be placed according to the new table configuration."),

  makeQuestion(47, "Rehashing", "Medium", "Original HashLab practice",
    "A table has 8 slots and stores 6 keys. What is its load factor?",
    ["0.25", "0.5", "0.75", "1.33"],
    2, "6/8 = 0.75."),

  makeQuestion(48, "Rehashing", "Medium", "Original HashLab practice",
    "Why might the hash index of an existing key change after resizing?",
    ["The table size used by the hash calculation may change",
     "The key changes automatically", "The key is sorted",
     "Collisions become impossible"],
    0, "For modulo-based hashing, changing the table size can change a key's index."),

  makeQuestion(49, "Rehashing", "Medium", "Original HashLab practice",
    "A table grows from 8 slots to 16 slots. What is the new capacity?",
    ["4", "8", "16", "24"],
    2, "The new capacity is 16 slots."),

  makeQuestion(50, "Rehashing", "Hard", "Original HashLab practice",
    "Why can repeated rehashing still be efficient over many insertions?",
    ["Resizing can be infrequent when capacity grows geometrically",
     "Every insertion is free", "Keys never need reinsertion",
     "The table remains the same size"],
    0, "Geometric growth can make the total resizing work amortized efficient."),

  makeQuestion(51, "Rehashing", "Medium", "Original HashLab practice",
    "If the load factor threshold is 0.75 in a 20-slot table, how many keys correspond to that threshold?",
    ["10", "12", "15", "18"],
    2, "0.75 × 20 = 15 keys."),

  makeQuestion(52, "Rehashing", "Easy", "Original HashLab practice",
    "Which event is most likely to trigger load-factor-based rehashing?",
    ["The table exceeds its configured load threshold",
     "A search succeeds", "A key is displayed", "The page is refreshed"],
    0, "Many implementations resize when the load factor crosses a threshold."),

  makeQuestion(53, "Rehashing", "Hard", "Original HashLab practice",
    "What is an important cost of rehashing?",
    ["Existing keys must be redistributed",
     "The hash function must always be removed",
     "All future searches become impossible", "The keys must become strings"],
    0, "Redistributing stored keys requires additional work during resizing."),

  makeQuestion(54, "Rehashing", "Medium", "Comparison practice (original)",
    "Rehashing is primarily a strategy for:",
    ["Managing table capacity as the data grows",
     "Resolving every collision with a linked list",
     "Recording user passwords", "Sorting keys alphabetically"],
    0, "Rehashing resizes and redistributes a hash table."),

  // ───────────── 7. EXTENDIBLE HASHING (55–63) ─────────────
  makeQuestion(55, "Extendible Hashing", "Easy", "Original HashLab practice",
    "Extendible hashing uses which structure to map hash prefixes to buckets?",
    ["Directory", "Stack", "Priority queue", "Sorting tree only"],
    0, "The directory maps hash-bit prefixes to buckets."),

  makeQuestion(56, "Extendible Hashing", "Medium", "Original HashLab practice",
    "If global depth is 3, how many directory entries are there?",
    ["3", "6", "8", "16"],
    2, "Directory size is 2 raised to the global depth: 2³ = 8."),

  makeQuestion(57, "Extendible Hashing", "Easy", "Original HashLab practice",
    "Global depth represents the number of:",
    ["Hash bits used to index the directory",
     "Keys in the largest bucket", "Empty buckets only", "Insertions performed"],
    0, "Global depth determines the directory size."),

  makeQuestion(58, "Extendible Hashing", "Medium", "Original HashLab practice",
    "What usually happens when a full bucket must split but its local depth equals global depth?",
    ["The directory doubles, then the bucket splits",
     "The directory is deleted", "All keys are discarded",
     "The global depth becomes zero"],
    0, "The directory must expand to represent the additional hash bit."),

  makeQuestion(59, "Extendible Hashing", "Medium", "Original HashLab practice",
    "Local depth describes:",
    ["The number of hash bits distinguishing a bucket",
     "The total number of keys in the database",
     "The number of searches", "The maximum integer key"],
    0, "Local depth records how many hash bits identify that bucket's split."),

  makeQuestion(60, "Extendible Hashing", "Hard", "Original HashLab practice",
    "If global depth increases from 2 to 3, the directory size changes from:",
    ["2 to 3", "4 to 8", "4 to 6", "8 to 16"],
    1, "The directory size changes from 2² = 4 to 2³ = 8."),

  makeQuestion(61, "Extendible Hashing", "Medium", "Original HashLab practice",
    "After a bucket splits, its keys are redistributed according to:",
    ["Their hash values and the additional distinguishing bit",
     "Alphabetical order", "Insertion timestamps only",
     "Their original array positions only"],
    0, "The newly distinguished hash bit determines which bucket receives each key."),

  makeQuestion(62, "Extendible Hashing", "Hard", "Original HashLab practice",
    "Why can multiple directory entries point to the same bucket?",
    ["A bucket's local depth can be less than global depth",
     "Every directory entry must be unique", "The keys are sorted",
     "The table has no hash function"],
    0, "A bucket with smaller local depth is referenced by multiple directory entries."),

  makeQuestion(63, "Extendible Hashing", "Hard", "Original HashLab practice",
    "Which values are especially useful for visualizing extendible hashing?",
    ["Global depth, local depths, directory pointers, and bucket contents",
     "Only key alphabetical order", "Only elapsed wall-clock time",
     "Only the number of deleted keys"],
    0, "These values show how the directory and buckets evolve during splits."),

  // ───────────── 8. LINEAR HASHING & ANALYSIS (64–72) ─────────────
  makeQuestion(64, "Linear Hashing & Analysis", "Easy", "Original HashLab practice",
    "Linear hashing commonly grows its table using:",
    ["A split pointer and incremental bucket splits",
     "A directory that must always double",
     "Only linked-list reversal", "A fixed number of buckets forever"],
    0, "Linear hashing splits buckets incrementally according to a split pointer."),

  makeQuestion(65, "Linear Hashing & Analysis", "Medium", "Original HashLab practice",
    "What does the split pointer identify?",
    ["The next bucket scheduled for splitting",
     "The largest key", "The first deleted key", "The current search result"],
    0, "It identifies the next bucket in the incremental split sequence."),

  makeQuestion(66, "Linear Hashing & Analysis", "Medium", "Original HashLab practice",
    "How does linear hashing differ from extendible hashing in its usual growth mechanism?",
    ["Linear hashing can split incrementally without doubling a directory each time",
     "Linear hashing never splits buckets", "Extendible hashing never uses buckets",
     "Both always use separate chaining"],
    0, "Linear hashing incrementally splits buckets; extendible hashing uses a directory and may double it."),

  makeQuestion(67, "Linear Hashing & Analysis", "Medium", "Original HashLab practice",
    "A table stores 18 keys in 24 slots. What is the load factor?",
    ["0.25", "0.5", "0.75", "1.5"],
    2, "18/24 = 0.75."),

  makeQuestion(68, "Linear Hashing & Analysis", "Hard", "Original HashLab practice",
    "Which measure most directly counts how many candidate locations were examined during open-addressing operations?",
    ["Probe count", "Global depth", "Number of directory labels", "Key length"],
    0, "Probe count measures inspected table positions."),

  makeQuestion(69, "Linear Hashing & Analysis", "Medium", "Comparison practice (original)",
    "Which metric is useful when comparing collision-resolution techniques on the same workload?",
    ["Number of collisions", "Font size", "Page width", "Number of UI buttons"],
    0, "Collision counts are useful when the experiment uses a consistent definition and workload."),

  makeQuestion(70, "Linear Hashing & Analysis", "Hard", "Original HashLab practice",
    "Why should a fair algorithm comparison use the same input keys?",
    ["It controls the workload so algorithm behavior can be compared",
     "It guarantees identical results", "It eliminates all collisions",
     "It forces every algorithm to use the same memory"],
    0, "The same keys reduce workload differences as a confounding factor."),

  makeQuestion(71, "Linear Hashing & Analysis", "Medium", "Original HashLab practice",
    "What does a bucket-distribution chart help reveal?",
    ["How keys are distributed across buckets",
     "The user's typing speed", "The order of web navigation",
     "The color of the hash function"],
    0, "The distribution can reveal overloaded buckets and uneven hashing."),

  makeQuestion(72, "Linear Hashing & Analysis", "Hard", "Original HashLab practice",
    "Which statement best describes worst-case hash-table search time?",
    ["It is always O(1)", "It can be O(n) when many keys collide",
     "It is always O(log n)", "It does not depend on the data"],
    1, "A poor distribution can force a search to examine a linear number of keys or slots."),

  {
    id: 73, topic: "Linear Probing", difficulty: "Medium", tag: "ISRO CSE 2016 · Q29",
    question: "A hash function is f(key) = key mod 7. Insert the keys 37, 38, 72, 48, 98, 11, 56 into an initially empty table using linear probing. Counting the first slot as index 0, where is key 11 stored?",
    options: ["Index 3", "Index 4", "Index 5", "Index 6"], answer: 2,
    explanation: "After the earlier insertions, index 4 is occupied by 72. Key 11 hashes to 4, so linear probing places it at the next free slot, index 5.",
    sourceType: "adapted-past-paper", sourceName: "ISRO Computer Science Engineer (CSE)", sourceYear: 2016, sourcePaper: "Computer Science Engineer recruitment exam", sourceQuestionNumber: "29", sourceUrl: "https://gateoverflow.in/51315/isro-cse-2016-question-29"
  },
  {
    id: 74, topic: "Double Hashing", difficulty: "Hard", tag: "GATE CSE 2020 · Q23 (adapted)",
    question: "A double-hashing scheme uses h₁(k) = k mod 23 and h₂(k) = 1 + (k mod 19). For key k = 50, calculate the first three probe locations using (h₁(k) + i × h₂(k)) mod 23 for i = 0, 1, 2. This is an adapted practice variant; the key and requested output have been changed for practice.",
    options: ["4, 17, 7", "4, 13, 22", "4, 18, 9", "4, 17, 8"], answer: 0,
    explanation: "h₁(50)=4 and h₂(50)=13. Probe indices are (4+0) mod 23=4, (4+13) mod 23=17, and (4+26) mod 23=7.",
    sourceType: "adapted-past-paper", sourceName: "GATE Computer Science and Information Technology", sourceYear: 2020, sourcePaper: "CS paper", sourceQuestionNumber: "23", sourceUrl: "https://gateoverflow.in/333208/gate-cse-2020-question-23"
  },

,
  {
    id: 75, topic: "Linear Probing", difficulty: "Hard", tag: "UGC-NET CS 2022 · Q12",
    question: "Consider a size-11 hash table using open addressing with linear probing and h(k)=k mod 11. Insert keys 43, 36, 92, 87, 11, 47, 11, 13, 14 in order into an initially empty table with indices 0–10. At which index is the last record inserted?",
    options: ["8", "7", "10", "4"], answer: 1,
    explanation: "With linear probing, the occupied indices progress as 43→10, 36→3, 92→4, 87→0, first 11→1, 47→5, second 11→2, 13→6, and final 14→7.",
    sourceType: "verified-past-paper", sourceName: "UGC-NET Computer Science and Applications", sourceYear: 2022, sourcePaper: "October 2022, Paper II, Shift 1", sourceQuestionNumber: "12", sourceUrl: "https://db.gateoverflow.in/386145/ugc-net-cse-october-2022-part-1-question-12"
  },
  {
    id: 76, topic: "Double Hashing", difficulty: "Medium", tag: "GATE CSE 2025 Set 1 · Q55",
    question: "In a double-hashing table of size 11, h₁(k)=k mod 11 and h₂(k)=1+(k mod 7). Keys 63, 50, 25, 79, 67, 24 are inserted in that order using [h₁(k)+i·h₂(k)] mod 11. At which slot is key 24 stored?",
    options: ["8", "9", "10", "7"], answer: 2,
    explanation: "The source paper's answer is slot 10. The first five keys occupy slots 8, 6, 3, 2, and 1 respectively. For key 24, h₁=2 and h₂=4; probe positions are 2, 6, then 10, so it is stored at slot 10.",
    sourceType: "verified-past-paper", sourceName: "GATE Computer Science and Information Technology", sourceYear: 2025, sourcePaper: "Set 1", sourceQuestionNumber: "55", sourceUrl: "https://gateoverflow.in/460025/gate-cse-2025-set-1-question-55"
  },
  {
    id: 77, topic: "Hashing Analysis", difficulty: "Medium", tag: "GATE DS&AI 2024 · Q11",
    question: "For uniform hashing in an open-address hash table with load factor α=n/m<1, the expected probes for an unsuccessful search are at most 1/(1−α). Inserting an element requires at most how many probes on average?",
    options: ["ln(1/(1−α))", "1/(1−α)", "1+α/2", "1/(1+α)"], answer: 1,
    explanation: "Insertion probes until an empty slot is found, matching an unsuccessful search under the stated model; the bound is 1/(1−α).",
    sourceType: "verified-past-paper", sourceName: "GATE Data Science and Artificial Intelligence", sourceYear: 2024, sourcePaper: "DS&AI paper", sourceQuestionNumber: "11", sourceUrl: "https://gateoverflow.in/422951/gate-ds%26ai-2024-question-11"
  },
  {
    id: 78, topic: "Hashing Fundamentals", difficulty: "Medium", tag: "GATE CSE 2023 · Q10",
    question: "An adversary chooses keys to maximize collisions in a hash table. Which strategy is best suited to counter this adversarial choice?",
    options: ["Division method", "Multiplication method with a fixed constant", "Universal hashing", "Choose division or multiplication based on whether k is prime"], answer: 2,
    explanation: "Universal hashing chooses a hash function from a suitable family at random, limiting an adversary's ability to target one fixed function.",
    sourceType: "verified-past-paper", sourceName: "GATE Computer Science and Information Technology", sourceYear: 2023, sourcePaper: "CS paper", sourceQuestionNumber: "10", sourceUrl: "https://gateoverflow.in/399302/gate-cse-2023-question-10"
  },
  {
    id: 79, topic: "Hashing Analysis", difficulty: "Medium", tag: "GATE CSE 2022 · Q6",
    question: "There are n keys and m hash-table slots. Two simple uniform hash functions h₁ and h₂ are used: h₁ for odd keys and h₂ for even keys. What is the expected number of keys in a slot?",
    options: ["m/n", "n/m", "2n/m", "n/(2m)"], answer: 1,
    explanation: "Each key maps uniformly to any of the m slots, so the expected number of keys per slot is n/m.",
    sourceType: "verified-past-paper", sourceName: "GATE Computer Science and Information Technology", sourceYear: 2022, sourcePaper: "CS paper", sourceQuestionNumber: "6", sourceUrl: "https://gateoverflow.in/371930/gate-cse-2022-question-6"
  },
  {
    id: 80, topic: "Dynamic Hashing", difficulty: "Hard", tag: "GATE CSE 2021 Set 1 · Q47",
    question: "A dynamic hashing structure uses the two least significant bits to select one of four main slots. Collisions are resolved by on-demand binary trees split by the third and then fourth least significant bits. Which insertion sequence produces the state shown in the source question?",
    options: ["5, 9, 4, 13, 10, 7", "9, 5, 10, 6, 7, 1", "10, 9, 6, 7, 5, 13", "9, 5, 13, 6, 10, 14"], answer: 2,
    explanation: "The correct sequence is option C: 10, 9, 6, 7, 5, 13. The source page includes the reference state diagram.",
    sourceType: "verified-past-paper", sourceName: "GATE Computer Science and Information Technology", sourceYear: 2021, sourcePaper: "Set 1", sourceQuestionNumber: "47", sourceUrl: "https://gateoverflow.in/357404/gate-cse-2021-set-1-question-47"
  },
  {
    id: 81, topic: "Hashing Fundamentals", difficulty: "Medium", tag: "UGC-NET CS Oct 2020 · Q54",
    question: "Which statements about a hash function are true? (i) It maps arbitrary-length messages to a fixed-length code. (ii) It maps fixed-length messages to variable-length codes. (iii) Distinct messages may have the same hash value.",
    options: ["(i) only", "(ii) and (iii) only", "(i) and (iii) only", "(ii) only"], answer: 2,
    explanation: "Statements (i) and (iii) are true; statement (ii) reverses the usual fixed-output-length property.",
    sourceType: "verified-past-paper", sourceName: "UGC-NET Computer Science and Applications", sourceYear: 2020, sourcePaper: "October 2020, Part II", sourceQuestionNumber: "54", sourceUrl: "https://gateoverflow.in/349619/ugc-net-cse-october-2020-part-2-question-54"
  },
  {
    id: 82, topic: "Universal Hashing", difficulty: "Medium", tag: "UGC-NET CS Jan 2017 · Q24",
    question: "If h is selected from a universal collection of hash functions and hashes n keys into a table of size m, with n≤m, the expected number of collisions involving a particular key x is less than what value?",
    options: ["1", "1/n", "1/m", "n/m"], answer: 0,
    explanation: "The stated universal-hashing bound is less than 1 collision in expectation for a particular key when n≤m.",
    sourceType: "verified-past-paper", sourceName: "UGC-NET Computer Science and Applications", sourceYear: 2017, sourcePaper: "January 2017, Part II", sourceQuestionNumber: "24", sourceUrl: "https://gateoverflow.in/335139/ugc-net-cse-january-2017-part-2-question-24"
  },
  {
    id: 83, topic: "Closed Hashing", difficulty: "Hard", tag: "UGC-NET CS July 2018 · Q70",
    question: "A table of size 7 (indices start at 0) uses the hash function (7x+3) mod 4. The initially empty table receives keys 1, 3, 8, 10 in order using closed hashing. Which final table is correct?",
    options: ["3, 10, 1, 8, empty, empty, empty", "1, 3, 8, 10, empty, empty, empty", "1, empty, 3, empty, 8, empty, 10", "3, 10, empty, empty, 8, empty, empty"], answer: 0,
    explanation: "The source answer is option 1. Note that the source question's stated modulus/table-size convention is unusual; follow the original question wording when reviewing it.",
    sourceType: "verified-past-paper", sourceName: "UGC-NET Computer Science and Applications", sourceYear: 2018, sourcePaper: "July 2018, Part II", sourceQuestionNumber: "70", sourceUrl: "https://gateoverflow.in/225816/ugc-net-cse-july-2018-part-2-question-70"
  },
  {
    id: 101, topic: "Hashing Fundamentals", difficulty: "Easy", tag: "Adapted · GATE CSE 2025 Q55",
    question: "A hash table uses h(k) = k mod 5. What index is returned for key 46?", options: ["1", "3", "2", "0"], answer: 0, explanation: "46 mod 5 = 1. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2025, sourcePaper: "Set 1", sourceQuestionNumber: "55", sourceUrl: "https://gateoverflow.in/460025/gate-cse-2025-set-1-question-55"
  },
  {
    id: 102, topic: "Hashing Fundamentals", difficulty: "Easy", tag: "Adapted · GATE CSE 2023 Q10",
    question: "A hash table uses h(k) = k mod 7. What index is returned for key 83?", options: ["5", "0", "6", "1"], answer: 2, explanation: "83 mod 7 = 6. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2023, sourcePaper: "CS paper", sourceQuestionNumber: "10", sourceUrl: "https://gateoverflow.in/399302/gate-cse-2023-question-10"
  },
  {
    id: 103, topic: "Hashing Fundamentals", difficulty: "Easy", tag: "Adapted · GATE CSE 2022 Q6",
    question: "A hash table uses h(k) = k mod 9. What index is returned for key 100?", options: ["2", "3", "0", "1"], answer: 3, explanation: "100 mod 9 = 1. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2022, sourcePaper: "CS paper", sourceQuestionNumber: "6", sourceUrl: "https://gateoverflow.in/371930/gate-cse-2022-question-6"
  },
  {
    id: 104, topic: "Hashing Fundamentals", difficulty: "Easy", tag: "Adapted · GATE CSE 2021 Q47",
    question: "A hash table uses h(k) = k mod 11. What index is returned for key 127?", options: ["6", "7", "8", "5"], answer: 0, explanation: "127 mod 11 = 6. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2021, sourcePaper: "Set 1", sourceQuestionNumber: "47", sourceUrl: "https://gateoverflow.in/357404/gate-cse-2021-set-1-question-47"
  },
  {
    id: 105, topic: "Hashing Fundamentals", difficulty: "Easy", tag: "Adapted · GATE CSE 2020 Q23",
    question: "A hash table uses h(k) = k mod 13. What index is returned for key 211?", options: ["3", "4", "2", "5"], answer: 0, explanation: "211 mod 13 = 3. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2020, sourcePaper: "CS paper", sourceQuestionNumber: "23", sourceUrl: "https://gateoverflow.in/333208/gate-cse-2020-question-23"
  },
  {
    id: 106, topic: "Hashing Fundamentals", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2022 Q12",
    question: "A hash table uses h(k) = k mod 17. What index is returned for key 349?", options: ["10", "11", "9", "8"], answer: 2, explanation: "349 mod 17 = 9. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2022, sourcePaper: "October 2022, Paper II, Shift 1", sourceQuestionNumber: "12", sourceUrl: "https://db.gateoverflow.in/386145/ugc-net-cse-october-2022-part-1-question-12"
  },
  {
    id: 107, topic: "Hashing Fundamentals", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2017 Q24",
    question: "A hash table uses h(k) = k mod 19. What index is returned for key 503?", options: ["8", "11", "9", "10"], answer: 2, explanation: "503 mod 19 = 9. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2017, sourcePaper: "January 2017, Part II", sourceQuestionNumber: "24", sourceUrl: "https://gateoverflow.in/335139/ugc-net-cse-january-2017-part-2-question-24"
  },
  {
    id: 108, topic: "Hashing Fundamentals", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2018 Q70",
    question: "A hash table uses h(k) = k mod 23. What index is returned for key 777?", options: ["20", "18", "17", "19"], answer: 1, explanation: "777 mod 23 = 18. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2018, sourcePaper: "July 2018, Part II", sourceQuestionNumber: "70", sourceUrl: "https://gateoverflow.in/225816/ugc-net-cse-july-2018-part-2-question-70"
  },
  {
    id: 109, topic: "Hashing Fundamentals", difficulty: "Medium", tag: "Adapted · ISRO CSE 2016 Q29",
    question: "A hash table uses h(k) = k mod 29. What index is returned for key 918?", options: ["18", "21", "20", "19"], answer: 3, explanation: "918 mod 29 = 19. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "ISRO CSE", sourceYear: 2016, sourcePaper: "Computer Science Engineer recruitment exam", sourceQuestionNumber: "29", sourceUrl: "https://gateoverflow.in/51315/isro-cse-2016-question-29"
  },
  {
    id: 110, topic: "Hashing Fundamentals", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2020 Q54",
    question: "A hash table uses h(k) = k mod 31. What index is returned for key 1025?", options: ["1", "3", "4", "2"], answer: 3, explanation: "1025 mod 31 = 2. This is an adapted practice variant based on the cited exam's hashing concept, not its verbatim question.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2020, sourcePaper: "October 2020, Part II", sourceQuestionNumber: "54", sourceUrl: "https://gateoverflow.in/349619/ugc-net-cse-october-2020-part-2-question-54"
  },
  {
    id: 111, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2022 Q12",
    question: "An empty table has 7 slots indexed 0 to 6. Insert keys 13, 20, 27 in order using h(k)=k mod 7 and linear probing. Where is key 31 inserted next?", options: ["3", "2", "5", "4"], answer: 0, explanation: "Insert the earlier keys in order, then probe from 3; the first available index is 3. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2022, sourcePaper: "October 2022, Paper II, Shift 1", sourceQuestionNumber: "12", sourceUrl: "https://db.gateoverflow.in/386145/ugc-net-cse-october-2022-part-1-question-12"
  },
  {
    id: 112, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2017 Q24",
    question: "An empty table has 8 slots indexed 0 to 7. Insert keys 16, 22, 31 in order using h(k)=k mod 8 and linear probing. Where is key 36 inserted next?", options: ["3", "5", "4", "6"], answer: 2, explanation: "Insert the earlier keys in order, then probe from 4; the first available index is 4. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2017, sourcePaper: "January 2017, Part II", sourceQuestionNumber: "24", sourceUrl: "https://gateoverflow.in/335139/ugc-net-cse-january-2017-part-2-question-24"
  },
  {
    id: 113, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2018 Q70",
    question: "An empty table has 9 slots indexed 0 to 8. Insert keys 19, 24, 35 in order using h(k)=k mod 9 and linear probing. Where is key 41 inserted next?", options: ["6", "5", "4", "7"], answer: 1, explanation: "Insert the earlier keys in order, then probe from 5; the first available index is 5. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2018, sourcePaper: "July 2018, Part II", sourceQuestionNumber: "70", sourceUrl: "https://gateoverflow.in/225816/ugc-net-cse-july-2018-part-2-question-70"
  },
  {
    id: 114, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · ISRO CSE 2016 Q29",
    question: "An empty table has 10 slots indexed 0 to 9. Insert keys 22, 26, 39 in order using h(k)=k mod 10 and linear probing. Where is key 46 inserted next?", options: ["6", "8", "7", "9"], answer: 2, explanation: "Insert the earlier keys in order, then probe from 6; the first available index is 7. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "ISRO CSE", sourceYear: 2016, sourcePaper: "Computer Science Engineer recruitment exam", sourceQuestionNumber: "29", sourceUrl: "https://gateoverflow.in/51315/isro-cse-2016-question-29"
  },
  {
    id: 115, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2020 Q54",
    question: "An empty table has 11 slots indexed 0 to 10. Insert keys 25, 28, 43 in order using h(k)=k mod 11 and linear probing. Where is key 51 inserted next?", options: ["8", "7", "6", "9"], answer: 1, explanation: "Insert the earlier keys in order, then probe from 7; the first available index is 7. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2020, sourcePaper: "October 2020, Part II", sourceQuestionNumber: "54", sourceUrl: "https://gateoverflow.in/349619/ugc-net-cse-october-2020-part-2-question-54"
  },
  {
    id: 116, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · GATE CSE 2025 Q55",
    question: "An empty table has 12 slots indexed 0 to 11. Insert keys 28, 30, 47 in order using h(k)=k mod 12 and linear probing. Where is key 56 inserted next?", options: ["9", "10", "8", "7"], answer: 2, explanation: "Insert the earlier keys in order, then probe from 8; the first available index is 8. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2025, sourcePaper: "Set 1", sourceQuestionNumber: "55", sourceUrl: "https://gateoverflow.in/460025/gate-cse-2025-set-1-question-55"
  },
  {
    id: 117, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · GATE CSE 2023 Q10",
    question: "An empty table has 13 slots indexed 0 to 12. Insert keys 31, 32, 51 in order using h(k)=k mod 13 and linear probing. Where is key 61 inserted next?", options: ["11", "8", "9", "10"], answer: 2, explanation: "Insert the earlier keys in order, then probe from 9; the first available index is 9. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2023, sourcePaper: "CS paper", sourceQuestionNumber: "10", sourceUrl: "https://gateoverflow.in/399302/gate-cse-2023-question-10"
  },
  {
    id: 118, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · GATE CSE 2022 Q6",
    question: "An empty table has 14 slots indexed 0 to 13. Insert keys 34, 34, 55 in order using h(k)=k mod 14 and linear probing. Where is key 66 inserted next?", options: ["12", "9", "11", "10"], answer: 3, explanation: "Insert the earlier keys in order, then probe from 10; the first available index is 10. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2022, sourcePaper: "CS paper", sourceQuestionNumber: "6", sourceUrl: "https://gateoverflow.in/371930/gate-cse-2022-question-6"
  },
  {
    id: 119, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · GATE CSE 2021 Q47",
    question: "An empty table has 15 slots indexed 0 to 14. Insert keys 37, 36, 59 in order using h(k)=k mod 15 and linear probing. Where is key 71 inserted next?", options: ["12", "10", "11", "13"], answer: 2, explanation: "Insert the earlier keys in order, then probe from 11; the first available index is 11. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2021, sourcePaper: "Set 1", sourceQuestionNumber: "47", sourceUrl: "https://gateoverflow.in/357404/gate-cse-2021-set-1-question-47"
  },
  {
    id: 120, topic: "Linear Probing", difficulty: "Medium", tag: "Adapted · GATE CSE 2020 Q23",
    question: "An empty table has 16 slots indexed 0 to 15. Insert keys 40, 38, 63 in order using h(k)=k mod 16 and linear probing. Where is key 76 inserted next?", options: ["12", "13", "11", "14"], answer: 0, explanation: "Insert the earlier keys in order, then probe from 12; the first available index is 12. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2020, sourcePaper: "CS paper", sourceQuestionNumber: "23", sourceUrl: "https://gateoverflow.in/333208/gate-cse-2020-question-23"
  },
  {
    id: 121, topic: "Double Hashing", difficulty: "Medium", tag: "Adapted · GATE CSE 2022 Q6",
    question: "A double-hashing table has size 11. For a given key, h₁(k)=4 and h₂(k)=3. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 11, what is the location at probe i=3?", options: ["1", "2", "3", "4"], answer: 1, explanation: "(4+3×3) mod 11 = 2. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2022, sourcePaper: "CS paper", sourceQuestionNumber: "6", sourceUrl: "https://gateoverflow.in/371930/gate-cse-2022-question-6"
  },
  {
    id: 122, topic: "Double Hashing", difficulty: "Medium", tag: "Adapted · GATE CSE 2021 Q47",
    question: "A double-hashing table has size 13. For a given key, h₁(k)=7 and h₂(k)=4. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 13, what is the location at probe i=3?", options: ["5", "7", "6", "8"], answer: 2, explanation: "(7+3×4) mod 13 = 6. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2021, sourcePaper: "Set 1", sourceQuestionNumber: "47", sourceUrl: "https://gateoverflow.in/357404/gate-cse-2021-set-1-question-47"
  },
  {
    id: 123, topic: "Double Hashing", difficulty: "Medium", tag: "Adapted · GATE CSE 2020 Q23",
    question: "A double-hashing table has size 17. For a given key, h₁(k)=2 and h₂(k)=5. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 17, what is the location at probe i=3?", options: ["1", "16", "0", "2"], answer: 2, explanation: "(2+3×5) mod 17 = 0. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2020, sourcePaper: "CS paper", sourceQuestionNumber: "23", sourceUrl: "https://gateoverflow.in/333208/gate-cse-2020-question-23"
  },
  {
    id: 124, topic: "Double Hashing", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2022 Q12",
    question: "A double-hashing table has size 19. For a given key, h₁(k)=8 and h₂(k)=6. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 19, what is the location at probe i=3?", options: ["6", "8", "7", "9"], answer: 2, explanation: "(8+3×6) mod 19 = 7. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2022, sourcePaper: "October 2022, Paper II, Shift 1", sourceQuestionNumber: "12", sourceUrl: "https://db.gateoverflow.in/386145/ugc-net-cse-october-2022-part-1-question-12"
  },
  {
    id: 125, topic: "Double Hashing", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2017 Q24",
    question: "A double-hashing table has size 23. For a given key, h₁(k)=13 and h₂(k)=7. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 23, what is the location at probe i=3?", options: ["10", "11", "12", "13"], answer: 1, explanation: "(13+3×7) mod 23 = 11. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2017, sourcePaper: "January 2017, Part II", sourceQuestionNumber: "24", sourceUrl: "https://gateoverflow.in/335139/ugc-net-cse-january-2017-part-2-question-24"
  },
  {
    id: 126, topic: "Double Hashing", difficulty: "Hard", tag: "Adapted · UGC-NET CS 2018 Q70",
    question: "A double-hashing table has size 29. For a given key, h₁(k)=19 and h₂(k)=8. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 29, what is the location at probe i=3?", options: ["14", "16", "13", "15"], answer: 0, explanation: "(19+3×8) mod 29 = 14. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2018, sourcePaper: "July 2018, Part II", sourceQuestionNumber: "70", sourceUrl: "https://gateoverflow.in/225816/ugc-net-cse-july-2018-part-2-question-70"
  },
  {
    id: 127, topic: "Double Hashing", difficulty: "Hard", tag: "Adapted · ISRO CSE 2016 Q29",
    question: "A double-hashing table has size 31. For a given key, h₁(k)=23 and h₂(k)=9. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 31, what is the location at probe i=3?", options: ["18", "20", "21", "19"], answer: 3, explanation: "(23+3×9) mod 31 = 19. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "ISRO CSE", sourceYear: 2016, sourcePaper: "Computer Science Engineer recruitment exam", sourceQuestionNumber: "29", sourceUrl: "https://gateoverflow.in/51315/isro-cse-2016-question-29"
  },
  {
    id: 128, topic: "Double Hashing", difficulty: "Hard", tag: "Adapted · UGC-NET CS 2020 Q54",
    question: "A double-hashing table has size 37. For a given key, h₁(k)=5 and h₂(k)=10. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 37, what is the location at probe i=3?", options: ["36", "34", "0", "35"], answer: 3, explanation: "(5+3×10) mod 37 = 35. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2020, sourcePaper: "October 2020, Part II", sourceQuestionNumber: "54", sourceUrl: "https://gateoverflow.in/349619/ugc-net-cse-october-2020-part-2-question-54"
  },
  {
    id: 129, topic: "Double Hashing", difficulty: "Hard", tag: "Adapted · GATE CSE 2025 Q55",
    question: "A double-hashing table has size 41. For a given key, h₁(k)=17 and h₂(k)=11. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 41, what is the location at probe i=3?", options: ["9", "11", "10", "8"], answer: 0, explanation: "(17+3×11) mod 41 = 9. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2025, sourcePaper: "Set 1", sourceQuestionNumber: "55", sourceUrl: "https://gateoverflow.in/460025/gate-cse-2025-set-1-question-55"
  },
  {
    id: 130, topic: "Double Hashing", difficulty: "Hard", tag: "Adapted · GATE CSE 2023 Q10",
    question: "A double-hashing table has size 43. For a given key, h₁(k)=31 and h₂(k)=12. Using h(k,i)=[h₁(k)+i·h₂(k)] mod 43, what is the location at probe i=3?", options: ["26", "23", "24", "25"], answer: 2, explanation: "(31+3×12) mod 43 = 24. Adapted practice based on the cited double-hashing exam topic, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2023, sourcePaper: "CS paper", sourceQuestionNumber: "10", sourceUrl: "https://gateoverflow.in/399302/gate-cse-2023-question-10"
  },
  {
    id: 131, topic: "Hashing Analysis", difficulty: "Easy", tag: "Adapted · GATE CSE 2023 Q10",
    question: "A hash table stores 12 keys in 20 slots. What is its load factor α=n/m?", options: ["0.85", "0.60", "0.50", "0.70"], answer: 1, explanation: "α = n/m = 12/20 = 0.60. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2023, sourcePaper: "CS paper", sourceQuestionNumber: "10", sourceUrl: "https://gateoverflow.in/399302/gate-cse-2023-question-10"
  },
  {
    id: 132, topic: "Hashing Analysis", difficulty: "Easy", tag: "Adapted · GATE CSE 2022 Q6",
    question: "If n=18 keys are distributed uniformly over m=24 slots, what is the expected number of keys per slot?", options: ["0.38", "1.75", "0.75", "1.50"], answer: 2, explanation: "The expected occupancy of one slot is n/m = 18/24 = 0.75. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2022, sourcePaper: "CS paper", sourceQuestionNumber: "6", sourceUrl: "https://gateoverflow.in/371930/gate-cse-2022-question-6"
  },
  {
    id: 133, topic: "Hashing Analysis", difficulty: "Easy", tag: "Adapted · GATE CSE 2021 Q47",
    question: "A hash table stores 25 keys in 50 slots. What is its load factor α=n/m?", options: ["0.75", "0.50", "0.60", "0.40"], answer: 1, explanation: "α = n/m = 25/50 = 0.50. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2021, sourcePaper: "Set 1", sourceQuestionNumber: "47", sourceUrl: "https://gateoverflow.in/357404/gate-cse-2021-set-1-question-47"
  },
  {
    id: 134, topic: "Hashing Analysis", difficulty: "Easy", tag: "Adapted · GATE CSE 2020 Q23",
    question: "If n=32 keys are distributed uniformly over m=40 slots, what is the expected number of keys per slot?", options: ["0.40", "0.80", "1.80", "1.60"], answer: 1, explanation: "The expected occupancy of one slot is n/m = 32/40 = 0.80. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2020, sourcePaper: "CS paper", sourceQuestionNumber: "23", sourceUrl: "https://gateoverflow.in/333208/gate-cse-2020-question-23"
  },
  {
    id: 135, topic: "Hashing Analysis", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2022 Q12",
    question: "A hash table stores 45 keys in 60 slots. What is its load factor α=n/m?", options: ["0.75", "1.00", "0.85", "0.65"], answer: 0, explanation: "α = n/m = 45/60 = 0.75. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2022, sourcePaper: "October 2022, Paper II, Shift 1", sourceQuestionNumber: "12", sourceUrl: "https://db.gateoverflow.in/386145/ugc-net-cse-october-2022-part-1-question-12"
  },
  {
    id: 136, topic: "Hashing Analysis", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2017 Q24",
    question: "If n=54 keys are distributed uniformly over m=72 slots, what is the expected number of keys per slot?", options: ["1.50", "0.38", "0.75", "1.75"], answer: 2, explanation: "The expected occupancy of one slot is n/m = 54/72 = 0.75. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2017, sourcePaper: "January 2017, Part II", sourceQuestionNumber: "24", sourceUrl: "https://gateoverflow.in/335139/ugc-net-cse-january-2017-part-2-question-24"
  },
  {
    id: 137, topic: "Hashing Analysis", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2018 Q70",
    question: "A hash table stores 63 keys in 90 slots. What is its load factor α=n/m?", options: ["0.60", "0.95", "0.70", "0.80"], answer: 2, explanation: "α = n/m = 63/90 = 0.70. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2018, sourcePaper: "July 2018, Part II", sourceQuestionNumber: "70", sourceUrl: "https://gateoverflow.in/225816/ugc-net-cse-july-2018-part-2-question-70"
  },
  {
    id: 138, topic: "Hashing Analysis", difficulty: "Medium", tag: "Adapted · ISRO CSE 2016 Q29",
    question: "If n=72 keys are distributed uniformly over m=96 slots, what is the expected number of keys per slot?", options: ["0.38", "0.75", "1.75", "1.50"], answer: 1, explanation: "The expected occupancy of one slot is n/m = 72/96 = 0.75. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "ISRO CSE", sourceYear: 2016, sourcePaper: "Computer Science Engineer recruitment exam", sourceQuestionNumber: "29", sourceUrl: "https://gateoverflow.in/51315/isro-cse-2016-question-29"
  },
  {
    id: 139, topic: "Hashing Analysis", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2020 Q54",
    question: "A hash table stores 88 keys in 110 slots. What is its load factor α=n/m?", options: ["0.80", "0.90", "0.70", "1.05"], answer: 0, explanation: "α = n/m = 88/110 = 0.80. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2020, sourcePaper: "October 2020, Part II", sourceQuestionNumber: "54", sourceUrl: "https://gateoverflow.in/349619/ugc-net-cse-october-2020-part-2-question-54"
  },
  {
    id: 140, topic: "Hashing Analysis", difficulty: "Medium", tag: "Adapted · GATE CSE 2025 Q55",
    question: "If n=96 keys are distributed uniformly over m=120 slots, what is the expected number of keys per slot?", options: ["0.40", "1.60", "0.80", "1.80"], answer: 2, explanation: "The expected occupancy of one slot is n/m = 96/120 = 0.80. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2025, sourcePaper: "Set 1", sourceQuestionNumber: "55", sourceUrl: "https://gateoverflow.in/460025/gate-cse-2025-set-1-question-55"
  },
  {
    id: 141, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · GATE CSE 2025 Q55",
    question: "Which collision-resolution method stores collided keys in a linked list or another collection attached to a bucket?", options: ["Linear probing", "Separate chaining", "Double hashing", "Rehashing"], answer: 1, explanation: "Separate chaining stores colliding keys in a per-bucket collection. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2025, sourcePaper: "Set 1", sourceQuestionNumber: "55", sourceUrl: "https://gateoverflow.in/460025/gate-cse-2025-set-1-question-55"
  },
  {
    id: 142, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · GATE CSE 2023 Q10",
    question: "Which strategy is specifically designed to reduce an adversary’s ability to target one fixed hash function?", options: ["Universal hashing", "A fixed division function only", "Sorting the keys", "Increasing key length"], answer: 0, explanation: "Universal hashing selects from a suitable family of hash functions. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2023, sourcePaper: "CS paper", sourceQuestionNumber: "10", sourceUrl: "https://gateoverflow.in/399302/gate-cse-2023-question-10"
  },
  {
    id: 143, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · GATE CSE 2022 Q6",
    question: "In open addressing, what does the load factor α=n/m represent?", options: ["Slots divided by keys", "Keys divided by slots", "Collisions divided by keys", "Table size squared"], answer: 1, explanation: "The load factor is the number of stored keys divided by table capacity. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2022, sourcePaper: "CS paper", sourceQuestionNumber: "6", sourceUrl: "https://gateoverflow.in/371930/gate-cse-2022-question-6"
  },
  {
    id: 144, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · GATE CSE 2021 Q47",
    question: "In linear probing, how is the next candidate slot usually selected after a collision?", options: ["Jump by a second hash value", "Check the next slot sequentially, wrapping around", "Create a tree for every key", "Double the key"], answer: 1, explanation: "Linear probing checks successive slots. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2021, sourcePaper: "Set 1", sourceQuestionNumber: "47", sourceUrl: "https://gateoverflow.in/357404/gate-cse-2021-set-1-question-47"
  },
  {
    id: 145, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · GATE CSE 2020 Q23",
    question: "What is the main idea of dynamic hashing?", options: ["Keep table capacity permanently fixed", "Allow the hash structure to grow as data grows", "Never resolve collisions", "Sort all keys after each insertion"], answer: 1, explanation: "Dynamic hashing adapts its structure as records are inserted. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "GATE CSE", sourceYear: 2020, sourcePaper: "CS paper", sourceQuestionNumber: "23", sourceUrl: "https://gateoverflow.in/333208/gate-cse-2020-question-23"
  },
  {
    id: 146, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2022 Q12",
    question: "For simple uniform hashing into m slots, what is the probability that one fixed key maps to a specified slot?", options: ["1", "1/n", "1/m", "m/n"], answer: 2, explanation: "Under simple uniform hashing, each slot is equally likely, with probability 1/m. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2022, sourcePaper: "October 2022, Paper II, Shift 1", sourceQuestionNumber: "12", sourceUrl: "https://db.gateoverflow.in/386145/ugc-net-cse-october-2022-part-1-question-12"
  },
  {
    id: 147, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2017 Q24",
    question: "Why can two different keys share the same hash value?", options: ["The output space is finite relative to possible keys", "Hash functions always sort keys", "A hash table has infinite slots", "Only because keys are equal"], answer: 0, explanation: "A finite output range means collisions can occur for distinct keys. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2017, sourcePaper: "January 2017, Part II", sourceQuestionNumber: "24", sourceUrl: "https://gateoverflow.in/335139/ugc-net-cse-january-2017-part-2-question-24"
  },
  {
    id: 148, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2018 Q70",
    question: "Which operation is usually expected O(1) with a good hash function and controlled load factor?", options: ["Searching a hash table", "Sorting an arbitrary array", "Traversing a linked list end to end", "Comparing every pair of keys"], answer: 0, explanation: "Hash-table operations are expected constant time under suitable assumptions. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2018, sourcePaper: "July 2018, Part II", sourceQuestionNumber: "70", sourceUrl: "https://gateoverflow.in/225816/ugc-net-cse-july-2018-part-2-question-70"
  },
  {
    id: 149, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · ISRO CSE 2016 Q29",
    question: "In double hashing, what determines the step between probes?", options: ["The secondary hash function", "The table display colour", "The key length alone", "The number of UI filters"], answer: 0, explanation: "The secondary hash function determines the probe increment. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "ISRO CSE", sourceYear: 2016, sourcePaper: "Computer Science Engineer recruitment exam", sourceQuestionNumber: "29", sourceUrl: "https://gateoverflow.in/51315/isro-cse-2016-question-29"
  },
  {
    id: 150, topic: "Hashing Concepts", difficulty: "Medium", tag: "Adapted · UGC-NET CS 2020 Q54",
    question: "What is a common drawback of linear probing at high load factors?", options: ["Primary clustering", "It cannot insert integer keys", "It requires a tree directory always", "It never terminates even when a slot is empty"], answer: 0, explanation: "Linear probing can form primary clusters, worsening probe lengths. Adapted practice, not verbatim.",
    sourceType: "adapted-past-paper", sourceName: "UGC-NET CS", sourceYear: 2020, sourcePaper: "October 2020, Part II", sourceQuestionNumber: "54", sourceUrl: "https://gateoverflow.in/349619/ugc-net-cse-october-2020-part-2-question-54"
  }
];

// Only display individually sourced past-paper questions in the quiz.
export const quizQuestions = allQuizQuestions.filter(
  (q) => q.sourceUrl && q.sourceType !== "original-practice" && Number(q.sourceYear) >= 2017
);