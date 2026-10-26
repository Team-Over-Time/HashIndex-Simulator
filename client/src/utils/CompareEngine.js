import {
  SeparateChaining,
  LinearProbing,
  QuadraticProbing,
  DoubleHashing,
} from "../algorithms/CollisionStrategies.js";

import { Rehashing } from "../algorithms/Rehashing.js";
import { ExtendibleHash } from "../algorithms/ExtendibleHash.js";
import { LinearHash } from "../algorithms/LinearHash.js";

const algorithms = [
  {
    id: "separate",
    name: "Separate Chaining",
  },
  {
    id: "linear-probing",
    name: "Linear Probing",
  },
  {
    id: "quadratic-probing",
    name: "Quadratic Probing",
  },
  {
    id: "double-hashing",
    name: "Double Hashing",
  },
  {
    id: "rehashing",
    name: "Rehashing",
  },
  {
    id: "extendible",
    name: "Extendible Hashing",
  },
  {
    id: "linear-hashing",
    name: "Linear Hashing",
  },
];

function createAlgorithm(id, userBucketCount, userBucketCapacity) {
  // Use user-provided values with clean minimum boundaries
  const m = Math.max(2, Number(userBucketCount) || 7);
  const cap = Math.max(1, Number(userBucketCapacity) || 2);
  const initialDepth = Math.max(1, Math.min(5, Math.floor(Math.log2(m))));

  switch (id) {
    case "separate":
      return new SeparateChaining(m);

    case "linear-probing":
      return new LinearProbing(m);

    case "quadratic-probing":
      return new QuadraticProbing(m);

    case "double-hashing":
      return new DoubleHashing(m);

    case "rehashing":
      return new Rehashing(m, cap, 0.7);

    case "extendible":
      return new ExtendibleHash(cap, initialDepth);

    case "linear-hashing":
      return new LinearHash(m, cap);

    default:
      return null;
  }
}

export function runComparison(inputKeys, userBucketCount, userBucketCapacity) {
  const results = [];

  for (const algorithmInfo of algorithms) {
    const algorithm = createAlgorithm(
      algorithmInfo.id,
      userBucketCount,
      userBucketCapacity
    );

    if (!algorithm) {
      continue;
    }

    for (const key of inputKeys) {
      algorithm.insert(key);
    }

    const state = algorithm.getState();

    results.push({
      id: algorithmInfo.id,
      name: algorithmInfo.name,

      totalKeys: state.totalKeys ?? 0,
      insertions: state.totalInsertions ?? 0,
      searches: state.totalSearches ?? 0,
      deletes: state.totalDeletes ?? 0,
      collisions: state.totalCollisions ?? 0,
      totalProbes: state.totalProbes ?? 0,
      loadFactor: state.loadFactor ?? 0,

      bucketCount:
        state.bucketCount ??
        state.directorySize ??
        state.buckets?.length ??
        0,

      splits: state.totalSplits ?? 0,
      rehashes: state.totalRehashes ?? 0,
      directoryDoublings: state.totalDirectoryDoublings ?? 0,
      level: state.level ?? 0,
      splitPointer: state.splitPointer ?? 0,

      operations: Array.isArray(state.operations)
        ? state.operations
        : [],
    });
  }

  return results;
}
