/**
 * HashLab Automated Engine Unit Tests
 * Run with: node src/algorithms/gameEngine.test.js
 */

import {
  hashModulo,
  linearProbe,
  quadraticProbe,
  doubleHashProbe,
  defaultH2,
  calculateLoadFactor,
  computeProbeSequence,
  simulateOpenAddressingTable,
  simulateChainingTable,
  simulateRehash,
  validatePointerChain
} from './gameEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr === expectedStr) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message} (Expected ${expectedStr}, got ${actualStr})`);
  }
}

console.log('\n=== RUNNING HASHLAB SHARED ENGINE TESTS ===\n');

// 1. Modulo Hashing
console.log('1. Testing Modulo Hashing:');
assertEqual(hashModulo(17, 7), 3, '17 % 7 === 3');
assertEqual(hashModulo(24, 7), 3, '24 % 7 === 3');
assertEqual(hashModulo(31, 7), 3, '31 % 7 === 3');
assertEqual(hashModulo(19, 7), 5, '19 % 7 === 5');
assertEqual(hashModulo(-3, 7), 4, '-3 % 7 with safe wraparound === 4');
assertEqual(hashModulo(0, 7), 0, '0 % 7 === 0');

// 2. Linear Probing & Sequence Simulation
console.log('\n2. Testing Linear Probing (Collision Buster & Room 2 example):');
// Keys: 17, 24, 31, 10 into table of size 7
// 17 % 7 = 3 -> bucket 3
// 24 % 7 = 3 -> collides at 3, moves to (3+1)%7 = 4
// 31 % 7 = 3 -> collides at 3, collides at 4, moves to (3+2)%7 = 5
// 10 % 7 = 3 -> collides at 3, 4, 5, moves to (3+3)%7 = 6
const simLinear = simulateOpenAddressingTable([17, 24, 31, 10], 7, 'linear');
assertEqual(simLinear.table[3].key, 17, 'Bucket 3 contains 17');
assertEqual(simLinear.table[4].key, 24, 'Bucket 4 contains 24');
assertEqual(simLinear.table[5].key, 31, 'Bucket 5 contains 31');
assertEqual(simLinear.table[6].key, 10, 'Bucket 6 contains 10');
assertEqual(simLinear.totalCollisions, 6, 'Total collisions = 0 + 1 + 2 + 3 = 6');

// Test Wraparound in Linear Probing
console.log('\n3. Testing Linear Probing Wraparound:');
// Capacity 7, keys [6, 13, 20]: all hash to 6
// 6 -> bucket 6
// 13 -> collides at 6, wraps around to bucket 0
// 20 -> collides at 6, 0, lands in bucket 1
const simWrap = simulateOpenAddressingTable([6, 13, 20], 7, 'linear');
assertEqual(simWrap.table[6].key, 6, 'Bucket 6 contains 6');
assertEqual(simWrap.table[0].key, 13, 'Bucket 0 contains 13 (wrapped)');
assertEqual(simWrap.table[1].key, 20, 'Bucket 1 contains 20 (wrapped)');

// 4. Quadratic Probing
console.log('\n4. Testing Quadratic Probing:');
// Capacity 11, keys [14, 25, 36]: all hash to 3
// 14 -> bucket 3
// 25 -> collides at 3, step 1: (3 + 1^2) % 11 = 4
// 36 -> collides at 3, collides at 4, step 2: (3 + 2^2) % 11 = 7
const simQuad = simulateOpenAddressingTable([14, 25, 36], 11, 'quadratic');
assertEqual(simQuad.table[3].key, 14, 'Bucket 3 contains 14');
assertEqual(simQuad.table[4].key, 25, 'Bucket 4 contains 25 (jump +1)');
assertEqual(simQuad.table[7].key, 36, 'Bucket 7 contains 36 (jump +4)');

// 5. Double Hashing
console.log('\n5. Testing Double Hashing:');
// Capacity 7, h1(k) = k % 7, h2(k) = 5 - (k % 5)
// Key 10: h1 = 3, placed at 3
// Key 17: h1 = 3 (collides at 3), h2(17) = 5 - (17 % 5) = 5 - 2 = 3.
// Probe 1: (3 + 1 * 3) % 7 = 6 -> placed at 6
const h2_17 = defaultH2(17, 5);
assertEqual(h2_17, 3, 'h2(17) = 5 - (17 % 5) = 3');
const simDouble = simulateOpenAddressingTable([10, 17], 7, 'double', { prime: 5 });
assertEqual(simDouble.table[3].key, 10, 'Bucket 3 contains 10');
assertEqual(simDouble.table[6].key, 17, 'Bucket 6 contains 17 (jump +3)');

// 6. Separate Chaining
console.log('\n6. Testing Separate Chaining:');
// Capacity 5, keys [12, 17, 22] all hash to 2
const simChain = simulateChainingTable([12, 17, 22], 5);
assertEqual(simChain.table[2].keys, [12, 17, 22], 'Bucket 2 contains chain [12, 17, 22]');
assertEqual(simChain.table[0].keys.length, 0, 'Bucket 0 is empty');
assertEqual(simChain.table[1].keys.length, 0, 'Bucket 1 is empty');

// 7. Rehashing & Key Preservation (Rehash Rescue & Room 4 example)
console.log('\n7. Testing Rehashing (Example from prompt):');
// Old capacity 5, Keys: 12, 22, 32, 7
// New capacity 11, h(k) = k % 11
// Expected positions: 12 -> 1, 22 -> 0, 32 -> 10, 7 -> 7
const oldKeys = [12, 22, 32, 7];
const rehashRes = simulateRehash(oldKeys, 11, 'linear');
assertEqual(rehashRes.keyMapping[12], 1, '12 -> bucket 1');
assertEqual(rehashRes.keyMapping[22], 0, '22 -> bucket 0');
assertEqual(rehashRes.keyMapping[32], 10, '32 -> bucket 10');
assertEqual(rehashRes.keyMapping[7], 7, '7 -> bucket 7');
assert(rehashRes.allKeysPreserved, 'All keys preserved');
assertEqual(rehashRes.loadFactor, calculateLoadFactor(4, 11), 'Load factor correctly calculated for 4/11');

// 8. Pointer Chain Validation (Room 3 The Broken Chain)
console.log('\n8. Testing Pointer Chain Validation:');
// Valid chain: bucket head -> node-11 -> node-21 -> null
const validGraph = {
  bucketHeadId: 'node-11',
  nodes: {
    'node-11': { key: 11, next: 'node-21' },
    'node-21': { key: 21, next: null }
  },
  expectedKeysOrder: [11, 21]
};
const valResult = validatePointerChain(validGraph);
assert(valResult.valid, 'Valid chain passes');
assertEqual(valResult.traversal, [11, 21], 'Traversal matches [11, 21]');

// Broken chain: node-11 points to null (21 unreachable)
const brokenGraph = {
  bucketHeadId: 'node-11',
  nodes: {
    'node-11': { key: 11, next: null },
    'node-21': { key: 21, next: null }
  },
  expectedKeysOrder: [11, 21]
};
const brokenResult = validatePointerChain(brokenGraph);
assert(!brokenResult.valid, 'Broken chain fails');

// Cycle detection: node-11 -> node-21 -> node-11
const cycleGraph = {
  bucketHeadId: 'node-11',
  nodes: {
    'node-11': { key: 11, next: 'node-21' },
    'node-21': { key: 21, next: 'node-11' }
  },
  expectedKeysOrder: [11, 21]
};
const cycleResult = validatePointerChain(cycleGraph);
assert(!cycleResult.valid && cycleResult.cycle, 'Cycle detected successfully');

console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
if (failed > 0) {
  process.exit(1);
}
