/**
 * HashLab Shared Hashing Engine
 * Pure mathematical algorithms and puzzle validation functions.
 * One single source of truth shared across all games.
 */

/**
 * Safe modulo operation handling negative numbers and circular wraparound:
 * ((k % m) + m) % m
 */
export function hashModulo(key, capacity) {
  const k = Number(key);
  const m = Number(capacity);
  if (!Number.isFinite(k) || !Number.isFinite(m) || m <= 0) {
    return 0;
  }
  return ((Math.floor(k) % m) + m) % m;
}

/**
 * Standard linear probing formula:
 * h(k, i) = (h1(k) + i) % m
 */
export function linearProbe(key, step, capacity) {
  const h1 = hashModulo(key, capacity);
  const i = Math.max(0, Math.floor(Number(step) || 0));
  const m = Math.max(1, Math.floor(Number(capacity) || 1));
  return (h1 + i) % m;
}

/**
 * Quadratic probing formula:
 * h(k, i) = (h1(k) + c1 * i + c2 * i^2) % m
 * By default c1 = 0, c2 = 1 (standard i^2 jump: +0, +1, +4, +9...)
 */
export function quadraticProbe(key, step, capacity, c1 = 0, c2 = 1) {
  const h1 = hashModulo(key, capacity);
  const i = Math.max(0, Math.floor(Number(step) || 0));
  const m = Math.max(1, Math.floor(Number(capacity) || 1));
  const raw = h1 + Number(c1) * i + Number(c2) * i * i;
  return ((Math.floor(raw) % m) + m) % m;
}

/**
 * Default second hash function for double hashing:
 * h2(k) = q - (k % q), where q is typically a prime smaller than m
 * Ensures h2(k) is strictly non-zero: [1, q]
 */
export function defaultH2(key, prime = 5) {
  const k = Math.abs(Math.floor(Number(key) || 0));
  const q = Math.max(2, Math.floor(Number(prime) || 5));
  const mod = k % q;
  return q - mod;
}

/**
 * Double hashing probing formula:
 * h(k, i) = (h1(k) + i * h2(k)) % m
 */
export function doubleHashProbe(key, step, capacity, h2Value = null, prime = 5) {
  const h1 = hashModulo(key, capacity);
  const i = Math.max(0, Math.floor(Number(step) || 0));
  const m = Math.max(1, Math.floor(Number(capacity) || 1));
  const stride = h2Value !== null && Number.isFinite(h2Value) && h2Value > 0
    ? Math.floor(h2Value)
    : defaultH2(key, prime);
  return (h1 + i * stride) % m;
}

/**
 * Calculate the load factor: alpha = n / m
 */
export function calculateLoadFactor(storedKeysCount, capacity) {
  const n = Math.max(0, Number(storedKeysCount) || 0);
  const m = Math.max(1, Number(capacity) || 1);
  return Number((n / m).toFixed(4));
}

/**
 * Generate full probe sequence for inserting a key into a given table state.
 * Returns: {
 *   homeBucket: number,
 *   probes: Array<{ step: number, bucket: number, occupied: boolean, occupantKey: number|null }>,
 *   finalBucket: number | null,
 *   collisionsCount: number,
 *   isFull: boolean
 * }
 */
export function computeProbeSequence(key, currentBuckets, strategy = 'linear', options = {}) {
  const m = currentBuckets.length;
  const home = hashModulo(key, m);
  const probes = [];
  let collisionsCount = 0;
  let finalBucket = null;

  const maxSteps = options.maxSteps || m;
  const c1 = options.c1 ?? 0;
  const c2 = options.c2 ?? 1;
  const prime = options.prime ?? 5;
  const h2Val = options.h2Value ?? (strategy === 'double' ? defaultH2(key, prime) : null);

  for (let step = 0; step < maxSteps; step++) {
    let bucketIndex;
    if (strategy === 'linear') {
      bucketIndex = linearProbe(key, step, m);
    } else if (strategy === 'quadratic') {
      bucketIndex = quadraticProbe(key, step, m, c1, c2);
    } else if (strategy === 'double') {
      bucketIndex = doubleHashProbe(key, step, m, h2Val, prime);
    } else {
      bucketIndex = (home + step) % m;
    }

    const bucket = currentBuckets[bucketIndex];
    const isOccupied = bucket && (bucket.occupied || (Array.isArray(bucket.keys) && bucket.keys.length > 0) || bucket.key !== null);
    const occupant = bucket ? (bucket.key ?? (Array.isArray(bucket.keys) ? bucket.keys[0] : null)) : null;

    probes.push({
      step,
      bucket: bucketIndex,
      occupied: Boolean(isOccupied),
      occupantKey: occupant
    });

    if (isOccupied) {
      collisionsCount++;
    } else {
      finalBucket = bucketIndex;
      break;
    }
  }

  return {
    homeBucket: home,
    probes,
    finalBucket,
    collisionsCount,
    isFull: finalBucket === null
  };
}

/**
 * Simulates sequential insertion of keys into an open-addressing table.
 */
export function simulateOpenAddressingTable(keys, capacity, strategy = 'linear', options = {}) {
  const m = Math.max(1, Number(capacity) || 7);
  const table = Array.from({ length: m }, (_, id) => ({
    id,
    key: null,
    occupied: false
  }));

  const operations = [];
  let totalCollisions = 0;
  let totalProbes = 0;

  for (const key of keys) {
    const seq = computeProbeSequence(key, table, strategy, options);
    totalCollisions += seq.collisionsCount;
    totalProbes += seq.probes.length;

    if (seq.finalBucket !== null) {
      table[seq.finalBucket].key = key;
      table[seq.finalBucket].occupied = true;
      operations.push({
        key,
        status: 'INSERTED',
        finalBucket: seq.finalBucket,
        homeBucket: seq.homeBucket,
        probes: seq.probes,
        collisions: seq.collisionsCount
      });
    } else {
      operations.push({
        key,
        status: 'TABLE_FULL',
        finalBucket: null,
        homeBucket: seq.homeBucket,
        probes: seq.probes,
        collisions: seq.collisionsCount
      });
    }
  }

  return {
    capacity: m,
    table,
    operations,
    totalCollisions,
    totalProbes,
    loadFactor: calculateLoadFactor(keys.filter((_, i) => operations[i]?.status === 'INSERTED').length, m)
  };
}

/**
 * Simulates sequential insertion of keys into a separate chaining table.
 */
export function simulateChainingTable(keys, capacity) {
  const m = Math.max(1, Number(capacity) || 5);
  const table = Array.from({ length: m }, (_, id) => ({
    id,
    keys: []
  }));

  let totalCollisions = 0;
  const operations = [];

  for (const key of keys) {
    const bucket = hashModulo(key, m);
    const hadCollision = table[bucket].keys.length > 0;
    if (hadCollision) totalCollisions++;
    table[bucket].keys.push(key);
    operations.push({
      key,
      bucket,
      collision: hadCollision,
      chainLengthAfter: table[bucket].keys.length
    });
  }

  return {
    capacity: m,
    table,
    operations,
    totalCollisions,
    loadFactor: calculateLoadFactor(keys.length, m)
  };
}

/**
 * Simulates Rehashing into a new capacity.
 * Verifies that all keys are preserved and re-inserted via new hash function.
 */
export function simulateRehash(oldKeys, newCapacity, strategy = 'linear', options = {}) {
  const result = simulateOpenAddressingTable(oldKeys, newCapacity, strategy, options);
  
  // Mapping of each key to its new bucket
  const keyMapping = {};
  for (const op of result.operations) {
    if (op.status === 'INSERTED') {
      keyMapping[op.key] = op.finalBucket;
    }
  }

  return {
    newCapacity,
    newTable: result.table,
    operations: result.operations,
    totalCollisions: result.totalCollisions,
    totalProbes: result.totalProbes,
    loadFactor: result.loadFactor,
    keyMapping,
    allKeysPreserved: oldKeys.every(k => keyMapping[k] !== undefined)
  };
}

/**
 * Validates a Linked List pointer chain for Separate Chaining.
 * Checks:
 * - Reachability of every expected key from bucket head
 * - Next-pointer relationships
 * - Correct NULL termination
 * - Absence of unintended cycles
 */
export function validatePointerChain({ bucketHeadId, nodes, expectedKeysOrder }) {
  if (!nodes || typeof nodes !== 'object') {
    return { valid: false, error: 'Nodes definition missing.' };
  }

  const visited = new Set();
  const traversal = [];
  let currentId = bucketHeadId;

  while (currentId !== null && currentId !== undefined) {
    if (visited.has(currentId)) {
      return {
        valid: false,
        error: `Cycle detected in linked list! Node '${currentId}' points back to an already visited node.`,
        cycle: true,
        traversal
      };
    }
    visited.add(currentId);

    const node = nodes[currentId];
    if (!node) {
      return {
        valid: false,
        error: `Dangling pointer! Node '${currentId}' does not exist in memory.`,
        traversal
      };
    }

    traversal.push(node.key);
    currentId = node.next;
  }

  // Traversal finished at NULL
  // Now verify reached keys against expected keys
  if (expectedKeysOrder.length !== traversal.length) {
    return {
      valid: false,
      error: `Chain length mismatch. Expected [${expectedKeysOrder.join(' -> ')} -> NULL] but found [${traversal.join(' -> ')} -> NULL].`,
      traversal,
      expected: expectedKeysOrder
    };
  }

  for (let i = 0; i < expectedKeysOrder.length; i++) {
    if (traversal[i] !== expectedKeysOrder[i]) {
      return {
        valid: false,
        error: `Order mismatch at position ${i + 1}. Expected Key ${expectedKeysOrder[i]} but found ${traversal[i]}.`,
        traversal,
        expected: expectedKeysOrder
      };
    }
  }

  return {
    valid: true,
    traversal,
    message: 'Chain valid: all nodes reachable with proper NULL termination and no cycles.'
  };
}

/**
 * Validates player answer for Hash Detective cases.
 * Verifies if candidate algorithm matches observed final table snapshot.
 */
export function evaluateDetectiveHypothesis(caseData, candidateStrategy) {
  const { m, keys, actualAlgorithm } = caseData;
  const isMatch = candidateStrategy.toLowerCase() === actualAlgorithm.toLowerCase();
  
  // Return validation detail
  return {
    isCorrect: isMatch,
    chosen: candidateStrategy,
    actual: actualAlgorithm,
    explanation: caseData.explanations?.[candidateStrategy.toLowerCase()] || 
      (isMatch ? 'Algorithm fits the evidence perfectly.' : 'Algorithm contradicts observed evidence.')
  };
}
