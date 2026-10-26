// client/src/data/referencesData.js

export const referencesData = [
  {
    id: 1,
    title: "Database System Concepts (7th Edition)",
    type: "Textbook",
    typeLabel: "📚 Core DBMS Textbook",
    authors: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
    venue: "McGraw-Hill Education",
    year: "2019",
    isbn: "ISBN: 978-0078022159",
    url: "https://www.db-book.com/",
    usedIn: [
      "Dynamic & Static Hashing Architecture",
      "Extendible Hashing Directory Doubling",
      "Hash-based vs B+ Tree Indexing Trade-offs",
      "Grace Hash Join & Multi-pass Partitioning",
      "Storage Block Buffer Management"
    ],
    summary:
      "The definitive reference for database systems education worldwide. Chapters 11 and 12 provide comprehensive coverage of static and dynamic hashing algorithms, bucket splitting, directory expansion, and query execution operators.",
    quote:
      "Extendible hashing solves the degradation problem of static hashing by allowing the hash function to be modified dynamically as records are inserted and deleted.",
    citation:
      "Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019). Database System Concepts (7th ed.). McGraw-Hill Education."
  },
  {
    id: 2,
    title: "Introduction to Algorithms (CLRS, 4th Edition)",
    type: "Textbook",
    typeLabel: "📚 Algorithms Reference",
    authors: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    venue: "MIT Press",
    year: "2022",
    isbn: "ISBN: 978-0262046305",
    url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
    usedIn: [
      "Simple Uniform Hashing Assumption (SUHA)",
      "Open Addressing Probing Formulations (Linear, Quadratic, Double)",
      "Unsuccessful & Successful Search Expected Probes",
      "Universal Hashing Collision Theorems",
      "Dynamic Table Expansion Amortized O(1) Proof"
    ],
    summary:
      "The global benchmark textbook on algorithms and data structures. Chapter 11 ('Hash Tables') establishes the rigorous mathematical foundation for hash functions, open addressing collision resolution, and universal hashing used throughout HashLab.",
    quote:
      "In an open-address hash table with load factor α = n/m < 1, the expected number of probes in an unsuccessful search is at most 1/(1 - α), assuming uniform hashing.",
    citation:
      "Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). Introduction to Algorithms (4th ed.). MIT Press."
  },
  {
    id: 3,
    title: "Fundamentals of Database Systems (7th Edition)",
    type: "Textbook",
    typeLabel: "📚 Core DBMS Textbook",
    authors: "Ramez Elmasri, Shamkant B. Navathe",
    venue: "Pearson Education",
    year: "2015",
    isbn: "ISBN: 978-0133970777",
    url: "https://www.pearson.com/en-us/subject-catalog/p/fundamentals-of-database-systems/P200000003310",
    usedIn: [
      "Primary & Secondary Hash Indexing",
      "External Hashing on Disk Storage Blocks",
      "Bucket Capacity & Overflow Block Chaining",
      "Dynamic File Organization"
    ],
    summary:
      "An authoritative database textbook emphasizing physical database design and file organization. Chapters 16 and 17 detail how hash indexes organize records on physical disk pages and manage overflow buckets.",
    quote:
      "Hashing provides very fast access to records on search conditions involving equality comparison on a hash key attribute.",
    citation:
      "Elmasri, R., & Navathe, S. B. (2015). Fundamentals of Database Systems (7th ed.). Pearson."
  },
  {
    id: 4,
    title: "The Art of Computer Programming, Volume 3: Sorting and Searching (2nd Edition)",
    type: "Textbook",
    typeLabel: "📚 Foundational Monograph",
    authors: "Donald E. Knuth",
    venue: "Addison-Wesley Professional",
    year: "1998",
    isbn: "ISBN: 978-0201896855",
    url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html",
    usedIn: [
      "Primary Clustering Formula: E[Unsuccessful] ≈ 0.5 · [1 + 1/(1 - α)²]",
      "Linear Probing Average Search Length Derivations",
      "Quadratic Probing Triangular Number Sequences",
      "Secondary Clustering Mathematical Foundations"
    ],
    summary:
      "Donald Knuth's monumental treatise contains the seminal mathematical analysis of hashing techniques. Section 6.4 introduces the exact closed-form expressions for expected probes under primary clustering that HashLab calculates in real time.",
    quote:
      "The primary clustering effect causes linear probing to run slower than independent probe sequences when the table becomes more than 70% full.",
    citation:
      "Knuth, D. E. (1998). The Art of Computer Programming, Volume 3: Sorting and Searching (2nd ed.). Addison-Wesley."
  },
  {
    id: 5,
    title: "Database Management Systems (3rd Edition)",
    type: "Textbook",
    typeLabel: "📚 DBMS Implementation Textbook",
    authors: "Raghu Ramakrishnan, Johannes Gehrke",
    venue: "McGraw-Hill Education",
    year: "2002",
    isbn: "ISBN: 978-0072465631",
    url: "https://pages.cs.wisc.edu/~dbbook/",
    usedIn: [
      "Linear Hashing Split Pointer (s) Progression",
      "Extendible vs Linear Hashing Architectural Comparison",
      "Directory-less File Organization",
      "Clustered vs Unclustered Index Trade-offs"
    ],
    summary:
      "Widely known as the 'Cow Book', this classic text provides deep practical insight into the implementation trade-offs of database storage structures, with comprehensive chapters on Extendible Hashing and Linear Hashing.",
    quote:
      "Linear Hashing does not require a directory, yet handles dynamic file growth gracefully through sequential bucket splitting.",
    citation:
      "Ramakrishnan, R., & Gehrke, J. (2002). Database Management Systems (3rd ed.). McGraw-Hill."
  },
  {
    id: 6,
    title: "Extendible Hashing—A Fast Access Method for Dynamic Files",
    type: "Paper",
    typeLabel: "📄 Seminal Research Paper",
    authors: "Ronald Fagin, Jurg Nievergelt, Nicholas Pippenger, H. Raymond Strong",
    venue: "ACM Transactions on Database Systems (TODS), Vol. 4, No. 3",
    year: "1979",
    isbn: "DOI: 10.1145/320083.320092",
    url: "https://doi.org/10.1145/320083.320092",
    usedIn: [
      "Original Extendible Hashing Algorithm Formulation",
      "Global Depth (D) & Local Depth (d_i) Mathematical Duality",
      "Directory Doubling Condition (d_i == D)",
      "2^(D - d_i) Pointer Redistribution Invariant",
      "Guaranteed Maximum 2 Disk I/Os for Equality Search"
    ],
    summary:
      "The landmark original paper that introduced Extendible Hashing to computer science. Proved that dynamic directory expansion paired with localized bucket splits guarantees O(1) disk I/O while adapting gracefully to unbounded file growth.",
    quote:
      "Extendible hashing combines a directory with flexible leaf buckets, allowing files to grow and shrink dynamically while guaranteeing access in at most two disk operations.",
    citation:
      "Fagin, R., Nievergelt, J., Pippenger, N., & Strong, H. R. (1979). Extendible hashing—a fast access method for dynamic files. ACM Transactions on Database Systems (TODS), 4(3), 315-344."
  },
  {
    id: 7,
    title: "Linear Hashing: A New Tool for File and Table Addressing",
    type: "Paper",
    typeLabel: "📄 Seminal Research Paper",
    authors: "Witold Litwin",
    venue: "Proceedings of the 6th International Conference on Very Large Data Bases (VLDB)",
    year: "1980",
    isbn: "VLDB 1980 Proceedings (pp. 212–223)",
    url: "https://www.vldb.org/conf/1980/p212-litwin.pdf",
    usedIn: [
      "Directory-less Dynamic Hashing Architecture",
      "Split Pointer Round-Robin Progression",
      "Dual Hash Function Family h_i and h_{i+1}",
      "Graceful 1-bucket Expansion per Split"
    ],
    summary:
      "Witold Litwin's groundbreaking paper introduced Linear Hashing, eliminating the central directory required by Extendible Hashing by splitting buckets in linear sequential order, avoiding directory page bottlenecks.",
    quote:
      "A file expands by one bucket at a time; buckets are split in a predetermined order regardless of which bucket actually overflowed.",
    citation:
      "Litwin, W. (1980). Linear hashing: A new tool for file and table addressing. In Proceedings of the 6th International Conference on Very Large Data Bases (VLDB '80) (pp. 212-223)."
  },
  {
    id: 8,
    title: "Universal Classes of Hash Functions",
    type: "Paper",
    typeLabel: "📄 Seminal Research Paper",
    authors: "J. Lawrence Carter, Mark N. Wegman",
    venue: "Journal of Computer and System Sciences (JCSS), Vol. 18, No. 2",
    year: "1979",
    isbn: "DOI: 10.1016/0022-0000(79)90044-8",
    url: "https://doi.org/10.1016/0022-0000(79)90044-8",
    usedIn: [
      "Universal Hashing Definition: |{h: h(x)=h(y)}| ≤ |H| / m",
      "Randomized Defense Against Adversarial Worst-Case Inputs",
      "Affine Universal Family: h_{a,b}(k) = ((ak + b) mod p) mod m",
      "Collision Probability Upper Bound Proofs"
    ],
    summary:
      "The foundational paper that introduced Universal Hashing. Carter and Wegman proved that selecting a hash function uniformly at random from a 2-universal family guarantees O(1) expected time for all dictionary operations, neutralizing malicious inputs.",
    quote:
      "Choosing a hash function at random from a universal class guarantees that no single key sequence can force worst-case performance.",
    citation:
      "Carter, J. L., & Wegman, M. N. (1979). Universal classes of hash functions. Journal of Computer and System Sciences, 18(2), 143-154."
  },
  {
    id: 9,
    title: "Cuckoo Hashing",
    type: "Paper",
    typeLabel: "📄 Seminal Research Paper",
    authors: "Rasmus Pagh, Flemming Friche Rodler",
    venue: "Journal of Algorithms, Vol. 51, No. 2",
    year: "2004",
    isbn: "DOI: 10.1016/j.jalgor.2003.12.002",
    url: "https://doi.org/10.1016/j.jalgor.2003.12.002",
    usedIn: [
      "Worst-Case O(1) Lookup Guarantee (Max 2 Probes)",
      "Dual Hash Tables T₁ and T₂ Architecture",
      "Eviction Cascade & Key Dislocation Dynamics",
      "Cycle Detection and Global Table Rehashing"
    ],
    summary:
      "Introduced Cuckoo Hashing, a breakthrough open-addressing scheme providing worst-case constant lookup time (inspecting at most 2 candidate slots) combined with amortized constant insertion time.",
    quote:
      "A dictionary with constant lookup time in the worst case and O(1) expected insertion time, requiring space close to optimal.",
    citation:
      "Pagh, R., & Rodler, F. F. (2004). Cuckoo hashing. Journal of Algorithms, 51(2), 122-144."
  },
  {
    id: 10,
    title: "PostgreSQL Documentation: Chapter 64 - Hash Indexes",
    type: "Specification",
    typeLabel: "🌐 Production Database Engine Specification",
    authors: "The PostgreSQL Global Development Group",
    venue: "PostgreSQL Official Documentation (v16/v17)",
    year: "2024",
    isbn: "Official PostgreSQL Technical Architecture",
    url: "https://www.postgresql.org/docs/current/hash-intro.html",
    usedIn: [
      "Production-Grade Linear Hashing Implementation",
      "Write-Ahead Log (WAL) Crash Recovery for Hash Indexes",
      "Page Group Bucket Allocation and Splitting",
      "Overflow Page Chaining & Concurrency Locking"
    ],
    summary:
      "The official technical documentation for PostgreSQL's physical hash index implementation. Explains how enterprise relational databases utilize modified Linear Hashing on disk with concurrency latches, split pointers, and overflow chains.",
    quote:
      "PostgreSQL hash indexes use a variant of Linear Hashing to dynamically adjust to changing table sizes without blocking concurrent lookups.",
    citation:
      "PostgreSQL Global Development Group. (2024). Chapter 64: Hash Indexes. PostgreSQL 16.0 Documentation."
  },
  {
    id: 11,
    title: "GateOverflow Examination Archive & Question Repository",
    type: "Archive",
    typeLabel: "🎓 Competitive Exam Repository",
    authors: "GateOverflow Community (Arjun Suresh et al.)",
    venue: "GateOverflow.in",
    year: "2025",
    isbn: "Verified GATE CS/IT & UGC-NET Computer Science Archive",
    url: "https://gateoverflow.in/",
    usedIn: [
      "Official GATE CSE (2004–2025) Hashing Questions & Keys",
      "GATE Data Science & AI (2024) Hashing Questions",
      "ISRO Scientist/Engineer SC & BARC OCES Hashing Papers",
      "UGC-NET Computer Science Examination Rubrics",
      "Step-by-step Community Derivations and Numerical Verifications"
    ],
    summary:
      "The premier open-source repository of verified past competitive examination papers for Computer Science and Information Technology in India. All question statements, answer keys, and exam citations in HashLab's Question Bank cross-reference GateOverflow records.",
    quote:
      "Comprehensive peer-reviewed solutions and source citations for all GATE CS/IT competitive hashing and data structures examination problems.",
    citation:
      "GateOverflow. (2025). Question Bank for Computer Science & Information Technology. https://gateoverflow.in/"
  },
  {
    id: 12,
    title: "NPTEL / IIT Madras: Database Indexing & Storage Architecture Course",
    type: "Archive",
    typeLabel: "🎓 Academic University Courseware",
    authors: "Prof. P. Sreenivasa Kumar (Dept. of CSE, IIT Madras)",
    venue: "NPTEL / SWAYAM, Ministry of Education, Govt. of India",
    year: "2022",
    isbn: "Course Code: 106106093",
    url: "https://nptel.ac.in/courses/106106093",
    usedIn: [
      "Physical Storage & Indexing Structures",
      "Extendible Hashing Step-by-step Directory Doubling Traces",
      "Linear Hashing Split Level & Pointer Calculations",
      "Disk Access Cost Models for Hash Index Lookups"
    ],
    summary:
      "The official university courseware on database systems produced by IIT Madras under the National Programme on Technology Enhanced Learning (NPTEL). Provides pedagogically rigorous walkthroughs of dynamic hashing and index performance models.",
    quote:
      "Dynamic hashing methods allow databases to maintain rapid single-probe record access without periodic reorganization.",
    citation:
      "Kumar, P. S. (2022). Database Design & Indexing. National Programme on Technology Enhanced Learning (NPTEL), IIT Madras."
  }
];

export const referenceFilterOptions = [
  "All References",
  "Textbooks",
  "Research Papers",
  "Specifications & Archives"
];
