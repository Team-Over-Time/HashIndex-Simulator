import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Database,
  ArrowRight,
  Zap,
  Clock,
  HardDrive,
  Bot,
  HelpCircle,
  Send,
  ExternalLink,
  Calculator,
  Award,
  Video,
  X
} from "lucide-react";
import {
  topicVideos,
  aiTopicMeta,
  aiQuizData,
  aiTutorResponses,
} from "../data/learnAiKnowledge.js";

/* =========================================================
   COMPREHENSIVE EDUCATIONAL LESSONS DATA
   ========================================================= */

const lessons = [
  {
    id: "hash-table",
    number: "01",
    title: "What is a Hash Table?",
    category: "Foundation",
    tagline: "The backbone of high-performance database indexing and O(1) dictionary lookups.",
    description:
      "A hash table is a fundamental associative data structure that stores key-value records in an underlying bucket array. Instead of scanning through millions of records sequentially (which takes O(n) time) or traversing a binary search tree (O(log n) time), a hash table applies a mathematical formula called a hash function to transform any arbitrary search key directly into an array index in O(1) constant time.",
    analogy:
      "Think of a giant library with 1,000 numbered storage boxes. Instead of browsing shelf by shelf, a librarian enters a book's ISBN code into a calculator that instantly tells them: 'Go directly to Box #247'. You arrive at the exact location in a single step.",
    formula: {
      title: "Fundamental Hash Mapping Equation",
      equation: "Index = h(key) = key mod m    (where 0 ≤ Index < m)",
      variables: [
        { sym: "key", desc: "The record identifier (integer, string, or UUID) being inserted or searched" },
        { sym: "h(key)", desc: "The deterministic mathematical hash function converting key into an integer" },
        { sym: "m", desc: "The total number of allocated slots or buckets in the underlying array" },
        { sym: "α (alpha)", desc: "Load Factor = n / m (ratio of total stored records to bucket capacity)" }
      ],
      note: "Under the Simple Uniform Hashing assumption, insertion, search, and deletion all operate in O(1) expected time."
    },
    algorithms: {
      insert: "1. Compute slot = h(key).\n2. Check if slot is empty or has room.\n3. Place record at slot.\n4. If occupied, trigger collision resolution.",
      search: "1. Compute slot = h(key).\n2. Inspect record at slot.\n3. If key matches, return record; otherwise follow collision trail.",
      delete: "1. Locate target slot via h(key).\n2. Remove key or mark with a tombstone (DEL) in open addressing so probe chains remain intact."
    },
    realWorld: {
      title: "PostgreSQL & Database Engines",
      details:
        "PostgreSQL supports CREATE INDEX ... USING HASH. Hash indexes are optimized exclusively for equality queries (WHERE id = 'user_123'). While B-Trees excel for range queries (WHERE age > 21), Hash Indexes provide strictly O(1) single-disk-read access for exact lookups."
    },
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(n) [if all keys hash to same slot]",
      space: "O(n + m)",
      loadFactorLimit: "0.70 – 0.75"
    },
    tradeoffs: {
      pros: [
        "Instantaneous O(1) average lookup, insertion, and deletion speed.",
        "Constant-time scalability regardless of whether the table has 1,000 or 10,000,000 items.",
        "Memory-efficient when bucket size is tuned properly."
      ],
      cons: [
        "Does NOT support range queries or sorted traversal (ORDER BY requires full scan).",
        "Performance degrades to O(n) if poor hash function causes extreme clustering.",
        "Resizing a static hash table requires costly O(n) memory reallocation."
      ]
    },
    points: [
      "Stores data in an underlying indexed array called buckets or slots.",
      "Uses a mathematical hash function to convert keys into integer indices.",
      "Provides O(1) average-case insertion, lookup, and deletion.",
      "Table capacity (m) determines the available slot space before collisions occur."
    ]
  },

  {
    id: "key",
    number: "02",
    title: "What is a Key?",
    category: "Foundation",
    tagline: "The unique data token transformed into an addressing coordinate.",
    description:
      "A key is the distinctive identifier used to store, locate, and retrieve a database record. While computer memory addresses are strictly integers, real-world keys can be customer emails, UUIDs, social security numbers, or composite tuples. The hash index's first job is to convert any arbitrary data type deterministically into a 32-bit or 64-bit integer hash code.",
    analogy:
      "Your passport number or finger print is a key. No matter who examines your passport, the number never changes, and it uniquely pinpoints your border record in the federal registry.",
    formula: {
      title: "Polynomial Rolling String Hash Function",
      equation: "HashCode(s) = (s[0]·p^(k-1) + s[1]·p^(k-2) + ... + s[k-1]) mod 2^32",
      variables: [
        { sym: "s", desc: "Input string key (e.g. username 'alex')" },
        { sym: "p", desc: "Prime base multiplier (commonly 31 or 53 to disperse character distributions)" },
        { sym: "s[i]", desc: "ASCII or Unicode integer value of character i" }
      ],
      note: "Identical keys MUST always yield identical hash values. Different keys may coincidentally produce identical hash values (Collision)."
    },
    algorithms: {
      insert: "1. Accept key of type T.\n2. Generate 32-bit integer k = HashCode(key).\n3. Map k to table index using modulo: index = k mod m.",
      search: "1. Hash incoming search key.\n2. Compare target key equality (key.equals(storedKey)) to guarantee no false identity matches.",
      delete: "1. Hash key to find candidate slot.\n2. Check exact equality before removing."
    },
    realWorld: {
      title: "Java String.hashCode() & Python hash()",
      details:
        "In Java, every java.lang.Object defines hashCode(). String uses s[0]*31^(n-1) + s[1]*31^(n-2)... Python adds random cryptographic salting to string hashing on startup to prevent HashDoS collision attacks."
    },
    complexity: {
      best: "O(1)",
      average: "O(L) [where L is key length]",
      worst: "O(L)",
      space: "O(1)",
      loadFactorLimit: "N/A"
    },
    tradeoffs: {
      pros: [
        "Allows any data type (integers, strings, structs) to index arrays.",
        "Deterministic: ensures repeatable, idempotent search queries.",
        "Uniform key distribution minimizes collision hot-spots."
      ],
      cons: [
        "Hashing long string keys introduces O(L) computational overhead.",
        "Keys must be immutable; mutating a key while in a hash table loses it forever!"
      ]
    },
    points: [
      "Keys must be deterministic: identical keys must always produce identical hash values.",
      "In HashLab, keys are integers representing record identifiers.",
      "When two distinct keys evaluate to the same table slot, a collision occurs.",
      "Handling collisions efficiently is the central goal of hash indexing."
    ]
  },

  {
    id: "hash-function",
    number: "03",
    title: "The Hash Function",
    category: "Foundation",
    tagline: "The mathematical mapping engine that converts unbounded universes into bounded slots.",
    description:
      "A hash function h(k) maps an infinite or vast domain of keys into a compact, finite range of array indices [0, m - 1]. A superior hash function satisfies the Simple Uniform Hashing Assumption: every key is equally likely to hash into any of the m slots, independently of where any other key has hashed. Common techniques include the Division Method, Multiplication Method, and Cryptographic/Universal Hashing.",
    analogy:
      "Imagine a fair dice with m sides. An ideal hash function rolls the key and lands on each side with equal 1/m probability, distributing keys uniformly across the table without clumping.",
    formula: {
      title: "Division & Multiplication Hash Equations",
      equation: "Division: h(k) = k mod m\nMultiplication: h(k) = ⌊m · (k · A mod 1)⌋",
      variables: [
        { sym: "k", desc: "Numerical integer key" },
        { sym: "m", desc: "Table size. In the division method, m MUST be a prime number not close to powers of 2" },
        { sym: "A", desc: "Knuth constant: A = (√5 - 1) / 2 ≈ 0.6180339887 (the golden ratio fractional part)" }
      ],
      note: "If m is a power of 2 (e.g. 2^p), k mod m simply extracts the lowest p bits, ignoring all higher bits!"
    },
    algorithms: {
      insert: "1. Apply formula h(k).\n2. Clamp index to valid bounds 0 <= index < m.\n3. Dispatch key to calculated slot.",
      search: "1. Evaluate h(k) identically.\n2. Inspect target bucket.",
      delete: "1. Evaluate h(k) to pinpoint target slot."
    },
    realWorld: {
      title: "MurmurHash3 & CityHash in Big Data",
      details:
        "Modern big-data systems (Apache Cassandra, ClickHouse, Redis) avoid slow modulo division on large strings by using non-cryptographic algorithms like MurmurHash3 and xxHash, which process 10+ GB/sec with near-perfect distribution."
    },
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(1)",
      loadFactorLimit: "N/A"
    },
    tradeoffs: {
      pros: [
        "Division method is ultra-fast: executed in a single CPU instruction (DIV/MOD).",
        "Evenly disperses keys across memory.",
        "Deterministic and stateless."
      ],
      cons: [
        "Modulo with composite numbers can create harmonic clusters if keys share common factors.",
        "Cannot preserve key ordering for inequality comparisons."
      ]
    },
    points: [
      "The division method (k mod m) is the standard technique used in relational database indexing.",
      "Choosing a prime number for m helps avoid clustering from common factors.",
      "A poor hash function concentrates keys into a few buckets, degrading performance to O(n).",
      "HashLab visualizes the exact modulo remainder at each insertion step."
    ]
  },

  {
    id: "static",
    number: "04",
    title: "Static Hashing",
    category: "Hashing Architecture",
    tagline: "Fixed-size hash tables with pre-allocated memory envelopes.",
    description:
      "In static hashing, the table capacity m (number of buckets) is set at initialization time and remains permanently immutable throughout program execution. Static tables are simple, cache-friendly, and boast zero reallocation overhead. However, as more records are inserted, the load factor alpha = n / m continuously rises. When alpha exceeds 0.75, collision frequency multiplies exponentially.",
    analogy:
      "A parking lot with exactly 50 fixed parking spaces. When 10 cars are parked, finding a spot is instant. When 49 cars are parked, searching for the last remaining spot requires driving around endlessly.",
    formula: {
      title: "Load Factor Equation & Saturation Metric",
      equation: "Load Factor α = n / m    (0 ≤ α ≤ 1 for Open Addressing)",
      variables: [
        { sym: "n", desc: "Total number of active records stored" },
        { sym: "m", desc: "Fixed number of allocated buckets" },
        { sym: "α", desc: "Load factor: When α > 0.8, open addressing average probe count spikes towards infinity" }
      ],
      note: "Average probes for successful search in open addressing: S ≈ (1 / α) · ln(1 / (1 - α))."
    },
    algorithms: {
      insert: "1. If n >= m in open addressing, fail with TABLE_OVERFLOW.\n2. Otherwise compute h(key) and resolve collisions.",
      search: "1. Probe table until key found or empty slot encountered.\n2. If empty slot hit, key does not exist.",
      delete: "1. Locate key and mark slot as Tombstone (DEL)."
    },
    realWorld: {
      title: "Embedded Systems & Read-Only Lookup Tables",
      details:
        "Static hashing is universally used in embedded firmware (microcontrollers with strict RAM budgets), compiler keyword tables (C reserved keywords like 'if', 'while'), and routers' fixed routing tables."
    },
    complexity: {
      best: "O(1)",
      average: "O(1) [when α < 0.7]",
      worst: "O(n) [when α → 1.0]",
      space: "O(m) [strictly pre-allocated]",
      loadFactorLimit: "0.70"
    },
    tradeoffs: {
      pros: [
        "Predictable, deterministic memory footprint.",
        "Zero memory reallocation spikes or garbage collection pauses.",
        "Simple to implement with compact memory layout."
      ],
      cons: [
        "Hard ceiling: cannot store more than m records in open addressing.",
        "If overestimated, huge RAM wastage; if underestimated, catastrophic collision breakdown."
      ]
    },
    points: [
      "The bucket count remains permanently fixed throughout the application runtime.",
      "Simple to implement and fast when the total workload size is known in advance.",
      "If the table becomes too full (high α), performance deteriorates rapidly.",
      "If the table is allocated too large, significant memory space is wasted."
    ]
  },

  {
    id: "collision",
    number: "05",
    title: "What is a Collision?",
    category: "Hashing Architecture",
    tagline: "The unavoidable reality of mapping a larger universe into fewer slots.",
    description:
      "A hash collision occurs whenever two distinct, unequal keys k1 ≠ k2 evaluate to the exact same bucket address: h(k1) = h(k2). Collisions are not bugs or programming errors—they are an inescapable mathematical reality governed by the Pigeonhole Principle. Because the universe of possible keys (billions) vastly exceeds the table size (m slots), collisions MUST happen. The quality of a hash index is defined entirely by how gracefully it resolves collisions.",
    analogy:
      "The Birthday Paradox: In a room of just 23 people, there is a 50.7% chance that two individuals share the exact same birthday! Even with 365 available days (slots), collisions emerge shockingly fast.",
    formula: {
      title: "Pigeonhole Principle Condition",
      equation: "If n > m  ⟹  ∃ k₁, k₂ such that h(k₁) = h(k₂)",
      variables: [
        { sym: "n", desc: "Total keys inserted" },
        { sym: "m", desc: "Available table slots" },
        { sym: "k₁, k₂", desc: "Distinct keys (k₁ ≠ k₂)" }
      ],
      note: "Collision handling strategies are divided into Closed Addressing (chaining) and Open Addressing (probing)."
    },
    algorithms: {
      insert: "1. Calculate target slot = h(key).\n2. If slot is occupied by a different key, COLLISION detected!\n3. Delegate to collision resolution strategy.",
      search: "1. Verify if key at h(key) is target.\n2. If not, follow collision sequence until match or terminal marker.",
      delete: "1. Must preserve collision trail so subsequent keys remain discoverable."
    },
    realWorld: {
      title: "HashDoS Attacks & Mitigation",
      details:
        "In 2011, researchers discovered that attackers could craft thousands of HTTP POST parameters that deliberately collide on the same hash bucket in PHP, Java, and Node.js, forcing server CPU utilization to 100% (Denial of Service). Modern web runtimes use SipHash to prevent this."
    },
    complexity: {
      best: "O(1) [no collision]",
      average: "O(1) [with resolution]",
      worst: "O(n) [pathological clustering]",
      space: "O(1) [additional metadata]",
      loadFactorLimit: "N/A"
    },
    tradeoffs: {
      pros: [
        "Permits compact table sizes without requiring 1:1 key-to-slot mapping.",
        "Gracefully managed by modern collision algorithms."
      ],
      cons: [
        "Each collision adds probe latency and CPU cache misses.",
        "Unchecked collisions degrade O(1) performance down to O(n)."
      ]
    },
    points: [
      "Collisions are completely normal and unavoidable in practical hash tables.",
      "Collision resolution techniques are categorized into Closed Addressing and Open Addressing.",
      "Closed Addressing stores multiple items in the same bucket (e.g. linked chains).",
      "Open Addressing probes alternative empty slots directly within the table."
    ]
  },

  {
    id: "chaining",
    number: "06",
    title: "Separate Chaining",
    category: "Closed Addressing",
    tagline: "Linked lists per bucket: graceful overflow without capacity ceilings.",
    description:
      "Separate chaining resolves collisions by turning each bucket in the table into the head of a dynamic linked list (or vector). When key k hashes to bucket i and bucket i is already occupied, the new key is simply appended as a new node to bucket i's chain. Keys mapped to other buckets are completely undisturbed, preventing interference between distinct hash indices.",
    analogy:
      "Think of numbered hooks in a coatroom. If three people have coats assigned to Hook #4, the coats are hung one behind another on that hook. Hook #5 remains completely unaffected.",
    formula: {
      title: "Separate Chaining Average Search Cost",
      equation: "Successful Search: E[T] = 1 + α / 2\nUnsuccessful Search: E[T] = 1 + α",
      variables: [
        { sym: "α (alpha)", desc: "Load factor n / m (can safely exceed 1.0; e.g. α = 2.5 means 2.5 items per bucket average)" },
        { sym: "E[T]", desc: "Expected number of node comparisons per query" }
      ],
      note: "The table NEVER overflows; it gracefully expands in memory as long as system RAM permits."
    },
    algorithms: {
      insert: "1. slot = h(key).\n2. Traverse chain at slot to verify key does not already exist.\n3. Prepend or append new Node(key) to chain.\n4. Increment totalKeys.",
      search: "1. slot = h(key).\n2. Walk linked chain comparing node.key == targetKey.\n3. Return found node or null.",
      delete: "1. slot = h(key).\n2. Unlink target node from linked chain.\n3. Free node memory."
    },
    realWorld: {
      title: "Java HashMap & C++ std::unordered_map",
      details:
        "Java's java.util.HashMap uses Separate Chaining. In Java 8+, when a single bucket's chain length exceeds TREEIFY_THRESHOLD (8 items), Java automatically converts the linked list into a Red-Black Tree, guaranteeing O(log n) worst-case search even under malicious collision attacks."
    },
    complexity: {
      best: "O(1)",
      average: "O(1 + α/2)",
      worst: "O(n) [all keys in one bucket]",
      space: "O(n + m) [pointer overhead per node]",
      loadFactorLimit: "1.0 – 2.0"
    },
    tradeoffs: {
      pros: [
        "Table never becomes full: handles unexpected workload spikes effortlessly.",
        "Deletions are clean and trivial: simple linked list node unlinking without tombstones.",
        "Performance degrades very slowly and linearly as load factor climbs."
      ],
      cons: [
        "Linked list pointers consume extra 8-16 bytes of memory per item.",
        "Poor CPU cache locality: pointer chasing causes frequent CPU cache misses."
      ]
    },
    points: [
      "Colliding keys are linked together within the same bucket index.",
      "The table never completely fills up; it gracefully accommodates more keys.",
      "Deletion is clean and straightforward without requiring tombstone markers.",
      "Search time degrades gracefully to O(1 + α) where α = n / m."
    ]
  },

  {
    id: "linear",
    number: "07",
    title: "Linear Probing",
    category: "Open Addressing",
    tagline: "Sequential slot scanning: incredible CPU cache locality with clustering trade-offs.",
    description:
      "Linear probing is an open addressing strategy where all keys are stored directly inside the main bucket array without any pointer nodes. When a collision occurs at slot h(k), the algorithm simply probes the next sequential slot: (h(k) + 1) mod m, (h(k) + 2) mod m, etc., until a vacant slot is found. Because all memory is contiguous, linear probing maximizes modern CPU L1/L2 hardware cache pre-fetching.",
    analogy:
      "Searching for a seat in a movie theater row. If your assigned seat #4 is taken, you don't leave; you simply test seat #5, then seat #6, sitting in the first empty seat you encounter.",
    formula: {
      title: "Linear Probing Sequence Formula",
      equation: "h(k, i) = [h'(k) + i · c] mod m    (for i = 0, 1, 2, ...)",
      variables: [
        { sym: "h'(k)", desc: "Primary hash function (typically k mod m)" },
        { sym: "i", desc: "Probe attempt counter (starts at 0)" },
        { sym: "c", desc: "Step size (default is 1; must be coprime to m to visit all slots)" },
        { sym: "m", desc: "Table size" }
      ],
      note: "Primary Clustering: Long contiguous blocks of occupied slots form naturally, causing probe times to skyrocket."
    },
    algorithms: {
      insert: "1. i = 0.\n2. slot = (h'(key) + i*c) mod m.\n3. If slot empty or tombstone, write key.\n4. Else i++, repeat until found or i == m.",
      search: "1. i = 0, check slot.\n2. If key matches, return success.\n3. If empty slot encountered, terminate (key NOT in table).\n4. If occupied by other key or tombstone, i++ and continue.",
      delete: "1. Search for key.\n2. When found, overwrite slot with TOMBSTONE marker (🪦 DEL).\n3. Cannot set to empty, otherwise search chains would break!"
    },
    realWorld: {
      title: "Python dict & Google Abseil FlatHashMap",
      details:
        "Modern high-speed dictionaries like Google's Abseil flat_hash_map and modern Python dict implementations use open addressing variants because contiguous memory traversal is up to 5x faster than linked list pointer chasing on modern multi-core CPUs."
    },
    complexity: {
      best: "O(1)",
      average: "O(1 / (1 - α))",
      worst: "O(n) [primary clustering]",
      space: "O(m) [zero pointer overhead]",
      loadFactorLimit: "0.50 – 0.70"
    },
    tradeoffs: {
      pros: [
        "Exceptional CPU cache efficiency: sequential memory accesses pre-fetched by hardware.",
        "Zero pointer memory overhead: every byte is utilized for data.",
        "Extremely compact and easy to serialize to disk."
      ],
      cons: [
        "Primary Clustering: clusters merge into huge blocks, compounding search delays.",
        "Deletions require tombstone markers which gradually degrade lookup efficiency.",
        "Hard ceiling: cannot exceed 100% capacity."
      ]
    },
    points: [
      "All keys reside directly within the flat bucket array.",
      "Probes successive sequential slots (i = 0, 1, 2, ...) until an open spot is found.",
      "Suffers from Primary Clustering where long runs of occupied slots coalesce.",
      "Deletions require tombstone markers to avoid severing active probe chains."
    ]
  },

  {
    id: "quadratic",
    number: "08",
    title: "Quadratic Probing",
    category: "Open Addressing",
    tagline: "Accelerating polynomial jumps that shatter primary clustering runs.",
    description:
      "Quadratic probing resolves collisions in open addressing by adding a quadratic polynomial of the probe attempt number i: h(k, i) = [h'(k) + c1·i + c2·i²] mod m. Instead of stepping by +1, the probe distance expands rapidly: +1, +4, +9, +16 slots away. This parabolic acceleration leaps over dense contiguous blocks of occupied keys, virtually eliminating Primary Clustering.",
    analogy:
      "Instead of checking seats 5, 6, 7 in a theater row, you jump: 1 step over, then 4 steps over, then 9 steps over. If a cluster forms around seat 4, you leap completely past it on the second jump.",
    formula: {
      title: "Quadratic Probing Equation",
      equation: "h(k, i) = [h'(k) + c₁ · i + c₂ · i²] mod m",
      variables: [
        { sym: "h'(k)", desc: "Base hash function" },
        { sym: "c₁, c₂", desc: "Coefficients (standard configuration: c₁ = 1, c₂ = 1, or c₁ = 0.5, c₂ = 0.5)" },
        { sym: "i", desc: "Probe iteration: i = 0, 1, 2, ... m - 1" },
        { sym: "m", desc: "Must be a prime number with load factor α ≤ 0.5 to guarantee an empty slot is always found" }
      ],
      note: "Secondary Clustering: Keys with identical primary hash h'(k) still follow the exact same quadratic probe path."
    },
    algorithms: {
      insert: "1. i = 0.\n2. slot = (h'(key) + c1*i + c2*i^2) mod m.\n3. If slot vacant, insert.\n4. Else i++, repeat until i == m.",
      search: "1. Trace identical quadratic hops: i = 0, 1, 2...\n2. Match key or terminate on empty slot.",
      delete: "1. Replace matched slot with TOMBSTONE marker."
    },
    realWorld: {
      title: "Database Buffer Pools & In-Memory Caches",
      details:
        "Quadratic probing is frequently employed in database buffer pool frame tables and fast in-memory key-value caches where primary clustering cannot be tolerated, but secondary hashing is too computationally expensive."
    },
    complexity: {
      best: "O(1)",
      average: "O(1) [when α ≤ 0.5]",
      worst: "O(n)",
      space: "O(m)",
      loadFactorLimit: "0.50"
    },
    tradeoffs: {
      pros: [
        "Effectively eliminates primary clustering.",
        "Spreads colliding keys widely across the entire address space.",
        "Significantly lower average probe counts than linear probing under moderate loads."
      ],
      cons: [
        "Secondary Clustering: keys with identical hash share the same probe sequence.",
        "Table size m must be prime and load factor kept below 0.5 to guarantee all slots can be probed.",
        "Slightly poorer CPU cache locality than sequential linear probing."
      ]
    },
    points: [
      "Jumps by quadratically growing distances (e.g. +1, +4, +9) on each collision.",
      "Eliminates primary clustering by leaping over continuous blocks of data.",
      "Secondary clustering can still occur for keys sharing identical initial hash values.",
      "Requires prime table sizes and α ≤ 0.5 to guarantee full slot coverage."
    ]
  },

  {
    id: "double",
    number: "09",
    title: "Double Hashing",
    category: "Open Addressing",
    tagline: "Key-dependent probe step sizes that eliminate both primary and secondary clustering.",
    description:
      "Double hashing is considered the premier open addressing algorithm. It employs two completely independent hash functions: a primary hash h1(k) to determine the initial starting slot, and a secondary hash h2(k) to calculate a key-dependent probe step size. Because the step size varies for every single key, even keys that share the exact same initial collision slot will diverge and probe entirely different subsequent sequences!",
    analogy:
      "Two people collide at Room #0. Instead of both checking Room #1, Person A's ticket tells them to step by 3 (Rooms 3, 6, 9), while Person B's ticket tells them to step by 5 (Rooms 5, 10, 15). They instantly scatter across different paths.",
    formula: {
      title: "Double Hashing Dual Probe Formula",
      equation: "h(k, i) = [h₁(k) + i · h₂(k)] mod m",
      variables: [
        { sym: "h₁(k)", desc: "Primary hash: determines the initial bucket (e.g. k mod m)" },
        { sym: "h₂(k)", desc: "Secondary hash: determines probe step size (e.g. 5 - (k mod 5) or 1 + (k mod (m-1)))" },
        { sym: "i", desc: "Probe hop index: i = 0, 1, 2, ... m - 1" },
        { sym: "gcd", desc: "CRITICAL: h₂(k) MUST NEVER equal 0, and gcd(h₂(k), m) MUST equal 1 to visit all m slots" }
      ],
      note: "Provides the closest approximation to pure Uniform Hashing achievable in open addressing."
    },
    algorithms: {
      insert: "1. primary = h1(key), stepSize = h2(key).\n2. i = 0; slot = (primary + i*stepSize) mod m.\n3. If slot empty, store key; else i++, repeat.",
      search: "1. primary = h1(key), stepSize = h2(key).\n2. Probe (primary + i*stepSize) mod m until found or empty slot hit.",
      delete: "1. Replace matched slot with TOMBSTONE marker."
    },
    realWorld: {
      title: "High-Performance Distributed Key-Value Stores",
      details:
        "Double hashing is heavily used in network packet routers, hardware firewall lookup tables (CAM/TCAM), and distributed storage systems where clustering spikes must be eliminated at all costs."
    },
    complexity: {
      best: "O(1)",
      average: "O(1 / (1 - α)) [near theoretical ideal]",
      worst: "O(n)",
      space: "O(m)",
      loadFactorLimit: "0.70 – 0.80"
    },
    tradeoffs: {
      pros: [
        "Completely eliminates both Primary Clustering and Secondary Clustering!",
        "Generates m^2 distinct probe sequences instead of m sequences.",
        "Highest load factor resilience among all open addressing techniques."
      ],
      cons: [
        "Requires calculating two distinct hash functions per key insertion/search.",
        "Secondary hash h2(k) must never evaluate to 0 (would cause infinite loop on first collision).",
        "More complex mathematical constraints on table size m (must be prime)."
      ]
    },
    points: [
      "Uses two independent hash functions: primary h₁(k) and step-size generator h₂(k).",
      "Step size depends on the key itself, shattering both primary and secondary clustering.",
      "Secondary hash must never evaluate to zero (h₂(k) ≠ 0).",
      "Provides performance closest to theoretical uniform hashing."
    ]
  },

  {
    id: "dynamic",
    number: "10",
    title: "Dynamic Table Growth",
    category: "Dynamic Hashing",
    tagline: "Self-scaling tables that expand and contract as workloads fluctuate.",
    description:
      "Static hash tables inevitably fail when workloads grow unpredictably: they either run out of slots or suffer catastrophic collision degradation. Dynamic hashing introduces self-scaling architectures that monitor the load factor alpha. When alpha exceeds a defined threshold (typically 0.70 to 0.75), the system automatically allocates additional bucket storage and redistributes existing records, preserving O(1) average lookup times indefinitely.",
    analogy:
      "A growing company moving offices. Instead of cramming 500 employees into a 50-person office, when the office reaches 70% capacity, management leases a building twice as large and moves the team seamlessly.",
    formula: {
      title: "Amortized Expansion Cost Analysis",
      equation: "Doubling Condition: If (n / m) ≥ α_max  ⟹  m_new = 2 · m_old\nAmortized Cost per Insert = O(1)",
      variables: [
        { sym: "n", desc: "Current number of keys stored" },
        { sym: "m_old", desc: "Previous table capacity" },
        { sym: "m_new", desc: "Doubled capacity" },
        { sym: "α_max", desc: "Threshold trigger (typically 0.75)" }
      ],
      note: "Although resizing takes O(n) work, it happens so infrequently that average cost per insert is amortized O(1)."
    },
    algorithms: {
      insert: "1. Check if (n + 1) / m >= threshold.\n2. If yes, trigger dynamic resize.\n3. Insert new key normally.",
      search: "1. Locate target bucket in expanded table.",
      delete: "1. Remove key.\n2. If load factor drops below shrink threshold (e.g. α < 0.25), halve table size to reclaim RAM."
    },
    realWorld: {
      title: "Python Dictionary Dynamic Growth",
      details:
        "Python's internal dict implementation starts at size 8. When 2/3 full, it automatically resizes: 8 -> 32 -> 128 -> 512 -> ... up to billions of entries, allowing developers to insert arbitrarily without worrying about fixed limits."
    },
    complexity: {
      best: "O(1)",
      average: "O(1) [Amortized]",
      worst: "O(n) [during the single resize pass]",
      space: "O(n)",
      loadFactorLimit: "0.75 (auto-scaling)"
    },
    tradeoffs: {
      pros: [
        "Completely eliminates table overflow errors.",
        "Maintains perpetual O(1) performance across arbitrary workload sizes.",
        "Memory footprint scales proportionally with actual stored records."
      ],
      cons: [
        "The single resizing operation takes O(n) time, causing latency spikes in real-time systems.",
        "Requires 2x memory headroom temporarily during table reallocation."
      ]
    },
    points: [
      "Monitors load factor α in real time to prevent saturation.",
      "Automatically allocates larger memory space when α exceeds threshold (typically 75%).",
      "Amortized O(1) cost ensures scalability over millions of operations.",
      "Forms the conceptual basis for modern runtime dictionaries."
    ]
  },

  {
    id: "rehashing",
    number: "11",
    title: "Rehashing",
    category: "Dynamic Hashing",
    tagline: "Table doubling and global key redistribution.",
    description:
      "Rehashing is the physical process of expanding a saturated hash table. It creates a brand-new, larger array (usually 2x or the next prime number) and re-evaluates the hash function h_new(k) = k mod m_new for every existing record. Because the modulo divisor has doubled, keys that previously collided in the old table disperse cleanly into separate, unoccupied buckets in the new table, dropping the load factor by 50%.",
    analogy:
      "Sorting postal mail into 4 bins caused huge piles. You replace the 4 bins with 8 bins. You take every letter and re-sort it using its updated 8-bin zip code, immediately cutting bin congestion in half.",
    formula: {
      title: "Rehashing Modulo Transformation",
      equation: "Old Index:  h_old(k) = k mod m_old\nNew Index:  h_new(k) = k mod (2 · m_old)\nNew Load Factor:  α_new = α_old / 2",
      variables: [
        { sym: "m_old", desc: "Original table size (e.g. 4)" },
        { sym: "m_new", desc: "Doubled table size (e.g. 8)" },
        { sym: "α_new", desc: "Drops from 75% down to 37.5% post-rehash" }
      ],
      note: "All tombstone markers are discarded during rehashing, completely cleansing the table of dead markers!"
    },
    algorithms: {
      insert: "1. Allocate new array of size m_new = 2 * m_old.\n2. Iterate through old array from 0 to m_old - 1.\n3. For each active key, compute new_slot = h_new(key) and place in new table.\n4. Deallocate old array memory.\n5. Insert the pending key.",
      search: "1. Always queries active new table array.",
      delete: "1. Deletes from active new table array."
    },
    realWorld: {
      title: "Redis Incremental Rehashing (dict.c)",
      details:
        "Redis cannot afford to stop serving requests while rehashing gigabytes of data. Instead, Redis uses Incremental Rehashing: it maintains two hash tables (ht[0] and ht[1]) simultaneously and migrates exactly one bucket on every client query, spreading the rehash cost smoothly across time with zero latency spikes!"
    },
    complexity: {
      best: "O(1) [standard insert]",
      average: "O(1) [amortized]",
      worst: "O(n) [during the rehash step]",
      space: "O(m_old + m_new) [during migration]",
      loadFactorLimit: "0.75"
    },
    tradeoffs: {
      pros: [
        "Completely resets collision frequency back to baseline minimum.",
        "Cleanses all tombstone markers, recovering wasted slots.",
        "Guarantees indefinite table lifespan."
      ],
      cons: [
        "Stop-the-world latency spike during O(n) rehash if not performed incrementally.",
        "Requires temporary double memory allocation during copy pass."
      ]
    },
    points: [
      "Allocates a new underlying bucket array of doubled capacity.",
      "Every existing key is re-mapped using the new table divisor (k mod m_new).",
      "Cuts load factor in half immediately (e.g. from 75% to 37.5%).",
      "Purges all accumulated tombstone markers, restoring peak throughput."
    ]
  },

  {
    id: "extendible",
    number: "12",
    title: "Extendible Hashing",
    category: "Dynamic Hashing",
    tagline: "The premier DBMS dynamic hashing algorithm: directory doubling with localized bucket splitting.",
    description:
      "Extendible Hashing is an advanced dynamic disk-based hashing technique designed specifically for relational database management systems (DBMS). Unlike standard rehashing which rehashes the ENTIRE table when capacity is exceeded, Extendible Hashing uses an in-memory directory of pointers pointing to physical data buckets on disk. When a bucket overflows, ONLY THAT SPECIFIC BUCKET SPLITS! The rest of the database remains completely untouched. The directory uses bit depths (Global Depth D and Local Depth d) to route keys using their binary prefix or suffix.",
    analogy:
      "A corporate phone directory where names are indexed by their first few letters. If the 'S' department outgrows its room, only the 'S' department splits into 'Sa-Sm' and 'Sn-Sz'. The 'A', 'B', and 'C' departments don't have to move or change their room numbers at all!",
    formula: {
      title: "Directory Addressing & Depth Mechanics",
      equation: "Directory Size = 2^D\nDirectory Index = key mod 2^D  (or lowest D bits of hash(key))\nSplit Condition: If Local Depth d == Global Depth D  ⟹  Directory Doubles (D ➔ D + 1)",
      variables: [
        { sym: "D", desc: "Global Depth: Number of binary bits inspected by the directory index" },
        { sym: "d", desc: "Local Depth: Number of binary bits shared by all keys inside a specific bucket" },
        { sym: "2^D", desc: "Total number of pointer slots in the directory" },
        { sym: "Capacity (C)", desc: "Maximum number of records that fit inside a physical disk bucket/page" }
      ],
      note: "CRITICAL SPLIT RULE: If d < D, the overflowing bucket splits and local depth increments to d+1, but the DIRECTORY DOES NOT GROW! If d == D, directory doubles (D ➔ D+1) and pointers duplicate before splitting."
    },
    algorithms: {
      insert: "1. Compute hash(k) and extract last D bits as directory index.\n2. Follow pointer to Bucket B.\n3. If Bucket B has space (< C), insert key.\n4. If Bucket B is full (C keys):\n   a. If local depth d == global depth D: Double directory (D = D + 1, size = 2^D), copy pointers.\n   b. Allocate new Bucket B_new.\n   c. Increment local depth of both buckets: d = d + 1.\n   d. Re-distribute keys of B between B and B_new using their (d)-th bit.\n   e. Update directory pointers to B and B_new.\n   f. Retry insert.",
      search: "1. Calculate directory index from lowest D bits of hash(k).\n2. Read bucket pointer from directory.\n3. Access physical bucket page on disk.\n4. Scan bucket keys for exact match. GUARANTEED AT MOST 2 DISK READS!",
      delete: "1. Locate bucket via directory.\n2. Remove key.\n3. (Optional) If bucket and its buddy bucket are underfull, merge them and decrement local depth."
    },
    realWorld: {
      title: "PostgreSQL Disk Hash Index Implementation",
      details:
        "PostgreSQL's hash index implementation is an industrial-grade version of Extendible Hashing. The directory is represented by Meta-Pages and Bucket-Pages on disk. Because the directory is compact and fits in RAM, any record in a multi-gigabyte table can be retrieved in EXACTLY 1 disk block I/O access!"
    },
    complexity: {
      best: "O(1) [1 directory read + 1 bucket read]",
      average: "O(1) [at most 2 disk block accesses]",
      worst: "O(1) [disk block access is strictly bounded!]",
      space: "O(2^D + N_buckets · C)",
      loadFactorLimit: "0.69 – 0.80 (high page utilization)"
    },
    tradeoffs: {
      pros: [
        "Localized bucket splitting: NEVER rehashes the entire database; only the overflowing bucket splits!",
        "Strict disk access guarantee: finding any record takes AT MOST 2 disk page I/Os.",
        "Dynamic expansion: directory grows and shrinks gracefully without taking the database offline.",
        "Space-efficient: multiple directory entries can point to the same shared physical bucket."
      ],
      cons: [
        "Directory size doubles exponentially (2^D) when global depth increments.",
        "If data is extremely skewed, directory size can grow very large relative to actual data.",
        "Extra level of indirection compared to contiguous flat open addressing."
      ]
    },
    points: [
      "Directory of pointers decouples index addressing from physical storage blocks.",
      "Global Depth (D) dictates directory size (2^D); Local Depth (d) dictates bucket granularity.",
      "When a bucket overflows, ONLY that specific bucket splits—the rest of the table is untouched.",
      "Guarantees O(1) record retrieval with at most 2 disk block I/O operations."
    ]
  },

  {
    id: "linear-hashing",
    number: "13",
    title: "Linear Hashing",
    category: "Dynamic Hashing",
    tagline: "Sequential bucket-by-bucket expansion without exponential directory doubling.",
    description:
      "Invented by Witold Litwin in 1980, Linear Hashing is a directory-less dynamic hashing algorithm designed to overcome Extendible Hashing's primary drawback: exponential directory doubling spikes. In Linear Hashing, buckets expand one-by-one in strict sequential order from left to right, controlled by a Split Pointer (s). When any bucket overflows, it temporarily stores excess keys in an overflow block, while the bucket pointed to by s is split and a new bucket is appended to the end of the file. As rounds progress, all overflow blocks are eliminated systematically.",
    analogy:
      "A conveyor belt of delivery trucks. When any truck is overfilled, you don't panic and buy a fleet of double the trucks. Instead, you systematically upgrade Truck #0, then Truck #1, then Truck #2 in a calm, orderly queue until the entire fleet is modernized.",
    formula: {
      title: "Dual-Level Hash Function System",
      equation: "Level Hash: h_Level(k) = k mod (N · 2^Level)\nNext Hash:  h_Level+1(k) = k mod (N · 2^(Level + 1))\nSplit Routing Rule: If h_Level(k) < s  ⟹  Use h_Level+1(k)",
      variables: [
        { sym: "N", desc: "Initial base number of buckets at Level 0" },
        { sym: "Level", desc: "Current expansion round generation (Level = 0, 1, 2, ...)" },
        { sym: "s (Split Pointer)", desc: "Index of the next sequential bucket scheduled to be split (0 ≤ s < N · 2^Level)" },
        { sym: "C", desc: "Bucket capacity" }
      ],
      note: "When Split Pointer s reaches N · 2^Level, it resets to 0, Level increments by 1, and the base bucket count doubles smoothly!"
    },
    algorithms: {
      insert: "1. Evaluate primary bucket: slot = h_Level(key).\n2. If slot < s (already split this round), re-evaluate: slot = h_Level+1(key).\n3. Insert into bucket [slot]. If bucket full, attach overflow page.\n4. If split condition triggered (e.g. load factor exceeded):\n   a. Allocate new bucket at end of table (index N*2^Level + s).\n   b. Split bucket [s] into bucket [s] and new bucket using h_Level+1(k).\n   c. Advance split pointer: s = s + 1.\n   d. If s == N*2^Level, reset s = 0 and Level = Level + 1.",
      search: "1. Compute slot = h_Level(key).\n2. If slot < s, compute slot = h_Level+1(key).\n3. Search bucket [slot] and its overflow chain.",
      delete: "1. Locate bucket via split routing rule.\n2. Remove key from bucket or overflow chain.\n3. If table becomes underfull, reverse split pointer and contract."
    },
    realWorld: {
      title: "Distributed Databases & Dynamic Token Rings",
      details:
        "Linear hashing principles power distributed DHTs (Distributed Hash Tables) and distributed document stores. Because expansion is linear (adding 1 bucket or node at a time), distributed databases can scale up incrementally by adding individual servers without re-partitioning the whole cluster."
    },
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(k) [where k is overflow chain length]",
      space: "O(N_buckets · C)",
      loadFactorLimit: "0.75 – 0.85 (smooth controlled expansion)"
    },
    tradeoffs: {
      pros: [
        "NO DIRECTORY REQUIRED! Completely eliminates directory storage and memory pointers.",
        "Linear, gradual growth: table size grows smoothly bucket-by-bucket with zero allocation spikes.",
        "Exceptional space utilization (often 80-90%).",
        "Very easy to implement and coordinate in concurrent multi-threaded environments."
      ],
      cons: [
        "Requires temporary overflow chains for buckets that overflow before the split pointer reaches them.",
        "The bucket that splits is NOT necessarily the bucket that experienced the overflow.",
        "Unlucky search keys in deep overflow chains can take more than 2 disk block accesses."
      ]
    },
    points: [
      "Grows gracefully one bucket at a time rather than doubling whole directories.",
      "The split pointer (s) systematically points to the next bucket scheduled for splitting.",
      "Uses two alternating hash functions (h_Level and h_Level+1) depending on pointer position.",
      "Very popular in high-throughput distributed database engines."
    ]
  }
];

/* =========================================================
   RICH MULTI-PHASE ANIMATION DATA ("EXPLAINING EACH PHASE")
   ========================================================= */

const animationData = {
  "hash-table": {
    title: "Step-by-Step Hash Table Key Storage Lifecycle",
    subtitle: "Observe the 6 distinct operational phases of direct memory indexing.",
    steps: [
      {
        phase: "Phase 1: Key Intake & Binary Translation",
        tag: "1. Intake",
        title: "Client Submits Key = 42",
        description: "The application client initiates an insertion request for integer Key = 42 into a hash table of size m = 5. The key is received in RAM and checked for validity.",
        formula: "Key = 42 (Binary: 00101010₂), Table Capacity m = 5",
        memoryAction: "Allocate input register holding k = 42."
      },
      {
        phase: "Phase 2: Hash Function Math & Modulo Mapping",
        tag: "2. Hash Math",
        title: "Compute Modulo Division h(42)",
        description: "The hash engine applies the division hash function: h(k) = k mod m. 42 divided by 5 equals 8 with a mathematical remainder of 2.",
        formula: "h(42) = 42 mod 5 = 2",
        memoryAction: "CPU arithmetic ALU executes DIV instruction; remainder register holds 2."
      },
      {
        phase: "Phase 3: Target Slot & Boundary Inspection",
        tag: "3. Slot Check",
        title: "Inspect Target Bucket Index [2]",
        description: "The engine translates computed index 2 into a memory offset: Address = Base_Address + (2 × Slot_Size). It inspects the slot header to determine availability.",
        formula: "0 ≤ Index (2) < m (5)  [Within valid bounds]",
        memoryAction: "CPU reads memory at Slot 2 offset. Status: VACANT."
      },
      {
        phase: "Phase 4: Collision Verification",
        tag: "4. Collision Check",
        title: "Verify Slot Status (Empty vs Occupied)",
        description: "The slot is currently vacant (no existing key resides at Slot 2). No collision resolution is required. Direct placement is approved.",
        formula: "Slot[2].occupied == false ⟹ Zero Collision",
        memoryAction: "Flag set to DIRECT_INSERT."
      },
      {
        phase: "Phase 5: Memory Allocation & Key Write",
        tag: "5. Memory Write",
        title: "Persist Key 42 in Bucket 2",
        description: "Key 42 is written directly into the bucket's data field. The slot's occupied flag is set to true, and active key count increments from 0 to 1.",
        formula: "Bucket[2].key = 42, TotalKeys n = 1",
        memoryAction: "Store 42 to RAM address of Bucket 2."
      },
      {
        phase: "Phase 6: Final Verification & O(1) Confirmation",
        tag: "6. Finalized",
        title: "Operation Complete — Ready for O(1) Lookup",
        description: "Key 42 is permanently indexed. Any subsequent search query for Key 42 will execute the exact same h(42)=2 formula and locate the record in 1 single memory access!",
        formula: "Load Factor α = 1 / 5 = 0.20 (20%)",
        memoryAction: "Return SUCCESS status code 200 to client."
      }
    ]
  },

  key: {
    title: "How a Key is Converted into an Addressing Coordinate",
    subtitle: "From raw data identity to integer hash coordinates.",
    steps: [
      {
        phase: "Phase 1: Raw Key Identity Intake",
        tag: "1. Raw Intake",
        title: "Input Key Token 'User_42'",
        description: "The application provides a unique identifier. Even complex strings or UUIDs are converted into deterministic numerical integer tokens.",
        formula: "Key = 'User_42'",
        memoryAction: "Buffer string characters into memory array."
      },
      {
        phase: "Phase 2: Hash Code Extraction",
        tag: "2. Hash Code",
        title: "Polynomial Transformation to Integer k",
        description: "The runtime computes a 32-bit integer hash code from the key token: k = HashCode(Key) = 42.",
        formula: "k = HashCode('User_42') = 42 ∈ ℤ",
        memoryAction: "Produce 32-bit signed integer register."
      },
      {
        phase: "Phase 3: Bounded Modulo Division",
        tag: "3. Modulo Math",
        title: "Bound Integer into Table Array Range",
        description: "The unbounded integer 42 is mapped into the table capacity range [0, 4] using modulo arithmetic: 42 mod 5 = 2.",
        formula: "Target Index = 42 mod 5 = 2",
        memoryAction: "Index register computed as 2."
      },
      {
        phase: "Phase 4: Slot Availability Check",
        tag: "4. Availability",
        title: "Confirm Destination Bucket 2",
        description: "Bucket index 2 is addressed. The engine confirms the destination memory cell.",
        formula: "Target = Bucket[2]",
        memoryAction: "Address bus points to Bucket 2."
      },
      {
        phase: "Phase 5: Storage Allocation",
        tag: "5. Placement",
        title: "Place Key into Bucket 2",
        description: "The key is committed to memory. Future lookups will replicate this exact deterministic pathway.",
        formula: "Bucket[2] = 42",
        memoryAction: "Write value 42 to RAM."
      },
      {
        phase: "Phase 6: Deterministic Lookup Verification",
        tag: "6. Verified",
        title: "Key Successfully Bound to Bucket Index",
        description: "The key coordinate is locked. Whenever key 42 is queried, the exact same hash code and slot are guaranteed.",
        formula: "Search Complexity: O(1) Instantaneous",
        memoryAction: "Complete."
      }
    ]
  },

  "hash-function": {
    title: "Hash Function Execution Pipeline",
    subtitle: "Visualizing modulo division and uniform distribution mapping.",
    steps: [
      {
        phase: "Phase 1: Input Key Representation",
        tag: "1. Input",
        title: "Received Integer Key = 42",
        description: "The hash function takes integer key k = 42.",
        formula: "k = 42, m = 5",
        memoryAction: "Load k into numerator register."
      },
      {
        phase: "Phase 2: Integer Division",
        tag: "2. Division",
        title: "Evaluate Integer Quotient",
        description: "Division algorithm computes: 42 / 5 = 8 with a remainder.",
        formula: "42 = (8 × 5) + Remainder",
        memoryAction: "Quotient 8 placed in register Q."
      },
      {
        phase: "Phase 3: Remainder Extraction",
        tag: "3. Remainder",
        title: "Extract Modulo Remainder = 2",
        description: "The modulo operation discards the quotient and preserves the remainder 2.",
        formula: "Remainder = 42 - (8 × 5) = 2",
        memoryAction: "Remainder 2 placed in register R."
      },
      {
        phase: "Phase 4: Bounded Range Enforcement",
        tag: "4. Range Bound",
        title: "Verify Valid Array Index",
        description: "Mathematically guarantees that 0 <= remainder < m for all possible positive keys.",
        formula: "0 ≤ 2 < 5  ✓ Valid Index",
        memoryAction: "Validate bounds against array length."
      },
      {
        phase: "Phase 5: Direct Table Addressing",
        tag: "5. Route",
        title: "Route Directly to Bucket 2",
        description: "The pointer routes directly to Slot 2 in O(1) time.",
        formula: "Target Slot = 2",
        memoryAction: "Offset calculation: Base + 2 * sizeof(Slot)."
      },
      {
        phase: "Phase 6: Final Placement",
        tag: "6. Placed",
        title: "Placement Complete",
        description: "Key 42 is stored in slot 2.",
        formula: "Result: Stored in Slot 2",
        memoryAction: "Memory store committed."
      }
    ]
  },

  static: {
    title: "Static Hash Table Saturation Cycle",
    subtitle: "Observing capacity saturation and the collision barrier.",
    steps: [
      {
        phase: "Phase 1: Fixed Table Memory Allocation",
        tag: "1. Allocation",
        title: "Allocate 5 Fixed Slots in Memory",
        description: "A static table of size m = 5 is created. Slots [0, 1, 2, 3, 4] are initialized to empty.",
        formula: "Capacity m = 5, Keys n = 0, Load Factor α = 0.0%",
        memoryAction: "Allocate 5 contiguous memory cells."
      },
      {
        phase: "Phase 2: Initial Keys Inserted Gracefully",
        tag: "2. Early Fill",
        title: "Insert Keys 10, 21, and 33",
        description: "Keys are mapped via modulo: 10%5=0, 21%5=1, 33%5=3. Three slots fill up without any collisions.",
        formula: "n = 3, m = 5, Load Factor α = 3/5 = 60%",
        memoryAction: "Slots 0, 1, 3 filled."
      },
      {
        phase: "Phase 3: Approaching Critical Saturation",
        tag: "3. Saturation",
        title: "Insert Keys 32 and 44",
        description: "Keys 32 (slot 2) and 44 (slot 4) fill the remaining empty spots. Table reaches 100% capacity.",
        formula: "n = 5, m = 5, Load Factor α = 5/5 = 100%",
        memoryAction: "Slots 2, 4 filled. Zero vacant slots remain!"
      },
      {
        phase: "Phase 4: Saturated Overflow Attempt",
        tag: "4. Overflow Hit",
        title: "Attempt to Insert Key 55",
        description: "A new record with Key = 55 arrives: 55 mod 5 = 0. Slot 0 is already occupied by 10!",
        formula: "h(55) = 0 (Occupied by 10) ⟹ COLLISION!",
        memoryAction: "Probe attempt initiates."
      },
      {
        phase: "Phase 5: Complete Table Traversal",
        tag: "5. Full Scan",
        title: "All Alternative Slots Occupied",
        description: "Open addressing probes slots 1, 2, 3, 4. Every single slot is occupied. No room exists.",
        formula: "Probe Count = 5/5, Table is 100% Full",
        memoryAction: "All 5 slots inspected. No vacancy."
      },
      {
        phase: "Phase 6: Hard Error Barrier Encountered",
        tag: "6. Failure",
        title: "Table Overflow — Static Hashing Limit",
        description: "Static hashing has reached its physical barrier. The table cannot accept new data without resizing.",
        formula: "ERROR: TABLE_OVERFLOW (α = 1.0)",
        memoryAction: "Operation aborted or requires dynamic table redesign."
      }
    ]
  },

  collision: {
    title: "Collision Detection & Resolution Lifecycle",
    subtitle: "When two distinct keys evaluate to the exact same memory address.",
    steps: [
      {
        phase: "Phase 1: First Key Occupies Bucket",
        tag: "1. First Key",
        title: "Key 12 arrives: h(12) = 12 mod 5 = 2",
        description: "Key 12 evaluates to Bucket 2. Slot 2 is currently empty, so Key 12 is placed smoothly.",
        formula: "h(12) = 2, Slot[2] = 12",
        memoryAction: "Bucket 2 occupied by Key 12."
      },
      {
        phase: "Phase 2: Second Key Calculates Same Address",
        tag: "2. Second Key",
        title: "Key 27 arrives: h(27) = 27 mod 5 = 2",
        description: "Key 27 arrives. The hash function computes 27 mod 5 = 2. It points to the exact same Bucket 2!",
        formula: "h(27) = 27 mod 5 = 2",
        memoryAction: "Target address resolves to Bucket 2."
      },
      {
        phase: "Phase 3: Slot Conflict Detected",
        tag: "3. Conflict",
        title: "Bucket 2 is ALREADY OCCUPIED!",
        description: "The engine reads Bucket 2 and discovers it holds Key 12. 12 ≠ 27, but their hash indices match.",
        formula: "k₁ (12) ≠ k₂ (27)  but  h(k₁) == h(k₂) = 2",
        memoryAction: "Raise COLLISION_DETECTED flag."
      },
      {
        phase: "Phase 4: Collision Barrier Triggered",
        tag: "4. Barrier",
        title: "Pigeonhole Principle in Action",
        description: "The system cannot overwrite Key 12 (which would cause data loss). Collision resolution is mandated.",
        formula: "Collision Event at Address [2]",
        memoryAction: "Halt direct insert; invoke resolution policy."
      },
      {
        phase: "Phase 5: Resolution Strategy Dispatched",
        tag: "5. Resolution",
        title: "Select Strategy: Chaining vs Probing",
        description: "Closed addressing will append Key 27 to Bucket 2's chain. Open addressing will probe for another free slot.",
        formula: "Policy: Open Addressing or Separate Chaining",
        memoryAction: "Dispatch to selected algorithm."
      },
      {
        phase: "Phase 6: Safe Storage Confirmed",
        tag: "6. Solved",
        title: "Both Keys Preserved Without Data Loss",
        description: "Thanks to collision resolution, both keys 12 and 27 are retained and retrievable.",
        formula: "Both Keys Retained in System",
        memoryAction: "Collision resolved."
      }
    ]
  },

  chaining: {
    title: "Separate Chaining Collision Resolution",
    subtitle: "Linking colliding records into localized bucket lists.",
    steps: [
      {
        phase: "Phase 1: Initial Key Placed at Head",
        tag: "1. Head Node",
        title: "Key 12 Placed in Bucket 2",
        description: "Key 12 hashes to Bucket 2 and forms the head node of Bucket 2's linked list.",
        formula: "h(12) = 2, Bucket[2] ➔ [12 | null]",
        memoryAction: "Allocate Node(12), assign to Bucket[2]."
      },
      {
        phase: "Phase 2: Colliding Key Arrives",
        tag: "2. Collision",
        title: "Key 27 Arrives: h(27) = 2",
        description: "Key 27 evaluates to Bucket 2. Bucket 2 is already occupied by Key 12.",
        formula: "h(27) = 2 (Collision with 12)",
        memoryAction: "Traverse Bucket 2 chain."
      },
      {
        phase: "Phase 3: Dynamic Node Allocation",
        tag: "3. Heap Alloc",
        title: "Allocate New Linked Node on Heap",
        description: "Instead of searching for another bucket, the system allocates a new Node(27) on the heap.",
        formula: "new Node(27, next = null)",
        memoryAction: "Heap malloc(sizeof(Node)) for Key 27."
      },
      {
        phase: "Phase 4: Pointer Linking",
        tag: "4. Link Ptr",
        title: "Link Node 12 ➔ Node 27",
        description: "Node 12's next pointer is updated to point to the newly allocated Node 27: [12] ➔ [27].",
        formula: "Node(12).next = Node(27)",
        memoryAction: "Update pointer reference."
      },
      {
        phase: "Phase 5: Third Collision Appends Smoothly",
        tag: "5. Chain Growth",
        title: "Key 42 Appends: [12] ➔ [27] ➔ [42]",
        description: "When Key 42 arrives (42%5=2), it simply appends to the end of the chain. No other buckets in the table are disturbed!",
        formula: "Bucket[2] ➔ [12] ➔ [27] ➔ [42]",
        memoryAction: "Node(27).next = Node(42)."
      },
      {
        phase: "Phase 6: Graceful Unlimited Scaling",
        tag: "6. Verified",
        title: "Zero Table Overflow",
        description: "The hash table never runs out of capacity. Average lookup cost remains O(1 + α/2).",
        formula: "Load Factor α = 3/5 = 0.60",
        memoryAction: "Chain verified."
      }
    ]
  },

  linear: {
    title: "Linear Probing Collision Resolution",
    subtitle: "Sequential open addressing with cache-friendly contiguous hops.",
    steps: [
      {
        phase: "Phase 1: Initial Collision at Slot 2",
        tag: "1. Collision i=0",
        title: "Key 27 Hashes to Slot 2 (Occupied by 12)",
        description: "Key 27 evaluates to h'(27) = 27 mod 5 = 2. Slot 2 is already occupied by Key 12. Attempt i = 0 fails.",
        formula: "h(27, 0) = (2 + 0) mod 5 = 2 [OCCUPIED by 12]",
        memoryAction: "Read Slot 2: Occupied."
      },
      {
        phase: "Phase 2: Sequential Step Hop (+1)",
        tag: "2. Probe i=1",
        title: "Advance by Step +1 ➔ Inspect Slot 3",
        description: "Linear probing increments probe counter i = 1: h(27, 1) = (2 + 1) mod 5 = 3. Slot 3 is inspected.",
        formula: "h(27, 1) = (2 + 1) mod 5 = 3",
        memoryAction: "Read Slot 3."
      },
      {
        phase: "Phase 3: Secondary Collision Encountered",
        tag: "3. Collision i=1",
        title: "Slot 3 is ALSO Occupied by Key 8!",
        description: "Slot 3 is already occupied by Key 8. A cluster run is encountered. Attempt i = 1 fails.",
        formula: "Slot[3].key == 8 [OCCUPIED ⟹ Primary Cluster]",
        memoryAction: "Collision logged. Increment i ➔ 2."
      },
      {
        phase: "Phase 4: Second Sequential Step Hop (+2)",
        tag: "4. Probe i=2",
        title: "Advance by Step +2 ➔ Inspect Slot 4",
        description: "Probe counter advances to i = 2: h(27, 2) = (2 + 2) mod 5 = 4. Slot 4 is inspected.",
        formula: "h(27, 2) = (2 + 2) mod 5 = 4",
        memoryAction: "Read Slot 4."
      },
      {
        phase: "Phase 5: Vacant Slot Discovered!",
        tag: "5. Slot Found",
        title: "Slot 4 is VACANT — Insert Key 27",
        description: "Slot 4 is empty! Key 27 is safely written to Slot 4 after 2 probe attempts.",
        formula: "Slot[4].key = 27, Probes = 2",
        memoryAction: "Write Key 27 to Slot 4."
      },
      {
        phase: "Phase 6: Operation Logged & Verified",
        tag: "6. Placed",
        title: "Key 27 Stored at Slot 4",
        description: "Insertion completed successfully. Future searches will replicate this exact probe sequence.",
        formula: "Status: SUCCESS (2 Probes)",
        memoryAction: "Record metrics."
      }
    ]
  },

  quadratic: {
    title: "Quadratic Probing Collision Resolution",
    subtitle: "Parabolic accelerating jumps that leap past contiguous clusters.",
    steps: [
      {
        phase: "Phase 1: Initial Collision at Slot 2",
        tag: "1. Collision i=0",
        title: "Key 27 Hashes to Slot 2 (Occupied by 12)",
        description: "Key 27 evaluates to h'(27) = 27 mod 7 = 2. Slot 2 is occupied by Key 12.",
        formula: "h(27, 0) = (2 + 0²) mod 7 = 2 [OCCUPIED]",
        memoryAction: "Slot 2 collision."
      },
      {
        phase: "Phase 2: Quadratic Jump 1² = 1",
        tag: "2. Jump 1²",
        title: "Probe i = 1: Jump +1 ➔ Slot 3",
        description: "Quadratic formula adds 1²: h(27, 1) = (2 + 1²) mod 7 = 3. Slot 3 is occupied by Key 9!",
        formula: "h(27, 1) = (2 + 1) mod 7 = 3 [OCCUPIED]",
        memoryAction: "Slot 3 collision."
      },
      {
        phase: "Phase 3: Parabolic Acceleration 2² = 4",
        tag: "3. Jump 2²",
        title: "Probe i = 2: Jump +4 ➔ Leaping Over Cluster!",
        description: "Instead of checking slot 4, quadratic probing jumps by 2² = 4: (2 + 4) mod 7 = 6! It completely bypasses slots 4 and 5.",
        formula: "h(27, 2) = (2 + 4) mod 7 = 6",
        memoryAction: "Target Slot 6."
      },
      {
        phase: "Phase 4: Empty Slot Located",
        tag: "4. Empty Found",
        title: "Slot 6 is VACANT",
        description: "Slot 6 has no occupant. The parabolic jump discovered an open slot far away from the initial cluster.",
        formula: "Slot[6].occupied == false",
        memoryAction: "Slot 6 confirmed vacant."
      },
      {
        phase: "Phase 5: Key Insertion",
        tag: "5. Write Key",
        title: "Insert Key 27 into Slot 6",
        description: "Key 27 is committed into Slot 6 after 2 quadratic hops.",
        formula: "Slot[6].key = 27",
        memoryAction: "Write 27 to memory."
      },
      {
        phase: "Phase 6: Cluster Dispersion Verified",
        tag: "6. Verified",
        title: "Primary Clustering Avoided",
        description: "Key 27 is placed cleanly with zero primary clustering drag.",
        formula: "Probes = 2, Cluster Shattered",
        memoryAction: "Finished."
      }
    ]
  },

  double: {
    title: "Double Hashing Dual Formula Probing",
    subtitle: "Key-dependent step sizes that disperse colliding keys independently.",
    steps: [
      {
        phase: "Phase 1: Primary Hash Evaluation",
        tag: "1. Primary Hash",
        title: "Compute Primary Hash h₁(42) = 42 mod 7 = 0",
        description: "Input Key = 42. Primary hash computes: h₁(42) = 42 mod 7 = 0. Initial candidate is Slot 0.",
        formula: "h₁(42) = 42 mod 7 = 0",
        memoryAction: "Address Slot 0."
      },
      {
        phase: "Phase 2: Primary Collision Detected",
        tag: "2. Collision",
        title: "Slot 0 is Occupied by Key 14!",
        description: "Slot 0 already holds Key 14. Probe attempt i = 0 has collided.",
        formula: "Slot[0].key == 14 [COLLISION at i = 0]",
        memoryAction: "Trigger secondary hash."
      },
      {
        phase: "Phase 3: Secondary Hash Computation (Step Size)",
        tag: "3. Step Size h₂",
        title: "Compute Secondary Step Size h₂(42)",
        description: "The engine invokes secondary function h₂(k) = 5 - (k mod 5): h₂(42) = 5 - (42 mod 5) = 5 - 2 = 3. Step size is 3!",
        formula: "h₂(42) = 5 - (42 mod 5) = 3 (Step Size)",
        memoryAction: "Store step size 3 in CPU register."
      },
      {
        phase: "Phase 4: Key-Dependent Probe Hop",
        tag: "4. Probe Hop",
        title: "Evaluate Probe Equation: [0 + 1 × 3] mod 7 = 3",
        description: "The engine jumps by exactly 3 slots: h(42, 1) = (0 + 1 × 3) mod 7 = 3. Slot 3 is inspected.",
        formula: "h(42, 1) = (0 + 3) mod 7 = 3",
        memoryAction: "Address Slot 3."
      },
      {
        phase: "Phase 5: Vacant Slot Found & Key Inserted",
        tag: "5. Placed",
        title: "Slot 3 is Empty — Insert Key 42",
        description: "Slot 3 is unoccupied! Key 42 is placed into Slot 3 on the very first secondary probe hop.",
        formula: "Slot[3].key = 42, Probe Count = 1",
        memoryAction: "Write 42 to Slot 3."
      },
      {
        phase: "Phase 6: Ideal Dispersion Confirmed",
        tag: "6. Verified",
        title: "Dual Probing Complete — Zero Clustering",
        description: "Even if another key collides at Slot 0, its h₂(k) will generate a different step size (e.g. 1, 2, 4), scattering elsewhere.",
        formula: "Primary & Secondary Clustering Eliminated",
        memoryAction: "Completed."
      }
    ]
  },

  dynamic: {
    title: "Dynamic Table Growth Architecture",
    subtitle: "Adaptive expansion preserving O(1) amortized performance.",
    steps: [
      {
        phase: "Phase 1: Compact Initial Allocation",
        tag: "1. Compact State",
        title: "Table Begins Compact (Capacity m = 4)",
        description: "Table starts small to conserve RAM: m = 4, holding keys 10 and 20 (Load Factor α = 50%).",
        formula: "Capacity m = 4, Keys n = 2, α = 50%",
        memoryAction: "Allocate 4 bucket slots."
      },
      {
        phase: "Phase 2: Workload Accumulation",
        tag: "2. Workload",
        title: "Insert Key 30 ➔ Load Factor Hits 75%",
        description: "Key 30 is added. Total keys reach n = 3 out of 4 slots. Load factor reaches the threshold limit: α = 75%.",
        formula: "n = 3, m = 4, α = 3/4 = 75% (Threshold Reached)",
        memoryAction: "Threshold monitor triggers expansion check."
      },
      {
        phase: "Phase 3: Automatic Expansion Triggered",
        tag: "3. Trigger",
        title: "Trigger Threshold Exceeded (α ≥ 0.75)",
        description: "The engine recognizes that adding more keys will cause collision spikes. Automatic table doubling is scheduled.",
        formula: "Expansion Trigger: α ≥ α_max (0.75)",
        memoryAction: "Allocate expansion buffer."
      },
      {
        phase: "Phase 4: Buffer Allocation",
        tag: "4. Allocate 2x",
        title: "Allocate Doubled Buffer (m_new = 8)",
        description: "The system allocates a new array with m = 8 buckets in memory.",
        formula: "m_new = 2 × 4 = 8 slots",
        memoryAction: "Malloc 8 new bucket slots."
      },
      {
        phase: "Phase 5: Key Migration & Redistribution",
        tag: "5. Migration",
        title: "Redistribute Keys with h_new(k) = k mod 8",
        description: "Keys 10, 20, 30 are rehashed: 10%8=2, 20%8=4, 30%8=6. Keys disperse widely into the new table.",
        formula: "Keys 10, 20, 30 mapped to slots 2, 4, 6",
        memoryAction: "Copy and re-index keys."
      },
      {
        phase: "Phase 6: High Performance Restored",
        tag: "6. Restored",
        title: "Load Factor Halved to 37.5%",
        description: "The old table is freed. The new table operates at α = 37.5%, restoring lightning-fast O(1) lookups.",
        formula: "New Load Factor α = 3/8 = 37.5%",
        memoryAction: "Deallocate old buffer."
      }
    ]
  },

  rehashing: {
    title: "Rehashing (Table Doubling & Key Re-indexing)",
    subtitle: "Complete mathematical re-evaluation and tombstone purging.",
    steps: [
      {
        phase: "Phase 1: Threshold Violation Detected",
        tag: "1. Threshold",
        title: "Table Overloaded: 3 of 4 Slots Occupied",
        description: "Table of size m = 4 is holding keys 10, 20, 30. Load factor is 75%. Collision rates are rising.",
        formula: "m = 4, n = 3, α = 75%",
        memoryAction: "Flag REHASH_REQUIRED."
      },
      {
        phase: "Phase 2: New Table Allocation",
        tag: "2. Allocate 8",
        title: "Allocate New Table of Size m = 8",
        description: "A doubled memory buffer with 8 vacant slots is allocated.",
        formula: "m_new = 8, Slots [0..7]",
        memoryAction: "Initialize 8 slots."
      },
      {
        phase: "Phase 3: Rehash Key 10",
        tag: "3. Rehash 10",
        title: "Re-evaluate: h_new(10) = 10 mod 8 = 2",
        description: "Key 10 moves from old slot 2 (10%4) to new slot 2 (10%8).",
        formula: "10 mod 8 = 2 ➔ New Slot 2",
        memoryAction: "Write 10 to New Slot 2."
      },
      {
        phase: "Phase 4: Rehash Key 20",
        tag: "4. Rehash 20",
        title: "Re-evaluate: h_new(20) = 20 mod 8 = 4",
        description: "Key 20 moves from old slot 0 (20%4) to new slot 4 (20%8).",
        formula: "20 mod 8 = 4 ➔ New Slot 4",
        memoryAction: "Write 20 to New Slot 4."
      },
      {
        phase: "Phase 5: Rehash Key 30",
        tag: "5. Rehash 30",
        title: "Re-evaluate: h_new(30) = 30 mod 8 = 6",
        description: "Key 30 moves from old slot 2 (30%4) to new slot 6 (30%8). Previous collision between 10 and 30 is eliminated!",
        formula: "30 mod 8 = 6 ➔ New Slot 6",
        memoryAction: "Write 30 to New Slot 6."
      },
      {
        phase: "Phase 6: Cleanup & Reclaim",
        tag: "6. Purged",
        title: "Old Buffer Freed — Tombstones Purged",
        description: "Old table memory is deallocated. All dead tombstone markers are erased cleanly.",
        formula: "Load Factor α = 37.5%, Zero Tombstones",
        memoryAction: "Free old memory."
      }
    ]
  },

  extendible: {
    title: "Extendible Hashing Multi-Phase Execution",
    subtitle: "Directory doubling, local depth increment, and localized bucket splitting.",
    steps: [
      {
        phase: "Phase 1: Key Intake & Binary Inspection",
        tag: "1. Intake",
        title: "Key 13 Arrives (Binary: 00001101₂)",
        description: "Client inserts Key = 13 into an Extendible Hash structure. Currently Global Depth D = 1, directory size = 2^1 = 2 entries (0 and 1). Bucket capacity C = 2.",
        formula: "Key = 13 (00001101₂), Global Depth D = 1, Directory Size = 2",
        memoryAction: "Load 13 into binary register."
      },
      {
        phase: "Phase 2: Directory Bit Extraction",
        tag: "2. Bit Extract",
        title: "Extract Last D = 1 Bit ➔ Target Directory Entry 1",
        description: "Since Global Depth D = 1, the directory inspects the lowest 1 bit of 13: 13 & 1 = 1. Directory entry [1] points to Bucket B.",
        formula: "Index = 13 mod 2¹ = 1 ➔ Pointer points to Bucket B",
        memoryAction: "Read directory pointer at index 1 ➔ Bucket B."
      },
      {
        phase: "Phase 3: Bucket Capacity Inspection & Overflow Trigger",
        tag: "3. Capacity Check",
        title: "Bucket B is FULL! (Holds [5, 9], Capacity = 2)",
        description: "The engine inspects Bucket B. Bucket B currently contains keys 5 and 9 (Local Depth d = 1). Since Bucket B already has 2 keys, it CANNOT accept Key 13. OVERFLOW!",
        formula: "Bucket B Count (2) == Capacity (2) ⟹ OVERFLOW TRIGGERED",
        memoryAction: "Raise BUCKET_OVERFLOW on Bucket B."
      },
      {
        phase: "Phase 4: Depth Comparison (Local d vs Global D)",
        tag: "4. Depth Check",
        title: "Evaluate Local Depth d (1) vs Global Depth D (1)",
        description: "The engine compares depths: Local Depth d = 1 equals Global Depth D = 1. Because d == D, the directory MUST DOUBLE in size before the bucket can split!",
        formula: "Condition: d == D (1 == 1) ⟹ DIRECTORY DOUBLING REQUIRED",
        memoryAction: "Flag DIRECTORY_DOUBLE."
      },
      {
        phase: "Phase 5: Directory Doubling & Pointer Duplication",
        tag: "5. Dir Double",
        title: "Global Depth D Becomes 2 (Directory Expands 2 ➔ 4)",
        description: "Global Depth increments to D = 2. Directory doubles from 2 to 4 entries: [00, 01, 10, 11]. Existing pointers are duplicated: 00 and 10 point to Bucket A; 01 and 11 point to Bucket B.",
        formula: "New Directory Size = 2² = 4 entries: [00, 01, 10, 11]",
        memoryAction: "Double directory array; duplicate existing bucket pointers."
      },
      {
        phase: "Phase 6: Bucket Split & Localized Redistribution",
        tag: "6. Bucket Split",
        title: "Split Bucket B ➔ Allocate Bucket C (Local Depth d = 2)",
        description: "A new Bucket C is allocated. Both B and C get Local Depth d = 2. Keys 5, 9, 13 are redistributed based on their lowest 2 bits: 5 (01) and 9 (01) stay in Bucket B; 13 (11) moves into new Bucket C! Directory entry 11 is updated to point to Bucket C. ONLY Bucket B split; Bucket A was NEVER touched!",
        formula: "Bucket B (01): [5, 9] (d=2) | Bucket C (11): [13] (d=2)",
        memoryAction: "Directory[3] (11) repointed to Bucket C. Key 13 stored!"
      }
    ]
  },

  "linear-hashing": {
    title: "Linear Hashing Sequential Split Lifecycle",
    subtitle: "Directory-less dynamic growth governed by the round Split Pointer.",
    steps: [
      {
        phase: "Phase 1: Workload Intake & State Inspection",
        tag: "1. Intake",
        title: "Key 14 Arrives: Level = 0, Split Pointer s = 0",
        description: "Client inserts Key = 14 into a Linear Hash structure with N = 2 base buckets (Buckets 0 and 1) at Level 0. Split pointer s points to Bucket 0. Bucket capacity C = 2.",
        formula: "Key = 14, Level = 0, Split Pointer s = 0, Base N = 2",
        memoryAction: "Read system state registers: Level=0, s=0."
      },
      {
        phase: "Phase 2: Level Hash Function Mapping",
        tag: "2. Hash Math",
        title: "Compute h₀(14) = 14 mod 2 = 0",
        description: "The engine applies Level 0 hash: h₀(k) = k mod (2 × 2⁰) = k mod 2. 14 mod 2 = 0. Since 0 is NOT less than s (s = 0), Key 14 routes to Bucket 0.",
        formula: "h₀(14) = 14 mod 2 = 0 ➔ Candidate: Bucket 0",
        memoryAction: "Address Bucket 0."
      },
      {
        phase: "Phase 3: Bucket Capacity & Temporary Overflow",
        tag: "3. Overflow",
        title: "Bucket 0 is Full ➔ Key 14 Enters Overflow Chain",
        description: "Bucket 0 already holds keys [4, 8]. Since capacity is 2, Key 14 is placed into a temporary overflow block chained to Bucket 0. Total keys n = 5.",
        formula: "Bucket 0: [4, 8] + Overflow [14]",
        memoryAction: "Attach overflow page to Bucket 0."
      },
      {
        phase: "Phase 4: Split Condition Triggered",
        tag: "4. Split Trigger",
        title: "System Load Triggers Split of Bucket [s = 0]",
        description: "The overall table load triggers a linear split. In Linear Hashing, the bucket that splits is strictly determined by the Split Pointer s = 0, NOT necessarily the overflowing bucket!",
        formula: "Split Scheduled for Bucket [s] = Bucket 0",
        memoryAction: "Initialize split routine for Bucket 0."
      },
      {
        phase: "Phase 5: Bucket Allocation & Next-Level Rehash",
        tag: "5. Split & Rehash",
        title: "Allocate Bucket 2 ➔ Rehash Bucket 0 with h₁(k) = k mod 4",
        description: "A new Bucket 2 is appended to the table. Keys in Bucket 0 and its overflow block (4, 8, 14) are rehashed using h₁(k) = k mod 4: 4%4=0, 8%4=0 stay in Bucket 0; 14%4=2 moves to new Bucket 2! Overflow chain is eliminated!",
        formula: "h₁(k) = k mod 4: Bucket 0 has [4, 8]; Bucket 2 has [14]",
        memoryAction: "Allocate Bucket 2, migrate Key 14 to Bucket 2, free overflow block."
      },
      {
        phase: "Phase 6: Split Pointer Advances Smoothly",
        tag: "6. Advanced",
        title: "Split Pointer Advances: s = 0 ➔ s = 1",
        description: "The split pointer advances to s = 1. The next split in this round will modernize Bucket 1. Smooth, linear growth is achieved with ZERO directory doubling!",
        formula: "Split Pointer s = 1, Total Buckets = 3",
        memoryAction: "Update s register to 1. Complete."
      }
    ]
  }
};

/* =========================================================
   INTERACTIVE MULTI-PHASE ANIMATION PLAYER COMPONENT
   ========================================================= */

function HashAnimation({ lessonId }) {
  const data = animationData[lessonId] || animationData["hash-table"];

  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1800);

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [lessonId]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = setInterval(() => {
      setStep((current) => {
        if (current >= data.steps.length - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, speedMs);

    return () => clearInterval(timer);
  }, [isPlaying, data.steps.length, speedMs]);

  const currentStep = data.steps[step] || data.steps[0];

  const restart = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (step >= data.steps.length - 1) {
      setStep(0);
    }
    setIsPlaying((current) => !current);
  };

  const next = () => {
    setIsPlaying(false);
    setStep((current) => Math.min(data.steps.length - 1, current + 1));
  };

  const previous = () => {
    setIsPlaying(false);
    setStep((current) => Math.max(0, current - 1));
  };

  return (
    <section
      style={{
        marginTop: "45px",
        padding: "32px",
        borderRadius: "22px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-md)"
      }}
    >
      {/* HEADER WITH BADGE */}
      <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(14, 165, 233, 0.12)", padding: "5px 14px", borderRadius: "999px", border: "1px solid rgba(14, 165, 233, 0.25)" }}>
          <Sparkles size={14} color="var(--accent-primary)" />
          <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", color: "var(--accent-primary)", textTransform: "uppercase" }}>
            MULTI-PHASE CONCEPT SIMULATION ENGINE
          </span>
        </div>

        <h2 style={{ marginTop: "12px", fontSize: "26px", fontWeight: 800 }}>{data.title}</h2>
        <p style={{ marginTop: "8px", lineHeight: 1.6, color: "var(--text-secondary)", fontSize: "15px" }}>
          {data.subtitle}
        </p>
      </div>

      {/* INTERACTIVE PHASE STEPPER SELECTOR */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "28px",
          flexWrap: "wrap"
        }}
      >
        {data.steps.map((item, index) => {
          const isActive = index === step;
          const isPassed = index < step;

          return (
            <button
              key={item.tag || index}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStep(index);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: isActive
                  ? "2px solid var(--accent-primary)"
                  : isPassed
                  ? "1.5px solid rgba(16, 185, 129, 0.4)"
                  : "1.5px solid var(--border-main)",
                background: isActive
                  ? "rgba(14, 165, 233, 0.18)"
                  : isPassed
                  ? "rgba(16, 185, 129, 0.08)"
                  : "var(--bg-card-muted)",
                color: isActive
                  ? "var(--accent-primary)"
                  : isPassed
                  ? "var(--accent-success)"
                  : "var(--text-muted)",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>{item.tag}</span>
              {isActive && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-primary)" }} />}
            </button>
          );
        })}
      </div>

      {/* DYNAMIC VISUAL ENGINE CANVAS */}
      <div
        style={{
          marginTop: "24px",
          minHeight: "290px",
          padding: "32px 24px",
          borderRadius: "18px",
          background: "var(--bg-card-muted)",
          border: "1.5px solid var(--border-main)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <ConceptVisual lessonId={lessonId} step={step} />
      </div>

      {/* CURRENT PHASE DEEP-DIVE INFORMATION CARD */}
      <div
        style={{
          marginTop: "24px",
          padding: "24px",
          borderRadius: "16px",
          background: "linear-gradient(180deg, rgba(14, 165, 233, 0.06) 0%, rgba(14, 165, 233, 0.01) 100%)",
          border: "1.5px solid rgba(14, 165, 233, 0.22)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--accent-primary)"
            }}
          >
            {currentStep.phase} • STEP {step + 1} OF {data.steps.length}
          </span>

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              fontWeight: 700,
              color: "#38bdf8",
              background: "rgba(14, 165, 233, 0.14)",
              padding: "4px 10px",
              borderRadius: "6px",
              border: "1px solid rgba(56, 189, 248, 0.25)"
            }}
          >
            {currentStep.formula}
          </span>
        </div>

        <h3 style={{ marginTop: "12px", fontSize: "19px", color: "var(--text-primary)" }}>
          {currentStep.title}
        </h3>

        <p style={{ marginTop: "8px", lineHeight: 1.65, fontSize: "15px", color: "var(--text-secondary)" }}>
          {currentStep.description}
        </p>

        {currentStep.memoryAction && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px dashed rgba(148, 163, 184, 0.25)",
              fontSize: "13px",
              color: "var(--text-muted)",
              fontFamily: "'JetBrains Mono', monospace"
            }}
          >
            <HardDrive size={14} color="var(--accent-secondary)" />
            <span>
              <strong>Hardware / Memory Action:</strong> {currentStep.memoryAction}
            </span>
          </div>
        )}
      </div>

      {/* PLAYBACK CONTROLS & SPEED ADJUSTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          marginTop: "24px"
        }}
      >
        {/* SPEED SELECTOR */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Clock size={14} color="var(--text-muted)" />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>Animation Speed:</span>
          {[
            { label: "0.7x Slow", ms: 2600 },
            { label: "1.0x Normal", ms: 1800 },
            { label: "1.5x Fast", ms: 1000 }
          ].map((sp) => (
            <button
              key={sp.ms}
              type="button"
              onClick={() => setSpeedMs(sp.ms)}
              style={{
                padding: "4px 9px",
                borderRadius: "6px",
                border: speedMs === sp.ms ? "1.5px solid var(--accent-primary)" : "1.5px solid var(--border-main)",
                background: speedMs === sp.ms ? "var(--accent-primary)" : "var(--bg-card-muted)",
                color: speedMs === sp.ms ? "#ffffff" : "var(--text-muted)",
                fontSize: "11px",
                fontWeight: 750,
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {sp.label}
            </button>
          ))}
        </div>

        {/* CONTROLS */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button type="button" onClick={previous} disabled={step === 0} style={animBtnStyle}>
            <ChevronLeft size={16} /> Prev Phase
          </button>

          <button
            type="button"
            onClick={togglePlay}
            style={{
              ...animBtnStyle,
              background: isPlaying ? "rgba(239, 68, 68, 0.15)" : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.4)",
              fontWeight: 800,
              padding: "9px 20px"
            }}
          >
            {isPlaying ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Auto-Play</>}
          </button>

          <button
            type="button"
            onClick={next}
            disabled={step === data.steps.length - 1}
            style={animBtnStyle}
          >
            Next Phase <ChevronRight size={16} />
          </button>

          <button type="button" onClick={restart} style={animBtnStyle}>
            <RotateCcw size={15} /> Restart
          </button>
        </div>
      </div>
    </section>
  );
}

const animBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  padding: "9px 15px",
  borderRadius: "10px",
  border: "1.5px solid var(--border-main)",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
  fontSize: "13px",
  fontWeight: 750,
  cursor: "pointer",
  transition: "all 0.15s ease"
};

/* =========================================================
   CONCEPT VISUAL SWITCH ENGINE
   ========================================================= */

function ConceptVisual({ lessonId, step }) {
  switch (lessonId) {
    case "hash-table":
      return <BasicHashVisual step={step} />;
    case "key":
      return <KeyVisual step={step} />;
    case "hash-function":
      return <HashFunctionVisual step={step} />;
    case "static":
      return <StaticHashVisual step={step} />;
    case "collision":
      return <CollisionVisual step={step} />;
    case "chaining":
      return <ChainingVisual step={step} />;
    case "linear":
      return <LinearProbingVisual step={step} />;
    case "quadratic":
      return <QuadraticProbingVisual step={step} />;
    case "double":
      return <DoubleHashingVisual step={step} />;
    case "dynamic":
      return <DynamicHashVisual step={step} />;
    case "rehashing":
      return <RehashingVisual step={step} />;
    case "extendible":
      return <ExtendibleVisual step={step} />;
    case "linear-hashing":
      return <LinearHashingVisual step={step} />;
    default:
      return <BasicHashVisual step={step} />;
  }
}

/* =========================================================
   INDIVIDUAL ANIMATION VISUALIZERS
   ========================================================= */

function BasicHashVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <VisualBox label="INPUT KEY" value="42" active={step >= 0} />
        <VisualArrow active={step >= 1} />
        <VisualBox label="MODULO FORMULA" value="42 mod 5 = 2" active={step >= 1} />
        <VisualArrow active={step >= 2} />
        <VisualBox label="DESTINATION" value="Slot 2" active={step >= 2} />
      </div>
      <div style={{ marginTop: "24px" }}>
        <BucketTable activeIndex={step >= 2 ? 2 : -1} inserted={step >= 4 ? [2] : []} />
      </div>
      {step >= 4 && (
        <div style={successBox}>
          ✓ Key 42 placed directly into Bucket 2 in O(1) time.
        </div>
      )}
    </div>
  );
}

function KeyVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
        <VisualBox label="RAW STRING KEY" value="'User_42'" active />
        <VisualArrow active={step >= 1} />
        <VisualBox label="HASHCODE FUNCTION" value={step >= 1 ? "k = 42" : "..."} active={step >= 1} />
        <VisualArrow active={step >= 2} />
        <VisualBox label="MODULO CALCULATION" value={step >= 2 ? "42 mod 5 = 2" : "..."} active={step >= 2} />
        <VisualArrow active={step >= 4} />
        <VisualBox label="MEMORY DESTINATION" value={step >= 4 ? "Bucket [2]" : "..."} active={step >= 4} />
      </div>
    </div>
  );
}

function HashFunctionVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
        <VisualBox label="INTEGER KEY" value="42" active={step >= 0} />
        <VisualArrow active={step >= 1} />
        <VisualBox label="QUOTIENT & REMAINDER" value={step >= 1 ? "42 ÷ 5 = 8 R 2" : "..."} active={step >= 1} />
        <VisualArrow active={step >= 2} />
        <VisualBox label="INDEX REMAINDER" value={step >= 2 ? "Index: 2" : "..."} active={step >= 2} />
      </div>
      <div style={{ marginTop: "20px" }}>
        {step >= 4 ? (
          <div style={successBox}>✓ Modulo 2 identifies exact array offset in single CPU cycle.</div>
        ) : (
          <div style={infoBox}>Computing boundary remainder...</div>
        )}
      </div>
    </div>
  );
}

function StaticHashVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={visualTitle}>FIXED STATIC TABLE (Capacity m = 5)</div>
      <div style={slotRow}>
        {[
          { id: 0, val: step >= 1 ? "10" : "" },
          { id: 1, val: step >= 1 ? "21" : "" },
          { id: 2, val: step >= 2 ? "32" : "" },
          { id: 3, val: step >= 1 ? "33" : "" },
          { id: 4, val: step >= 2 ? "44" : "" }
        ].map((slot) => (
          <Slot key={slot.id} index={slot.id} occupied={Boolean(slot.val)} value={slot.val} active={step >= 2} />
        ))}
      </div>
      {step >= 3 && (
        <div style={collisionBox}>
          ⚡ CAPACITY SCRIPT: 5 of 5 Slots Filled (Load Factor α = 100%). Saturated!
        </div>
      )}
    </div>
  );
}

function CollisionVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
        <VisualBox label="KEY 1" value="12 (12 % 5 = 2)" active={step >= 0} />
        <VisualBox label="KEY 2" value="27 (27 % 5 = 2)" active={step >= 1} />
      </div>
      <VisualArrow active={step >= 2} />
      <div style={step >= 2 ? collisionBox : infoBox}>
        {step >= 2
          ? "⚡ COLLISION DETECTED! Both keys 12 and 27 map to Slot 2"
          : "Inspecting bucket availability..."}
      </div>
      <div style={{ marginTop: "16px" }}>
        <BucketTable activeIndex={2} inserted={[2]} />
      </div>
    </div>
  );
}

function ChainingVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={visualTitle}>BUCKET 2 LINKED CHAIN (Closed Addressing)</div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <div style={keyChip}>Bucket [2] Head</div>
        <span style={chainArrow}>➔</span>
        <div style={{ ...keyChip, background: "#0284c7", color: "#fff" }}>Key: 12</div>
        {step >= 2 && (
          <>
            <span style={chainArrow}>➔</span>
            <div style={{ ...keyChip, background: "#a855f7", color: "#fff" }}>Key: 27</div>
          </>
        )}
        {step >= 4 && (
          <>
            <span style={chainArrow}>➔</span>
            <div style={{ ...keyChip, background: "#10b981", color: "#fff" }}>Key: 42</div>
          </>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        {step >= 2 ? (
          <div style={successBox}>
            ✓ Colliding keys linked into dynamic chain without displacing any other table buckets!
          </div>
        ) : (
          <div style={infoBox}>Allocating chain nodes...</div>
        )}
      </div>
    </div>
  );
}

function LinearProbingVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={visualTitle}>LINEAR PROBE SEQUENCE: [h'(k) + i] mod 5</div>
      <div style={slotRow}>
        {[0, 1, 2, 3, 4].map((index) => {
          let val = "";
          if (index === 2) val = "12";
          if (index === 3) val = "8";
          if (index === 4 && step >= 4) val = "27";

          return (
            <Slot
              key={index}
              index={index}
              occupied={Boolean(val)}
              value={val}
              active={
                (step <= 1 && index === 2) ||
                (step === 2 && index === 3) ||
                (step >= 3 && index === 4)
              }
            />
          );
        })}
      </div>
      {step === 0 && <div style={collisionBox}>i = 0: Slot 2 Occupied by 12 (Collision!)</div>}
      {(step === 1 || step === 2) && <div style={collisionBox}>i = 1: Jump +1 ➔ Slot 3 Occupied by 8 (Collision!)</div>}
      {step >= 3 && <div style={successBox}>i = 2: Jump +2 ➔ Slot 4 is Empty! Key 27 safely placed.</div>}
    </div>
  );
}

function QuadraticProbingVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={visualTitle}>QUADRATIC PROBE: [h'(k) + i²] mod 7</div>
      <div style={slotRow}>
        {[0, 1, 2, 3, 4, 5, 6].map((index) => {
          let val = "";
          if (index === 2) val = "12";
          if (index === 3) val = "9";
          if (index === 6 && step >= 4) val = "27";

          return (
            <Slot
              key={index}
              index={index}
              occupied={Boolean(val)}
              value={val}
              active={
                (step <= 1 && index === 2) ||
                (step === 2 && index === 3) ||
                (step >= 3 && index === 6)
              }
            />
          );
        })}
      </div>
      {step <= 1 && <div style={collisionBox}>i = 0: Slot 2 Occupied (Collision)</div>}
      {step === 2 && <div style={collisionBox}>i = 1: Jump 1² = 1 ➔ Slot 3 Occupied (Collision)</div>}
      {step >= 3 && <div style={successBox}>i = 2: Parabolic Jump 2² = 4 ➔ Leaps to Slot 6 (Empty)! Key 27 placed.</div>}
    </div>
  );
}

function DoubleHashingVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={visualTitle}>DOUBLE HASHING DUAL FORMULAS (k = 42, m = 7)</div>
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
        <VisualBox label="PRIMARY HASH h₁(42)" value="42 mod 7 = 0" active={step >= 0} />
        <VisualBox
          label="SECONDARY STEP h₂(42)"
          value={step >= 2 ? "5 - (42%5) = 3 (Step Size)" : "Calculated on collision"}
          active={step >= 2}
        />
      </div>

      <div style={slotRow}>
        {[0, 1, 2, 3, 4, 5, 6].map((index) => {
          let val = "";
          if (index === 0) val = "14";
          if (index === 3 && step >= 4) val = "42";

          return (
            <Slot
              key={index}
              index={index}
              occupied={Boolean(val)}
              value={val}
              active={(step <= 1 && index === 0) || (step >= 3 && index === 3)}
            />
          );
        })}
      </div>

      {step <= 1 && <div style={collisionBox}>h₁(42) = Slot 0 is Occupied by 14! (Collision)</div>}
      {step === 2 && <div style={infoBox}>h₂(42) = 3 ➔ Probe Step: [0 + (1 × 3)] mod 7 = 3</div>}
      {step >= 3 && <div style={successBox}>✓ Slot 3 is Free! Key 42 inserted via Double Hashing step size.</div>}
    </div>
  );
}

function DynamicHashVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={visualTitle}>DYNAMIC SELF-SCALING STORAGE</div>
      <div style={{ display: "flex", gap: "25px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <div style={tableBox}>
          <strong>Initial State (m = 4)</strong>
          <div style={miniSlots}><span>[10]</span><span>[20]</span><span>[30]</span><span>[ ]</span></div>
          <small>Load Factor: 75% (Threshold)</small>
        </div>
        <VisualArrow active={step >= 3} />
        <div style={{ ...tableBox, border: step >= 3 ? "2px solid #10b981" : "1.5px solid var(--border-main)" }}>
          <strong>Expanded State (m = 8)</strong>
          <div style={miniSlots}>
            <span>[10]</span><span>[ ]</span><span>[20]</span><span>[ ]</span>
            {step >= 4 && (<><span>[30]</span><span>[ ]</span><span>[ ]</span><span>[ ]</span></>)}
          </div>
          <small>Capacity: {step >= 3 ? "8" : "4"}</small>
        </div>
      </div>
      <div style={{ marginTop: "18px" }}>
        {step >= 4 ? (
          <div style={successBox}>✓ Dynamic expansion accommodated keys; load factor dropped to 37.5%!</div>
        ) : (
          <div style={infoBox}>Monitoring load factor threshold...</div>
        )}
      </div>
    </div>
  );
}

function RehashingVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={visualTitle}>REHASHING: TABLE DOUBLING & KEY RE-INDEXING</div>
      <div style={{ display: "flex", gap: "25px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <div style={tableBox}>
          <strong>Old Table (m = 4)</strong>
          <div style={miniSlots}><span>[10]</span><span>[20]</span><span>[30]</span><span>[ ]</span></div>
          <small>Overloaded (α = 75%)</small>
        </div>
        <VisualArrow active={step >= 2} />
        <div style={{ ...tableBox, border: "2px solid #10b981" }}>
          <strong>New Doubled Table (m = 8)</strong>
          <div style={miniSlots}>
            <span>[ ]</span><span>[ ]</span><span>[10]</span><span>[ ]</span>
            <span>[20]</span><span>[ ]</span><span>[30]</span><span>[ ]</span>
          </div>
          <small>Clean Dispersion (α = 37.5%)</small>
        </div>
      </div>
      <div style={{ marginTop: "18px" }}>
        {step >= 4 ? (
          <div style={successBox}>✓ All keys re-indexed using h_new(k) = k mod 8. Peak throughput restored!</div>
        ) : (
          <div style={infoBox}>Migrating keys to doubled buffer...</div>
        )}
      </div>
    </div>
  );
}

function ExtendibleVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={visualTitle}>
        EXTENDIBLE HASHING (Global Depth D = {step >= 4 ? "2" : "1"})
      </div>

      <div style={{ display: "flex", gap: "30px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        {/* DIRECTORY */}
        <div style={directoryBox}>
          <strong style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "var(--accent-primary)" }}>
            DIRECTORY (2^{step >= 4 ? "2" : "1"} = {step >= 4 ? "4" : "2"} pointers)
          </strong>
          <div style={directoryGrid}>
            <DirectoryEntry label="00" bucket="Bucket A" active={step >= 0} />
            <DirectoryEntry label="01" bucket="Bucket B" active={step >= 0} />
            {step >= 4 && (
              <>
                <DirectoryEntry label="10" bucket="Bucket A" active />
                <DirectoryEntry label="11" bucket="Bucket C (Split)" active highlight />
              </>
            )}
          </div>
        </div>

        {/* BUCKETS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ ...bucketBox, border: "1.5px solid var(--border-main)" }}>
            <strong>Bucket A (Local Depth d = {step >= 4 ? "1" : "1"})</strong>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Keys: [4, 8]</div>
          </div>

          <div style={{ ...bucketBox, border: step === 2 ? "2px solid #ef4444" : "1.5px solid var(--border-main)" }}>
            <strong>Bucket B (Local Depth d = {step >= 5 ? "2" : "1"})</strong>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Keys: [5, 9] {step === 2 && "⚠️ FULL"}</div>
          </div>

          {step >= 5 && (
            <div style={{ ...bucketBox, border: "2px solid #10b981", background: "rgba(16, 185, 129, 0.1)" }}>
              <strong>Bucket C (Local Depth d = 2) [NEW]</strong>
              <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>Keys: [13] (11₂)</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "18px" }}>
        {step === 2 && <div style={collisionBox}>⚠️ Bucket B reached maximum capacity (2/2 keys)!</div>}
        {step === 4 && <div style={infoBox}>Directory doubled from 2 to 4 entries because Local Depth d = 1 equaled Global Depth D = 1.</div>}
        {step >= 5 && (
          <div style={successBox}>
            ✓ Bucket B split into B and C. Key 13 placed in Bucket C. Bucket A was completely untouched!
          </div>
        )}
      </div>
    </div>
  );
}

function LinearHashingVisual({ step }) {
  return (
    <div style={visualColumn}>
      <div style={visualTitle}>
        LINEAR HASHING (Split Pointer s = {step >= 5 ? "1" : "0"}, Level = 0)
      </div>

      <div style={bucketGrowth}>
        {[0, 1, 2].map((index) => {
          const isPointer = index === (step >= 5 ? 1 : 0);
          const isAllocated = index === 2;

          if (index === 2 && step < 4) return null;

          return (
            <div
              key={index}
              style={{
                ...growthBucket,
                border: isAllocated ? "2px solid #10b981" : isPointer ? "2px solid #38bdf8" : "1.5px solid var(--border-main)",
                background: isPointer ? "rgba(14, 165, 233, 0.1)" : isAllocated ? "rgba(16, 185, 129, 0.1)" : "var(--bg-card)"
              }}
            >
              <small style={{ textTransform: "uppercase", fontSize: "10px", color: "var(--text-muted)", fontWeight: 800 }}>
                Bucket
              </small>
              <strong style={{ fontSize: "18px", color: "var(--text-primary)" }}>{index}</strong>
              {isPointer && (
                <small style={{ color: "#38bdf8", fontWeight: 800, marginTop: "4px" }}>
                  ← Pointer s
                </small>
              )}
              {isAllocated && (
                <small style={{ color: "#10b981", fontWeight: 800, marginTop: "4px" }}>
                  + Allocated
                </small>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "18px" }}>
        {step >= 4 ? (
          <div style={successBox}>
            ✓ Bucket 0 split sequentially into 0 & 2. Split pointer s advanced to Bucket 1!
          </div>
        ) : (
          <div style={infoBox}>Evaluating linear split rule without directory doubling...</div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PRIMITIVE VISUAL SUB-COMPONENTS
   ========================================================= */

function VisualBox({ label, value, active }) {
  return (
    <div
      style={{
        minWidth: "135px",
        minHeight: "85px",
        padding: "14px",
        borderRadius: "14px",
        border: active ? "2px solid var(--accent-primary)" : "1.5px solid var(--border-main)",
        background: active ? "var(--bg-card)" : "var(--bg-card-muted)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        boxShadow: active ? "0 8px 20px -4px rgba(14, 165, 233, 0.25)" : "none",
        transition: "all 0.3s ease"
      }}
    >
      <small style={{ fontWeight: 800, color: "var(--text-muted)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </small>
      <strong style={{ marginTop: "6px", fontSize: "15px", fontFamily: "'JetBrains Mono', monospace", color: active ? "var(--accent-primary)" : "var(--text-primary)" }}>
        {value}
      </strong>
    </div>
  );
}

function VisualArrow({ active }) {
  return (
    <div style={{ color: active ? "var(--accent-primary)" : "var(--border-main)", transition: "color 0.3s ease" }}>
      <ArrowRight size={20} />
    </div>
  );
}

function BucketTable({ activeIndex, inserted = [] }) {
  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
      {[0, 1, 2, 3, 4].map((index) => {
        const isActive = activeIndex === index;
        const isInserted = inserted.includes(index);

        return (
          <div
            key={index}
            style={{
              width: "70px",
              height: "75px",
              borderRadius: "12px",
              border: isActive ? "2px solid #38bdf8" : "1.5px solid var(--border-main)",
              background: isInserted
                ? "linear-gradient(135deg, #0284c7, #0369a1)"
                : isActive
                ? "rgba(14, 165, 233, 0.15)"
                : "var(--bg-card)",
              color: isInserted ? "#ffffff" : "var(--text-primary)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}
          >
            <small style={{ fontSize: "10px", opacity: 0.7 }}>Slot {index}</small>
            <strong style={{ fontSize: "14px", fontFamily: "'JetBrains Mono', monospace" }}>
              {isInserted ? "Key: 42" : "Empty"}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

function Slot({ index, occupied, value, active }) {
  return (
    <div
      style={{
        width: "75px",
        height: "80px",
        borderRadius: "12px",
        border: active ? "2px solid #38bdf8" : "1.5px solid var(--border-main)",
        background: occupied
          ? "linear-gradient(135deg, #0284c7, #0369a1)"
          : "var(--bg-card)",
        color: occupied ? "#ffffff" : "var(--text-muted)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: active ? "0 0 14px rgba(56, 189, 248, 0.35)" : "none",
        transition: "all 0.25s ease"
      }}
    >
      <span style={{ fontSize: "10px", opacity: 0.75 }}>Index {index}</span>
      <strong style={{ fontSize: "15px", fontFamily: "'JetBrains Mono', monospace", marginTop: "4px" }}>
        {value || "—"}
      </strong>
    </div>
  );
}

function DirectoryEntry({ label, bucket, active, highlight }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
        padding: "8px 12px",
        borderRadius: "8px",
        border: highlight ? "1.5px solid #10b981" : "1px solid var(--border-main)",
        background: highlight ? "rgba(16, 185, 129, 0.15)" : active ? "var(--bg-card)" : "var(--bg-card-muted)",
        opacity: active ? 1 : 0.4
      }}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: "#38bdf8", fontSize: "12px" }}>
        [{label}]
      </span>
      <span style={{ fontSize: "11px", fontWeight: 700, color: highlight ? "#10b981" : "var(--text-primary)" }}>
        ➔ {bucket}
      </span>
    </div>
  );
}

const visualColumn = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "14px",
  width: "100%"
};

const visualTitle = {
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: "8px"
};

const slotRow = {
  display: "flex",
  gap: "8px",
  justifyContent: "center",
  flexWrap: "wrap"
};

const tableBox = {
  padding: "16px 20px",
  borderRadius: "14px",
  background: "var(--bg-card)",
  border: "1.5px solid var(--border-main)",
  textAlign: "center"
};

const miniSlots = {
  display: "flex",
  gap: "6px",
  marginTop: "10px",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "12px"
};

const directoryBox = {
  padding: "16px",
  borderRadius: "14px",
  background: "var(--bg-card)",
  border: "1.5px solid var(--border-main)",
  minWidth: "190px"
};

const directoryGrid = {
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const bucketBox = {
  padding: "12px 18px",
  borderRadius: "10px",
  background: "var(--bg-card)",
  minWidth: "210px"
};

const bucketGrowth = {
  display: "flex",
  gap: "14px",
  justifyContent: "center",
  flexWrap: "wrap"
};

const growthBucket = {
  width: "90px",
  height: "90px",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.25s ease"
};

const keyChip = {
  padding: "8px 14px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 750,
  background: "var(--bg-card)",
  border: "1.5px solid var(--border-main)",
  color: "var(--text-primary)"
};

const chainArrow = {
  fontSize: "16px",
  fontWeight: 800,
  color: "var(--accent-primary)"
};

const successBox = {
  padding: "10px 18px",
  borderRadius: "10px",
  background: "rgba(16, 185, 129, 0.12)",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  color: "var(--accent-success)",
  fontSize: "13px",
  fontWeight: 750
};

const collisionBox = {
  padding: "10px 18px",
  borderRadius: "10px",
  background: "rgba(239, 68, 68, 0.12)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  color: "var(--accent-danger)",
  fontSize: "13px",
  fontWeight: 750
};

const infoBox = {
  padding: "10px 18px",
  borderRadius: "10px",
  background: "rgba(14, 165, 233, 0.12)",
  border: "1px solid rgba(14, 165, 233, 0.3)",
  color: "var(--accent-primary)",
  fontSize: "13px",
  fontWeight: 750
};

/* =========================================================
   FORMULA CARD COMPONENT
   ========================================================= */

function FormulaCard({ formula }) {
  if (!formula) return null;

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "24px",
        borderRadius: "16px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card-muted)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "16px" }}>📐</span>
        <strong style={{ fontSize: "14px", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--accent-primary)" }}>
          {formula.title}
        </strong>
      </div>

      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "15px",
          fontWeight: 800,
          padding: "14px 18px",
          borderRadius: "10px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-main)",
          color: "var(--text-primary)",
          whiteSpace: "pre-wrap",
          lineHeight: 1.6
        }}
      >
        {formula.equation}
      </div>

      {formula.variables && (
        <div style={{ marginTop: "16px", display: "grid", gap: "8px" }}>
          {formula.variables.map((v, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", fontSize: "13px", alignItems: "baseline" }}>
              <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--accent-primary)", fontWeight: 800, minWidth: "75px" }}>
                {v.sym}
              </code>
              <span style={{ color: "var(--text-secondary)" }}>{v.desc}</span>
            </div>
          ))}
        </div>
      )}

      {formula.note && (
        <div
          style={{
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px dashed var(--border-main)",
            fontSize: "13px",
            color: "var(--accent-secondary)",
            fontStyle: "italic"
          }}
        >
          💡 <strong>Key Takeaway:</strong> {formula.note}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TOPIC VIDEOS & AI KNOWLEDGE IMPORTED FROM learnAiKnowledge.js
   ========================================================= */


/* =========================================================
   AI LEARNING GUIDE DATA
   ========================================================= */

const aiGuideData = {
  "hash-table": {
    title: "Hash Tables",
    steps: [
      { heading: "What is a Hash Table?", content: "A hash table is a data structure that stores key-value pairs. It uses a hash function to compute an index (called a 'bucket') into an array where the value is stored or can be found.", icon: "🗂️" },
      { heading: "Why use Hash Tables?", content: "Hash tables provide O(1) average-case time complexity for insert, search, and delete operations — far faster than arrays (O(n)) or binary search trees (O(log n)) for lookups.", icon: "⚡" },
      { heading: "Core Components", content: "Three essential parts: (1) An array of buckets, (2) A hash function h(k) that maps keys to indices, (3) A collision resolution strategy for when two keys map to the same bucket.", icon: "🔧" },
      { heading: "The Hash Formula", content: "The fundamental formula: Index = h(key) = key mod m, where m is the table size. For key=42, m=5: h(42) = 42 mod 5 = 2. So key 42 goes to bucket 2.", icon: "📐" },
      { heading: "Load Factor", content: "Load factor α = n/m (keys stored / table size). Keep α < 0.75 for good performance. When α is high, collisions increase and performance degrades toward O(n).", icon: "📊" },
      { heading: "Real-World Usage", content: "Hash tables power: Python dicts, Java HashMaps, database indexes (PostgreSQL HASH indexes), caches (Redis), symbol tables in compilers, and DNS lookup tables.", icon: "🌍" },
    ]
  },
  "key": {
    title: "Hash Keys",
    steps: [
      { heading: "What is a Key?", content: "A key is the unique identifier used to store and retrieve data. Keys can be integers, strings, UUIDs, or any data type that can be deterministically converted to an integer.", icon: "🔑" },
      { heading: "Key Requirements", content: "Keys must be: (1) Deterministic — same key always produces same hash, (2) Immutable — never change a key while it's in the table, (3) Comparable — must support equality checks.", icon: "✅" },
      { heading: "String Hashing", content: "Polynomial rolling hash: h(s) = (s[0]·p^(k-1) + s[1]·p^(k-2) + ... + s[k-1]) mod M. For 'abc' with p=31: h = (97·31² + 98·31 + 99) mod M.", icon: "🔤" },
      { heading: "Integer Keys", content: "Integer keys are simplest: just apply h(k) = k mod m. For key=37, m=7: h(37) = 37 mod 7 = 2. The key maps directly to index 2.", icon: "🔢" },
      { heading: "Collisions from Keys", content: "Different keys CAN produce the same hash (collision). For m=5: h(2)=2, h(7)=2, h(12)=2 — all collide! This is normal and expected.", icon: "💥" },
      { heading: "Key Equality", content: "After hashing, you MUST verify exact key equality. If h(k1)=h(k2) but k1≠k2, it's a collision, not a match. Always check key.equals(stored_key).", icon: "⚖️" },
    ]
  },
  "hash-function": {
    title: "Hash Functions",
    steps: [
      { heading: "Purpose of Hash Functions", content: "A hash function maps an infinite key space to a finite range [0, m-1]. Goal: distribute keys uniformly so each bucket has roughly n/m keys.", icon: "🎯" },
      { heading: "Division Method", content: "h(k) = k mod m. Simple and fast. Choose m as a prime not close to a power of 2 for best distribution. Example: m=7, key=50 → h(50)=1.", icon: "➗" },
      { heading: "Multiplication Method", content: "h(k) = ⌊m · (k·A mod 1)⌋ where A=(√5-1)/2 ≈ 0.618 (golden ratio). Works for any m, doesn't require prime table sizes.", icon: "✖️" },
      { heading: "Uniform Distribution", content: "A perfect hash function distributes keys uniformly. If m=10 and n=100, each bucket should have ~10 keys. Poor functions cluster keys into few buckets.", icon: "📊" },
      { heading: "Properties of Good Functions", content: "Must be: (1) Deterministic, (2) Fast O(1) to compute, (3) Uniform distribution, (4) Avalanche effect — small input change → large output change.", icon: "⭐" },
      { heading: "Industry Hash Functions", content: "Production systems use MurmurHash3, xxHash, SipHash (DoS-resistant). Redis uses a variant of djb2. Python uses SipHash with random seed to prevent HashDoS attacks.", icon: "🏭" },
    ]
  },
  "static": {
    title: "Static Hashing",
    steps: [
      { heading: "What is Static Hashing?", content: "Static hashing uses a fixed-size table allocated at creation time. The number of buckets m never changes. Best for workloads where the data size is known in advance.", icon: "🔒" },
      { heading: "Fixed Bucket Count", content: "With m=16 buckets, every key maps to slots 0–15 via h(k) = k mod 16. The table capacity is permanently set — no resizing ever occurs.", icon: "📦" },
      { heading: "Performance Characteristics", content: "O(1) average lookup when α is low. Performance degrades predictably as α rises. At α=0.9, average probes for linear probing = ~5.5 comparisons per lookup.", icon: "📈" },
      { heading: "Overflow Buckets", content: "When a primary bucket fills (in disk-based static hashing), an overflow bucket page is chained. Each overflow page lookup costs an extra disk I/O — the main drawback.", icon: "⚠️" },
      { heading: "When to Use Static", content: "Use static hashing when: (1) Data size is known and stable, (2) Memory is constrained, (3) Simplicity is preferred over adaptability, (4) Rehashing cost is unacceptable.", icon: "✅" },
      { heading: "Static vs Dynamic", content: "Static: predictable memory, zero resize cost, poor for growing data. Dynamic: adapts to load, occasional resize overhead, better long-term performance.", icon: "⚖️" },
    ]
  },
  "collision": {
    title: "Hash Collisions",
    steps: [
      { heading: "What is a Collision?", content: "A collision occurs when two different keys k1 ≠ k2 produce the same hash value h(k1) = h(k2). This is NORMAL and unavoidable — not a bug.", icon: "💥" },
      { heading: "Why Collisions are Unavoidable", content: "Pigeonhole Principle: if n keys > m slots, at least two keys MUST share a slot. Even with n ≤ m, the Birthday Paradox shows collisions appear surprisingly early.", icon: "🐦" },
      { heading: "Birthday Paradox", content: "With m=365 days (slots) and only 23 people (keys), there's a 50.7% chance of two people sharing a birthday (collision). The math: 1 - (365!/((365-n)!·365^n)).", icon: "🎂" },
      { heading: "Collision Types", content: "Primary clustering: long runs of consecutive occupied slots (linear probing). Secondary clustering: keys with same initial hash follow same probe path (quadratic). Chaining avoids both.", icon: "🔗" },
      { heading: "Collision Resolution", content: "Two main approaches: (1) Closed Addressing (Chaining) — store multiple keys per bucket in linked lists. (2) Open Addressing (Probing) — find alternative empty slots.", icon: "🛠️" },
      { heading: "HashDoS Attacks", content: "Attackers craft keys that all hash to same bucket → O(n) lookup → server CPU 100%. Solution: SipHash with secret random key prevents attackers from predicting hash values.", icon: "🛡️" },
    ]
  },
  "chaining": {
    title: "Separate Chaining",
    steps: [
      { heading: "How Chaining Works", content: "Each bucket is the head of a linked list. When key k collides at bucket i, it's appended to bucket i's list. Bucket j is completely unaffected.", icon: "⛓️" },
      { heading: "Insertion", content: "1. Compute slot = h(k). 2. Walk the chain to verify k isn't already there. 3. Prepend or append Node(k) to the chain. Time: O(1+α) where α=n/m.", icon: "📥" },
      { heading: "Search", content: "1. Compute slot = h(k). 2. Walk the chain comparing each node's key. 3. Return node if found, null otherwise. Expected comparisons: 1 + α/2 (successful).", icon: "🔍" },
      { heading: "Load Factor > 1 OK", content: "Unlike open addressing, α can safely exceed 1.0 in chaining (e.g., α=2.5 means 2.5 keys per bucket average). Table never 'fills up'.", icon: "📈" },
      { heading: "Java HashMap", content: "Java's HashMap uses separate chaining. In Java 8+, when a single bucket's chain length > 8 (TREEIFY_THRESHOLD), it converts the linked list to a Red-Black Tree for O(log n) worst case.", icon: "☕" },
      { heading: "Memory Trade-off", content: "Pros: Never overflows, clean deletion, graceful degradation. Cons: Each node needs a 'next' pointer (8-16 bytes overhead), poor CPU cache locality due to pointer chasing.", icon: "⚖️" },
    ]
  },
  "linear": {
    title: "Linear Probing",
    steps: [
      { heading: "Core Idea", content: "All keys live in one flat array. On collision at slot s, probe slots (s+1), (s+2), (s+3)... mod m until an empty slot is found. No linked lists needed.", icon: "📏" },
      { heading: "Probe Formula", content: "h(k, i) = (h'(k) + i·c) mod m where i=0,1,2... and c=1 typically. For key 27, m=5, h'(27)=2: probe slots 2→3→4→0→1.", icon: "🔢" },
      { heading: "Primary Clustering", content: "The main problem: occupied slots form long consecutive runs. New keys extend runs → probe counts grow. A cluster of length L makes insertions take O(L) time.", icon: "🧱" },
      { heading: "Deletion Requires Tombstones", content: "Can't just mark a slot empty after deletion! This breaks probe chains. Instead mark it TOMBSTONE (DEL). Searches skip tombstones; insertions reuse them.", icon: "🪦" },
      { heading: "CPU Cache Advantage", content: "Sequential memory access = excellent CPU cache prefetching. Hardware loads entire cache lines. This is 3-5x faster than linked list traversal on modern CPUs.", icon: "💻" },
      { heading: "Load Factor Limit", content: "Keep α < 0.7. Average probes for successful search ≈ ½(1 + 1/(1-α)). At α=0.9, average probes = 5.5. At α=0.99, average probes = 50.5!", icon: "⚠️" },
    ]
  },
  "quadratic": {
    title: "Quadratic Probing",
    steps: [
      { heading: "Core Idea", content: "Instead of stepping +1 each time, step by i²: probe slots h, h+1, h+4, h+9, h+16... This leaps over the primary clusters formed by linear probing.", icon: "📈" },
      { heading: "Probe Formula", content: "h(k, i) = (h'(k) + c₁·i + c₂·i²) mod m. Common: c₁=0, c₂=1 → slots: h, h+1, h+4, h+9, h+16, h+25...", icon: "🔢" },
      { heading: "Eliminates Primary Clustering", content: "Keys starting at different slots take different paths. A cluster at position 4 is bypassed by jumping to 4+4=8, then 4+9=13. Primary clusters are effectively avoided.", icon: "✅" },
      { heading: "Secondary Clustering", content: "Keys with the SAME initial hash h'(k) follow the SAME quadratic probe sequence. This is secondary clustering — worse than linear probing's primary clustering for keys sharing home slot.", icon: "⚠️" },
      { heading: "Table Size Constraint", content: "m MUST be prime and α ≤ 0.5 to guarantee every slot is visited before cycling. With prime m and c₁=c₂=0.5: h(k,i) = (h'(k) + i/2 + i²/2) mod m covers all slots.", icon: "🔒" },
      { heading: "Use Cases", content: "Used in database buffer pool frame tables, in-memory caches. Better than linear probing for moderate loads. Worse than double hashing for eliminating clustering entirely.", icon: "🎯" },
    ]
  },
  "double": {
    title: "Double Hashing",
    steps: [
      { heading: "Core Idea", content: "Use TWO independent hash functions. h₁(k) gives the starting slot. h₂(k) gives the probe step size. Since step varies per key, even keys colliding at the same slot scatter differently.", icon: "2️⃣" },
      { heading: "Probe Formula", content: "h(k, i) = (h₁(k) + i · h₂(k)) mod m. For key 23, m=11: h₁(23)=1, h₂(23)=3. Probe sequence: 1, 4, 7, 10, 2, 5, 8, 0, 3, 6, 9 — visits ALL 11 slots!", icon: "🔢" },
      { heading: "Eliminates Both Clustering Types", content: "Primary clustering: eliminated because step sizes differ. Secondary clustering: eliminated because even keys with same h₁(k) have different h₂(k) step sizes → different sequences.", icon: "✅" },
      { heading: "h₂ Must Never Be Zero", content: "CRITICAL: if h₂(k)=0, probe formula h(k,i) = h₁(k) + 0 = constant → infinite loop! Always ensure h₂(k) ≥ 1. Common: h₂(k) = p - (k mod p) where p is prime < m.", icon: "⚠️" },
      { heading: "gcd Constraint", content: "gcd(h₂(k), m) must equal 1 to guarantee all m slots are visitable. If m is prime, any h₂(k) from 1 to m-1 works. If m=2^p, h₂(k) must be odd.", icon: "🔒" },
      { heading: "Best Open Addressing", content: "Double hashing approximates theoretical 'uniform hashing' most closely. Allows α up to 0.8 with good performance. Used in network routers, firewall lookup tables, distributed KV stores.", icon: "🏆" },
    ]
  },
  "dynamic": {
    title: "Dynamic Table Growth",
    steps: [
      { heading: "Why Dynamic Growth?", content: "Static tables fail when workload grows unexpectedly. Dynamic tables monitor load factor α and automatically resize when α exceeds a threshold (typically 0.75).", icon: "📐" },
      { heading: "Resize Trigger", content: "When α = n/m ≥ threshold (e.g., 0.75): allocate new table of size m_new = 2×m_old (next prime or power of 2), re-hash all existing n keys into new table.", icon: "⚡" },
      { heading: "Amortized O(1)", content: "A single resize costs O(n). But with doubling, resize happens after n insertions. Total work for n inserts: n + n/2 + n/4 + ... = 2n = O(n). Per-insert amortized cost: O(1).", icon: "📊" },
      { heading: "Python Dict Growth", content: "Python dict starts at 8 slots. Resizes at 2/3 full: 8→32→128→512→2048... Each resize is 4× (not 2×) to balance memory vs resize frequency.", icon: "🐍" },
      { heading: "Also Shrink When Empty", content: "When α drops below shrink threshold (e.g., 0.25 after deletions), halve the table size. This prevents large tables sitting mostly empty, wasting memory.", icon: "📉" },
      { heading: "Latency Spikes", content: "The ONE downside: the O(n) resize operation pauses the application. Real-time systems (Redis) avoid this with incremental rehashing — migrate 1 bucket per request.", icon: "⏱️" },
    ]
  },
  "rehashing": {
    title: "Rehashing",
    steps: [
      { heading: "What is Rehashing?", content: "Rehashing is the physical process of creating a new, larger table and re-inserting all existing keys using the new table's hash function h_new(k) = k mod m_new.", icon: "🔄" },
      { heading: "Why Rehash?", content: "Old table: m=4, n=3, α=0.75 → performance degrading. After rehash to m=8: all 3 keys re-mapped, α drops to 0.375. Performance restored to near-optimal.", icon: "📈" },
      { heading: "New Index Calculation", content: "Old: h_old(k) = k mod 4. New: h_new(k) = k mod 8. Keys that collided in old table often separate in new table because the divisor doubled.", icon: "🔢" },
      { heading: "Tombstone Cleanup", content: "BONUS: During rehashing, tombstone markers (DEL) from deleted keys are NOT copied to the new table. The new table starts completely clean — all those wasted slots are reclaimed!", icon: "🧹" },
      { heading: "Redis Incremental Rehashing", content: "Redis maintains ht[0] (old) and ht[1] (new) simultaneously. On every client operation, Redis migrates exactly ONE bucket from ht[0] to ht[1]. New writes go to ht[1]. Zero latency spike!", icon: "🔴" },
      { heading: "Memory During Rehash", content: "During rehashing, both old (m_old) and new (m_new = 2×m_old) tables exist simultaneously. Peak memory usage = 3× normal. Plan for this in memory-constrained environments.", icon: "💾" },
    ]
  },
  "extendible": {
    title: "Extendible Hashing",
    steps: [
      { heading: "Core Concept", content: "Extendible Hashing uses an in-memory DIRECTORY of pointers to physical disk bucket pages. Instead of rehashing everything, only the overflowing bucket splits!", icon: "📁" },
      { heading: "Global Depth (D)", content: "Directory has 2^D entries. Global depth D = how many bits of hash(k) the directory uses to route to a bucket. Initial D=1 → 2 entries. D=2 → 4 entries. D=3 → 8 entries.", icon: "🌐" },
      { heading: "Local Depth (d)", content: "Each bucket has its own local depth d ≤ D. A bucket with local depth d is pointed to by 2^(D-d) directory entries. Multiple pointers can share one physical bucket.", icon: "📍" },
      { heading: "Insertion Logic", content: "1. Compute dir_index = hash(k) & ((1<<D)-1). 2. Follow pointer to Bucket B. 3. If B has space: insert. 4. If B full: if d<D → split B, d becomes d+1. If d=D → double directory, then split.", icon: "📥" },
      { heading: "Directory Doubling", content: "When local depth d = global depth D and bucket overflows: D becomes D+1, directory size doubles (copy each entry twice). Only then can the overflowing bucket split.", icon: "2️⃣" },
      { heading: "O(1) Guarantee", content: "PostgreSQL hash indexes use extendible hashing. GUARANTEED: any record retrieval = 1 directory read + 1 bucket page read = exactly 2 disk I/Os, regardless of table size.", icon: "⚡" },
    ]
  },
  "linear-hashing": {
    title: "Linear Hashing",
    steps: [
      { heading: "Core Concept", content: "Invented by Witold Litwin (1980). Buckets split ONE BY ONE in sequential order — no directory, no exponential doubling. A 'split pointer' s tracks which bucket splits next.", icon: "📏" },
      { heading: "Split Pointer", content: "Split pointer s starts at 0. Buckets 0, 1, 2... split in order. When s reaches the round boundary (N×2^Level), Level increments and s resets to 0. Very predictable!", icon: "👉" },
      { heading: "Dual Hash Functions", content: "h_Level(k) = k mod (N × 2^Level). h_Level+1(k) = k mod (N × 2^(Level+1)). Routing rule: if h_Level(k) < s (bucket already split), use h_Level+1(k) instead.", icon: "🔢" },
      { heading: "Overflow Handling", content: "When ANY bucket overflows: temporarily use an overflow page for that bucket. Then split the bucket at pointer s (which may be different!). As s advances, overflow pages are eliminated.", icon: "💧" },
      { heading: "vs Extendible Hashing", content: "Extendible: directory can double suddenly (2× spike). Linear: grows by exactly 1 bucket at a time — completely smooth and predictable growth. No directory needed at all.", icon: "⚖️" },
      { heading: "Use Cases", content: "Ideal for append-heavy workloads where gradual, predictable growth matters. Used in file systems, database indexes where directory overhead is undesirable.", icon: "🎯" },
    ]
  },
};

/* =========================================================
   MAIN LEARN PAGE EXPORT
   ========================================================= */

function Learn() {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  const [activeTab, setActiveTab] = useState("lessons");
  const [aiTopic, setAiTopic] = useState("hash-table");
  const [aiStep, setAiStep] = useState(0);
  const [aiSubMode, setAiSubMode] = useState("tutor"); // 'tutor' | 'calculator' | 'quiz' | 'guide'
  const [playingVideo, setPlayingVideo] = useState(null);

  // AI Interactive Lab State
  const [activeInsightTab, setActiveInsightTab] = useState("analogy"); // "analogy" | "numerical" | "pitfalls" | "dbms"
  const [calcKey, setCalcKey] = useState(42);
  const [calcTableSize, setCalcTableSize] = useState(7);

  // AI Quiz State
  const [quizSelected, setQuizSelected] = useState({});
  const [quizChecked, setQuizChecked] = useState({});

  const tabs = [
    { id: "lessons", label: "📚 Lessons", desc: "Theory & Concepts" },
    { id: "videos", label: "▶️ YouTube Videos", desc: "Curated Video Tutorials" },
    { id: "ai", label: "🤖 AI Learning", desc: "Interactive AI Tutor & Lab" },
  ];

  const activeTopicId = activeTab === "ai" ? (aiTopic || selectedLesson.id) : selectedLesson.id;
  const currentAiGuide = aiGuideData[activeTopicId] || aiGuideData["hash-table"];
  const currentStep = currentAiGuide ? currentAiGuide.steps[aiStep] : null;
  const currentVideos = topicVideos[selectedLesson.id] || [];
  const currentMeta = aiTopicMeta[activeTopicId] || aiTopicMeta["hash-table"];
  const currentQuizzes = aiQuizData[activeTopicId] || [];

  // Algorithm mapping for deep link to simulator
  const algoMap = {
    "hash-table": "separate",
    "key": "separate",
    "hash-function": "separate",
    "static": "linear",
    "collision": "linear",
    "chaining": "separate",
    "linear": "linear",
    "quadratic": "quadratic",
    "double": "double",
    "dynamic": "rehashing",
    "rehashing": "rehashing",
    "extendible": "extendible",
    "linear-hashing": "linear-hashing",
  };

  return (
    <main className="placeholder-page" style={{ padding: "40px 20px 80px" }}>
      <div
        className="placeholder-card"
        style={{
          maxWidth: "1240px",
          width: "100%",
          margin: "0 auto"
        }}
      >
        <span className="section-label">HASHLAB • LEARNING ACADEMY</span>

        <h1 style={{ fontSize: "34px", fontWeight: 850, marginTop: "6px" }}>
          Interactive Database Hashing Curriculum
        </h1>

        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginTop: "10px", maxWidth: "880px" }}>
          Master the mathematical theory, exact algorithmic flows, and step-by-step memory
          behavior of all primary database hashing indexing techniques.
        </p>

        {/* TAB NAVIGATION */}
        <div style={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 22px",
                borderRadius: "12px",
                border: activeTab === tab.id ? "2px solid var(--accent-primary)" : "1.5px solid var(--border-main)",
                background: activeTab === tab.id ? "rgba(14, 165, 233, 0.12)" : "var(--bg-card)",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "14px",
                color: activeTab === tab.id ? "var(--accent-primary)" : "var(--text-primary)",
                transition: "all 0.2s ease",
                boxShadow: activeTab === tab.id ? "0 4px 14px rgba(14, 165, 233, 0.2)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "2px",
              }}
            >
              {tab.label}
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", marginTop: "2px" }}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* ===== TAB 1: LESSONS (original content) ===== */}
        {activeTab === "lessons" && (
          <>
            {/* LESSONS HORIZONTAL SELECTOR */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "12px",
                marginTop: "35px"
              }}
            >
              {lessons.map((lesson) => {
                const active = selectedLesson.id === lesson.id;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLesson(lesson)}
                    style={{
                      textAlign: "left",
                      padding: "16px",
                      borderRadius: "14px",
                      border: active ? "2px solid var(--accent-primary)" : "1.5px solid var(--border-main)",
                      background: active ? "rgba(14, 165, 233, 0.12)" : "var(--bg-card)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: active ? "0 6px 18px rgba(14, 165, 233, 0.25)" : "none"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        color: active ? "var(--accent-primary)" : "var(--text-muted)",
                        letterSpacing: "0.05em"
                      }}
                    >
                      LESSON {lesson.number}
                    </div>

                    <div
                      style={{
                        marginTop: "6px",
                        fontWeight: 800,
                        fontSize: "15px",
                        color: active ? "var(--accent-primary)" : "var(--text-primary)"
                      }}
                    >
                      {lesson.title}
                    </div>

                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "12px",
                        color: "var(--text-muted)"
                      }}
                    >
                      {lesson.category}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE LESSON DETAILS */}
            <section
              style={{
                marginTop: "40px",
                padding: "36px",
                borderRadius: "22px",
                border: "1.5px solid var(--border-main)",
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "var(--accent-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em"
                  }}
                >
                  LESSON {selectedLesson.number} • {selectedLesson.category}
                </span>
              </div>

              <h2 style={{ marginTop: "10px", fontSize: "28px", fontWeight: 850 }}>
                {selectedLesson.title}
              </h2>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--accent-secondary)"
                }}
              >
                {selectedLesson.tagline}
              </div>

              <p style={{ marginTop: "16px", fontSize: "16px", lineHeight: 1.75, color: "var(--text-secondary)" }}>
                {selectedLesson.description}
              </p>

              {/* INTUITIVE ANALOGY CALLOUT */}
              {selectedLesson.analogy && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px 20px",
                    borderRadius: "14px",
                    background: "rgba(14, 165, 233, 0.08)",
                    border: "1.5px solid rgba(14, 165, 233, 0.25)",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start"
                  }}
                >
                  <span style={{ fontSize: "20px" }}>💡</span>
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Intuitive Mental Model
                    </strong>
                    <p style={{ marginTop: "4px", fontSize: "14.5px", lineHeight: 1.6, color: "var(--text-primary)" }}>
                      {selectedLesson.analogy}
                    </p>
                  </div>
                </div>
              )}

              {/* DEDICATED MATHEMATICAL FORMULA CARD */}
              <FormulaCard formula={selectedLesson.formula} />

              {/* ALGORITHMIC STEP BREAKDOWN */}
              {selectedLesson.algorithms && (
                <div style={{ marginTop: "32px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                    <Cpu size={18} color="var(--accent-primary)" />
                    Algorithmic Lifecycle (Insert • Search • Delete)
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "16px",
                      marginTop: "16px"
                    }}
                  >
                    <div style={{ padding: "18px", borderRadius: "14px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)" }}>
                      <strong style={{ color: "#10b981", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        📥 Insertion Workflow
                      </strong>
                      <pre style={{ marginTop: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", whiteSpace: "pre-wrap", color: "var(--text-primary)", lineHeight: 1.6 }}>
                        {selectedLesson.algorithms.insert}
                      </pre>
                    </div>

                    <div style={{ padding: "18px", borderRadius: "14px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)" }}>
                      <strong style={{ color: "#38bdf8", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        🔍 Search / Lookup Workflow
                      </strong>
                      <pre style={{ marginTop: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", whiteSpace: "pre-wrap", color: "var(--text-primary)", lineHeight: 1.6 }}>
                        {selectedLesson.algorithms.search}
                      </pre>
                    </div>

                    <div style={{ padding: "18px", borderRadius: "14px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)" }}>
                      <strong style={{ color: "#f43f5e", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        🗑️ Deletion & Cleanup
                      </strong>
                      <pre style={{ marginTop: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", whiteSpace: "pre-wrap", color: "var(--text-primary)", lineHeight: 1.6 }}>
                        {selectedLesson.algorithms.delete}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* REAL-WORLD DATABASE IMPLEMENTATION */}
              {selectedLesson.realWorld && (
                <div
                  style={{
                    marginTop: "28px",
                    padding: "20px 24px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(14, 165, 233, 0.08) 100%)",
                    border: "1.5px solid rgba(99, 102, 241, 0.25)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-secondary)" }}>
                    <Database size={18} />
                    <strong style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Real-World Engineering: {selectedLesson.realWorld.title}
                    </strong>
                  </div>
                  <p style={{ marginTop: "8px", fontSize: "14.5px", lineHeight: 1.7, color: "var(--text-primary)" }}>
                    {selectedLesson.realWorld.details}
                  </p>
                </div>
              )}

              {/* COMPLEXITY MATRIX & TRADEOFFS */}
              {selectedLesson.complexity && (
                <div style={{ marginTop: "32px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "14px" }}>
                    Complexity & Performance Characteristics
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                      gap: "12px"
                    }}
                  >
                    <div style={{ padding: "14px", borderRadius: "12px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)", textAlign: "center" }}>
                      <small style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 750, textTransform: "uppercase" }}>Best Case</small>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#10b981", fontFamily: "'JetBrains Mono', monospace", marginTop: "4px" }}>
                        {selectedLesson.complexity.best}
                      </div>
                    </div>

                    <div style={{ padding: "14px", borderRadius: "12px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)", textAlign: "center" }}>
                      <small style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 750, textTransform: "uppercase" }}>Average Case</small>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", marginTop: "4px" }}>
                        {selectedLesson.complexity.average}
                      </div>
                    </div>

                    <div style={{ padding: "14px", borderRadius: "12px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)", textAlign: "center" }}>
                      <small style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 750, textTransform: "uppercase" }}>Worst Case</small>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#f43f5e", fontFamily: "'JetBrains Mono', monospace", marginTop: "4px" }}>
                        {selectedLesson.complexity.worst}
                      </div>
                    </div>

                    <div style={{ padding: "14px", borderRadius: "12px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)", textAlign: "center" }}>
                      <small style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 750, textTransform: "uppercase" }}>Space Complexity</small>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#a855f7", fontFamily: "'JetBrains Mono', monospace", marginTop: "4px" }}>
                        {selectedLesson.complexity.space}
                      </div>
                    </div>

                    <div style={{ padding: "14px", borderRadius: "12px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)", textAlign: "center" }}>
                      <small style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 750, textTransform: "uppercase" }}>Load Factor Limit</small>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#fbbf24", fontFamily: "'JetBrains Mono', monospace", marginTop: "4px" }}>
                        {selectedLesson.complexity.loadFactorLimit}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PROS & CONS */}
              {selectedLesson.tradeoffs && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "16px",
                    marginTop: "28px"
                  }}
                >
                  <div style={{ padding: "20px", borderRadius: "14px", background: "rgba(16, 185, 129, 0.06)", border: "1.5px solid rgba(16, 185, 129, 0.25)" }}>
                    <strong style={{ color: "#10b981", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle2 size={16} /> Key Advantages
                    </strong>
                    <ul style={{ marginTop: "10px", paddingLeft: "20px", fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.65 }}>
                      {selectedLesson.tradeoffs.pros.map((p, i) => (
                        <li key={i} style={{ marginBottom: "6px" }}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: "20px", borderRadius: "14px", background: "rgba(239, 68, 68, 0.06)", border: "1.5px solid rgba(239, 68, 68, 0.25)" }}>
                    <strong style={{ color: "#ef4444", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <AlertTriangle size={16} /> Architectural Constraints
                    </strong>
                    <ul style={{ marginTop: "10px", paddingLeft: "20px", fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.65 }}>
                      {selectedLesson.tradeoffs.cons.map((c, i) => (
                        <li key={i} style={{ marginBottom: "6px" }}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* KEY CORE IDEAS */}
              <h3 style={{ marginTop: "32px", fontSize: "18px", fontWeight: 800 }}>Core Principles & Architecture</h3>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  marginTop: "16px"
                }}
              >
                {selectedLesson.points.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start"
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: "16px", color: "var(--accent-success)" }}>
                      ✓
                    </span>
                    <span style={{ lineHeight: 1.6, fontSize: "15px", color: "var(--text-primary)" }}>{point}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* INTERACTIVE MULTI-PHASE ANIMATION PLAYER */}
            <HashAnimation lessonId={selectedLesson.id} />
          </>
        )}

        {/* ===== TAB 2: YOUTUBE VIDEOS ===== */}
        {activeTab === "videos" && (
          <div style={{ marginTop: "30px" }}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
                <Video size={14} /> VERIFIED ENGLISH CURRICULUM
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 850, color: "var(--text-primary)", margin: "0 0 8px" }}>
                Curated Topic-Specific Video Lessons
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
                Every video is verified in English and hand-matched to each database hashing concept. Watch directly inside HashLab or open on YouTube.
              </p>
            </div>

            {/* Video Player Modal */}
            {playingVideo && (
              <div style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0, 0, 0, 0.85)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }} onClick={() => setPlayingVideo(null)}>
                <div style={{
                  background: "#0f172a",
                  borderRadius: "20px",
                  border: "1.5px solid #1e293b",
                  width: "100%",
                  maxWidth: "920px",
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #1e293b" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>
                        HASHLAB THEATER • {playingVideo.channel}
                      </span>
                      <h4 style={{ margin: "2px 0 0", color: "#f8fafc", fontSize: "16px", fontWeight: 800 }}>
                        {playingVideo.title}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPlayingVideo(null)}
                      style={{
                        background: "#1e293b",
                        border: "none",
                        color: "#94a3b8",
                        borderRadius: "10px",
                        padding: "8px",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", background: "#000" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${playingVideo.videoId}?autoplay=1`}
                      title={playingVideo.title}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div style={{ padding: "14px 20px", background: "#090e1a", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>{playingVideo.desc}</span>
                    <a
                      href={`https://www.youtube.com/watch?v=${playingVideo.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#38bdf8", fontSize: "13px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px" }}
                    >
                      Open on YouTube <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Topic Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "28px" }}>
              {lessons.map((lesson) => {
                const active = selectedLesson.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLesson(lesson)}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: active ? "2px solid var(--accent-primary)" : "1.5px solid var(--border-main)",
                      background: active ? "rgba(14, 165, 233, 0.12)" : "var(--bg-card)",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "13px",
                      color: active ? "var(--accent-primary)" : "var(--text-primary)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "10px", display: "block", color: active ? "var(--accent-primary)" : "var(--text-muted)", marginBottom: "3px" }}>LESSON {lesson.number}</span>
                    {lesson.title}
                  </button>
                );
              })}
            </div>

            {/* Videos Grid */}
            <div style={{
              padding: "24px",
              borderRadius: "18px",
              border: "1.5px solid var(--border-main)",
              background: "var(--bg-card)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 850, color: "var(--text-primary)" }}>
                    🎯 Curated English Lessons: {selectedLesson.title}
                  </h3>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {currentVideos.length} verified educational lessons
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/simulator?algo=${algoMap[selectedLesson.id] || "separate"}`)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 16px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "13px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                  }}
                >
                  <Database size={14} /> Open in Live Simulator →
                </button>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                {currentVideos.map((video, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "240px 1fr",
                      gap: "20px",
                      padding: "18px",
                      borderRadius: "16px",
                      border: "1.5px solid var(--border-main)",
                      background: "var(--bg-card-muted)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Thumbnail with Player Trigger */}
                    <div
                      style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9", background: "#000", cursor: "pointer" }}
                      onClick={() => setPlayingVideo(video)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                        alt={video.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                      <div style={{
                        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(0,0,0,0.35)", transition: "background 0.2s ease",
                      }}>
                        <div style={{
                          width: "48px", height: "48px", borderRadius: "50%", background: "#ff0000",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 4px 14px rgba(255,0,0,0.5)",
                        }}>
                          <span style={{ color: "#fff", fontSize: "18px", marginLeft: "3px" }}>▶</span>
                        </div>
                      </div>
                      <div style={{
                        position: "absolute", bottom: "6px", right: "6px",
                        background: "rgba(0,0,0,0.85)", color: "#fff",
                        fontSize: "11px", fontWeight: 700, padding: "2px 7px", borderRadius: "5px"
                      }}>
                        {video.duration}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: "#ff0000", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            ▶ YOUTUBE LESSON
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>•</span>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)" }}>
                            {video.channel}
                          </span>
                        </div>
                        <h4 style={{ fontSize: "17px", fontWeight: 850, color: "var(--text-primary)", lineHeight: 1.35, margin: "0 0 8px" }}>
                          {video.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                          {video.desc}
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => setPlayingVideo(video)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 16px",
                            borderRadius: "9px",
                            background: "var(--accent-primary)",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 700,
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <Play size={13} fill="#fff" /> Watch in HashLab
                        </button>
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 14px",
                            borderRadius: "9px",
                            border: "1.5px solid var(--border-main)",
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            fontSize: "13px",
                            fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          Watch on YouTube <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB 3: AI LEARNING HUB ===== */}
        {activeTab === "ai" && (
          <div style={{ marginTop: "30px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(14, 165, 233, 0.12)", color: "var(--accent-primary)", padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
                  <Bot size={15} /> INTELLIGENT AI TUTOR & LAB
                </div>
                <h2 style={{ fontSize: "26px", fontWeight: 850, color: "var(--text-primary)", margin: "0 0 6px" }}>
                  Interactive AI Learning Mentor
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", margin: 0, maxWidth: "700px" }}>
                  Ask questions, walk through customized mathematical calculations, test your understanding with AI quizzes, and step through concepts.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/simulator?algo=${algoMap[activeTopicId] || "separate"}`)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #2563eb, #38bdf8)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                }}
              >
                <Database size={16} /> Open in Live Simulator →
              </button>
            </div>

            {/* Topic Selector Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "24px" }}>
              {lessons.map((lesson) => {
                const active = activeTopicId === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      setAiTopic(lesson.id);
                      setAiStep(0);
                      setAiChatMessages([]);
                      setQuizSelected({});
                      setQuizChecked({});
                    }}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: active ? "2px solid var(--accent-primary)" : "1.5px solid var(--border-main)",
                      background: active ? "rgba(14, 165, 233, 0.12)" : "var(--bg-card)",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "12.5px",
                      color: active ? "var(--accent-primary)" : "var(--text-primary)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "10px", display: "block", color: active ? "var(--accent-primary)" : "var(--text-muted)", marginBottom: "3px" }}>
                      LESSON {lesson.number}
                    </span>
                    {lesson.title}
                  </button>
                );
              })}
            </div>

            {/* Active Topic Summary Card */}
            <div style={{
              padding: "20px 24px",
              borderRadius: "16px",
              border: "1.5px solid var(--border-main)",
              background: "var(--bg-card)",
              marginBottom: "24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              alignItems: "center",
            }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase" }}>ACTIVE TOPIC</span>
                <h3 style={{ margin: "3px 0 0", fontSize: "19px", fontWeight: 850, color: "var(--text-primary)" }}>{currentMeta.name}</h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{currentMeta.category}</span>
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>FORMULA</span>
                <div style={{ fontSize: "13px", fontWeight: 700, fontFamily: "monospace", color: "#2563eb", marginTop: "3px" }}>{currentMeta.formula}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>COMPLEXITY</span>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginTop: "3px" }}>
                  Avg: <strong style={{ color: "#10b981" }}>{currentMeta.avgTime}</strong> • Worst: <strong style={{ color: "#ef4444" }}>{currentMeta.worstTime}</strong>
                </div>
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>DBMS DEPLOYMENT</span>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "3px", lineHeight: 1.4 }}>{currentMeta.dbmsUsage}</div>
              </div>
            </div>

            {/* ===== UNIFIED AI LEARNING STATION ===== */}
            <div style={{ display: "grid", gap: "24px" }}>
              {/* Active Step Walkthrough Card */}
              <div style={{
                padding: "30px 32px",
                borderRadius: "18px",
                border: "1.5px solid var(--border-main)",
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-md)",
              }}>
                {/* Step Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      🤖 AI GUIDED STEP-BY-STEP LEARNING
                    </span>
                    <h3 style={{ margin: "4px 0 0", fontSize: "22px", fontWeight: 850, color: "var(--text-primary)" }}>
                      {currentAiGuide.title}: {currentStep?.heading}
                    </h3>
                  </div>
                  <div style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background: "rgba(14, 165, 233, 0.12)",
                    color: "var(--accent-primary)",
                    fontSize: "13px",
                    fontWeight: 800,
                  }}>
                    Step {aiStep + 1} of {currentAiGuide.steps.length}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: "100%",
                  height: "6px",
                  borderRadius: "99px",
                  background: "var(--bg-card-muted)",
                  marginBottom: "26px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    borderRadius: "99px",
                    background: "linear-gradient(90deg, #2563eb, #38bdf8)",
                    width: `${((aiStep + 1) / currentAiGuide.steps.length) * 100}%`,
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }} />
                </div>

                {/* Step Content Card */}
                <div style={{
                  padding: "26px 28px",
                  borderRadius: "16px",
                  background: "rgba(14, 165, 233, 0.05)",
                  border: "1.5px solid rgba(14, 165, 233, 0.2)",
                  marginBottom: "24px",
                  minHeight: "140px",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "18px" }}>
                    <div style={{ fontSize: "40px", lineHeight: 1, flexShrink: 0 }}>
                      {currentStep?.icon}
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                        {currentStep?.heading}
                      </h4>
                      <p style={{ margin: 0, fontSize: "15.5px", lineHeight: 1.8, color: "var(--text-secondary)" }}>
                        {currentStep?.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step Navigation Bar */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border-main)",
                }}>
                  <button
                    type="button"
                    onClick={() => setAiStep((s) => Math.max(0, s - 1))}
                    disabled={aiStep === 0}
                    style={{
                      padding: "10px 22px",
                      borderRadius: "10px",
                      border: "1.5px solid var(--border-main)",
                      background: "var(--bg-card)",
                      cursor: aiStep === 0 ? "not-allowed" : "pointer",
                      fontWeight: 700,
                      fontSize: "13.5px",
                      color: aiStep === 0 ? "var(--text-muted)" : "var(--text-primary)",
                      opacity: aiStep === 0 ? 0.45 : 1,
                      transition: "all 0.2s ease",
                    }}
                  >
                    ← Previous Step
                  </button>

                  {/* Step Pill Indicators */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {currentAiGuide.steps.map((step, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAiStep(idx)}
                        style={{
                          width: idx === aiStep ? "28px" : "10px",
                          height: "10px",
                          borderRadius: "99px",
                          background: idx === aiStep ? "var(--accent-primary)" : idx < aiStep ? "rgba(14, 165, 233, 0.4)" : "var(--border-main)",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                          padding: 0,
                        }}
                        title={`Step ${idx + 1}: ${step.heading}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setAiStep((s) => Math.min(currentAiGuide.steps.length - 1, s + 1))}
                    disabled={aiStep === currentAiGuide.steps.length - 1}
                    style={{
                      padding: "10px 24px",
                      borderRadius: "10px",
                      border: "none",
                      background: aiStep === currentAiGuide.steps.length - 1 ? "var(--bg-card-muted)" : "linear-gradient(135deg, #2563eb, #38bdf8)",
                      cursor: aiStep === currentAiGuide.steps.length - 1 ? "not-allowed" : "pointer",
                      fontWeight: 800,
                      fontSize: "13.5px",
                      color: aiStep === currentAiGuide.steps.length - 1 ? "var(--text-muted)" : "#fff",
                      opacity: aiStep === currentAiGuide.steps.length - 1 ? 0.6 : 1,
                      boxShadow: aiStep === currentAiGuide.steps.length - 1 ? "none" : "0 3px 10px rgba(37,99,235,0.3)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Next Step →
                  </button>
                </div>

                {/* Completion Banner */}
                {aiStep === currentAiGuide.steps.length - 1 && (
                  <div style={{
                    marginTop: "20px",
                    padding: "16px 20px",
                    borderRadius: "14px",
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1.5px solid rgba(16, 185, 129, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "22px" }}>🎉</span>
                      <div>
                        <strong style={{ color: "#10b981", fontSize: "14px", display: "block" }}>
                          Topic Walkthrough Complete!
                        </strong>
                        <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                          You have reviewed all {currentAiGuide.steps.length} steps of {currentAiGuide.title}.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/simulator?algo=${algoMap[activeTopicId] || "separate"}`)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "9px",
                        background: "#10b981",
                        color: "#fff",
                        border: "none",
                        fontWeight: 800,
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      🚀 Open in Live Simulator →
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Live Formula Calculator & Playground */}
              <div style={{
                borderRadius: "18px",
                border: "1.5px solid var(--border-main)",
                background: "var(--bg-card)",
                padding: "24px 28px",
                boxShadow: "var(--shadow-md)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #2563eb, #38bdf8)", display: "grid", placeItems: "center", color: "#fff" }}>
                      <Calculator size={18} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 850, color: "var(--text-primary)" }}>
                        Live Concept Calculator: {currentMeta.name}
                      </h3>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Test any key and table size in real time to observe the exact mathematical slot mapping.
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "var(--text-secondary)", marginBottom: "6px", textTransform: "uppercase" }}>
                      Search Key (k)
                    </label>
                    <input
                      type="number"
                      value={calcKey}
                      onChange={(e) => setCalcKey(Number(e.target.value) || 0)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid var(--border-main)",
                        background: "var(--bg-input)",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        fontWeight: 700,
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 800, color: "var(--text-secondary)", marginBottom: "6px", textTransform: "uppercase" }}>
                      Table Capacity (m)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={calcTableSize}
                      onChange={(e) => setCalcTableSize(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid var(--border-main)",
                        background: "var(--bg-input)",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        fontWeight: 700,
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>Test Keys:</span>
                  {[7, 14, 21, 35, 42, 59, 78, 105].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setCalcKey(k)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: calcKey === k ? "1.5px solid var(--accent-primary)" : "1px solid var(--border-main)",
                        background: calcKey === k ? "rgba(14, 165, 233, 0.15)" : "var(--bg-card-muted)",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: calcKey === k ? "var(--accent-primary)" : "var(--text-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      k = {k}
                    </button>
                  ))}
                </div>

                {/* Calculated Result Display */}
                {(() => {
                  const m = Math.max(1, Number(calcTableSize) || 1);
                  const k = Number(calcKey) || 0;
                  const slot = ((k % m) + m) % m;
                  const quotient = Math.floor(k / m);
                  return (
                    <div style={{
                      padding: "16px 20px",
                      borderRadius: "14px",
                      background: "var(--bg-card-muted)",
                      border: "1.5px solid var(--border-main)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>EVALUATION:</span>
                          <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 800, color: "#2563eb" }}>
                            h({k}) = {k} mod {m} = <strong>{slot}</strong>
                          </span>
                        </div>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: "999px",
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "#10b981",
                          fontSize: "12px",
                          fontWeight: 800,
                        }}>
                          ✓ Maps Directly to Slot [{slot}]
                        </span>
                      </div>

                      {/* Visual Slots Ribbon */}
                      <div style={{
                        display: "flex",
                        gap: "6px",
                        overflowX: "auto",
                        padding: "8px 2px",
                      }}>
                        {Array.from({ length: Math.min(m, 16) }).map((_, idx) => {
                          const isTarget = idx === slot;
                          return (
                            <div
                              key={idx}
                              style={{
                                flex: "1 0 45px",
                                minWidth: "45px",
                                height: "54px",
                                borderRadius: "8px",
                                border: isTarget ? "2px solid #10b981" : "1px solid var(--border-main)",
                                background: isTarget ? "rgba(16, 185, 129, 0.18)" : "var(--bg-card)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease",
                                transform: isTarget ? "scale(1.04)" : "none",
                              }}
                            >
                              <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)" }}>[{idx}]</span>
                              <span style={{ fontSize: "13px", fontWeight: 850, color: isTarget ? "#10b981" : "var(--text-muted)", fontFamily: "monospace" }}>
                                {isTarget ? k : "—"}
                              </span>
                            </div>
                          );
                        })}
                        {m > 16 && (
                          <div style={{ display: "grid", placeItems: "center", padding: "0 10px", color: "var(--text-muted)", fontSize: "11px" }}>
                            +{m - 16} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* High-Yield AI Pedagogical Deep-Dives */}
              <div style={{
                borderRadius: "18px",
                border: "1.5px solid var(--border-main)",
                background: "var(--bg-card)",
                padding: "24px 28px",
                boxShadow: "var(--shadow-md)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", display: "grid", placeItems: "center", color: "#fff" }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 850, color: "var(--text-primary)" }}>
                      AI Concept Deep-Dives: {currentMeta.name}
                    </h3>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Select a high-yield concept lens below for concise, expert pedagogical insights.
                    </span>
                  </div>
                </div>

                {/* Insight Lens Selector Tabs */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
                  {[
                    { id: "analogy", label: "💡 Mental Model Analogy", color: "#2563eb" },
                    { id: "numerical", label: "🔢 Step-by-Step Math Trace", color: "#10b981" },
                    { id: "pitfalls", label: "⚠️ Exam Traps & Pitfalls", color: "#f59e0b" },
                    { id: "dbms", label: "🏢 Production DBMS Deployment", color: "#8b5cf6" },
                  ].map((tab) => {
                    const active = activeInsightTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveInsightTab(tab.id)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "10px",
                          border: active ? `2px solid ${tab.color}` : "1.5px solid var(--border-main)",
                          background: active ? "var(--bg-card-muted)" : "var(--bg-card)",
                          fontSize: "12.5px",
                          fontWeight: 800,
                          color: active ? tab.color : "var(--text-primary)",
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Active Insight Lens Content */}
                <div style={{
                  padding: "20px 24px",
                  borderRadius: "14px",
                  background: "var(--bg-card-muted)",
                  border: "1px solid var(--border-main)",
                  fontSize: "14.5px",
                  lineHeight: 1.75,
                  color: "var(--text-primary)",
                }}>
                  {activeInsightTab === "analogy" && (
                    <div>
                      <strong style={{ color: "#2563eb", display: "block", marginBottom: "8px", fontSize: "15px" }}>
                        💡 Intuitive Mental Model:
                      </strong>
                      <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                        {aiTutorResponses.analogy[activeTopicId] || currentMeta.analogy}
                      </p>
                    </div>
                  )}

                  {activeInsightTab === "numerical" && (
                    <div>
                      <strong style={{ color: "#10b981", display: "block", marginBottom: "8px", fontSize: "15px" }}>
                        🔢 Step-by-Step Numerical Calculation:
                      </strong>
                      <p style={{ margin: 0, fontFamily: "monospace", fontSize: "14px", color: "var(--text-primary)", background: "var(--bg-card)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-main)" }}>
                        {aiTutorResponses.numerical[activeTopicId] || `Formula: ${currentMeta.formula}. Evaluating key ${calcKey} with capacity ${calcTableSize} results in index ${((calcKey % calcTableSize) + calcTableSize) % calcTableSize}.`}
                      </p>
                    </div>
                  )}

                  {activeInsightTab === "pitfalls" && (
                    <div>
                      <strong style={{ color: "#f59e0b", display: "block", marginBottom: "8px", fontSize: "15px" }}>
                        ⚠️ Crucial University & GATE Exam Traps:
                      </strong>
                      <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                        {aiTutorResponses.pitfalls[activeTopicId] || "Always be mindful of load factor thresholds. In the worst case, extreme collisions can degrade constant O(1) time complexity into linear O(n)."}
                      </p>
                    </div>
                  )}

                  {activeInsightTab === "dbms" && (
                    <div>
                      <strong style={{ color: "#8b5cf6", display: "block", marginBottom: "8px", fontSize: "15px" }}>
                        🏢 Enterprise Database Architecture:
                      </strong>
                      <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                        {currentMeta.dbmsUsage}
                      </p>
                      <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--text-muted)" }}>
                        <strong>Average Access Complexity:</strong> {currentMeta.avgTime} • <strong>Worst Case:</strong> {currentMeta.worstTime} • <strong>Space Allocation:</strong> {currentMeta.space}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Topic Knowledge Assessment Check */}
              {currentQuizzes.length > 0 && (
                <div style={{
                  borderRadius: "18px",
                  border: "1.5px solid var(--border-main)",
                  background: "var(--bg-card)",
                  padding: "24px 28px",
                  boxShadow: "var(--shadow-md)",
                }}>
                  <div style={{ marginBottom: "16px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase" }}>
                      🎯 QUICK AI KNOWLEDGE CHECK
                    </span>
                    <h3 style={{ margin: "2px 0 0", fontSize: "18px", fontWeight: 850, color: "var(--text-primary)" }}>
                      {currentMeta.name}: Challenge Question
                    </h3>
                  </div>

                  {currentQuizzes.slice(0, 1).map((quiz, qIdx) => {
                    const isChecked = quizChecked[qIdx];
                    const selectedOpt = quizSelected[qIdx];
                    const isCorrect = selectedOpt === quiz.correct;

                    return (
                      <div key={qIdx} style={{ padding: "18px", borderRadius: "12px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                          <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--text-primary)" }}>
                            {quiz.question}
                          </h4>
                          {isChecked && (
                            <span style={{
                              padding: "4px 10px",
                              borderRadius: "999px",
                              fontSize: "11px",
                              fontWeight: 800,
                              background: isCorrect ? "#dcfce7" : "#fee2e2",
                              color: isCorrect ? "#15803d" : "#b91c1c",
                              whiteSpace: "nowrap",
                            }}>
                              {isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}
                            </span>
                          )}
                        </div>

                        <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
                          {quiz.options.map((opt, optIdx) => {
                            const isThisSelected = selectedOpt === optIdx;
                            let btnBg = "var(--bg-card)";
                            let btnBorder = "1px solid var(--border-main)";
                            if (isChecked) {
                              if (optIdx === quiz.correct) {
                                btnBg = "rgba(16, 185, 129, 0.15)";
                                btnBorder = "1.5px solid #10b981";
                              } else if (isThisSelected) {
                                btnBg = "rgba(239, 68, 68, 0.15)";
                                btnBorder = "1.5px solid #ef4444";
                              }
                            } else if (isThisSelected) {
                              btnBg = "rgba(14, 165, 233, 0.12)";
                              btnBorder = "2px solid var(--accent-primary)";
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => {
                                  if (!isChecked) {
                                    setQuizSelected((prev) => ({ ...prev, [qIdx]: optIdx }));
                                  }
                                }}
                                style={{
                                  textAlign: "left",
                                  padding: "9px 13px",
                                  borderRadius: "9px",
                                  background: btnBg,
                                  border: btnBorder,
                                  fontSize: "13px",
                                  color: "var(--text-primary)",
                                  fontWeight: isThisSelected ? 700 : 500,
                                  cursor: isChecked ? "default" : "pointer",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <span style={{ fontWeight: 800, marginRight: "8px" }}>
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {!isChecked ? (
                          <button
                            type="button"
                            disabled={selectedOpt === undefined}
                            onClick={() => setQuizChecked((prev) => ({ ...prev, [qIdx]: true }))}
                            style={{
                              padding: "8px 18px",
                              borderRadius: "8px",
                              background: selectedOpt !== undefined ? "var(--accent-primary)" : "var(--bg-card)",
                              color: selectedOpt !== undefined ? "#fff" : "var(--text-muted)",
                              border: "none",
                              fontWeight: 700,
                              fontSize: "13px",
                              cursor: selectedOpt !== undefined ? "pointer" : "not-allowed",
                            }}
                          >
                            Check Answer
                          </button>
                        ) : (
                          <div style={{
                            padding: "10px 14px",
                            borderRadius: "8px",
                            background: isCorrect ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                            border: isCorrect ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(239, 68, 68, 0.25)",
                            fontSize: "12.5px",
                            lineHeight: 1.5,
                            color: "var(--text-secondary)",
                          }}>
                            <strong style={{ color: isCorrect ? "#10b981" : "#ef4444", display: "block", marginBottom: "3px" }}>
                              AI Explanation:
                            </strong>
                            {quiz.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default Learn;
