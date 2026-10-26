/* =========================================================
   COLLISION STRATEGIES
   Supports user-typed custom mathematical formulas for h₁(k) and h₂(k),
   full open addressing with mathematically sound Tombstone deletions,
   and safe non-negative circular modulo arithmetic.
========================================================= */

/**
 * Safely evaluates user-typed mathematical expressions for hash functions.
 * Supports variables 'k' (the key) and 'm' (the table size / bucket count).
 * Handles syntax like 'k % m', '2k + 1', 'k^2', '7 - (k % 7)', etc.
 */
export function evaluateHashExpr(expr, k, m, isStepFunction = false) {
  try {
    if (!expr || typeof expr !== "string" || !expr.trim()) {
      return isStepFunction ? 1 : Math.abs(k) % m;
    }

    let clean = expr
      .toLowerCase()
      .replace(/\bmod\b/g, "%")
      .replace(/(\d)k/g, "$1*k")
      .replace(/k(\d)/g, "k*$1")
      .replace(/\^/g, "**");

    // Allowed tokens: k, m, digits, math operators, parens, Math methods
    const allowed = /^[0-9km+\-*/%().\s*Mathflooreilabs]+$/;
    if (!allowed.test(clean)) {
      return isStepFunction ? 1 : Math.abs(k) % m;
    }

    const fn = new Function(
      "k",
      "m",
      `"use strict"; return Math.floor(${clean});`
    );

    const val = fn(Math.abs(Number(k)), Number(m));

    if (!Number.isFinite(val)) {
      return isStepFunction ? 1 : Math.abs(k) % m;
    }

    if (isStepFunction) {
      // Step size must always be strictly positive
      return Math.max(1, Math.abs(val));
    }

    // Wrap around to positive bucket index [0, m - 1]
    return ((val % m) + m) % m;
  } catch (err) {
    return isStepFunction ? 1 : Math.abs(k) % m;
  }
}

/* =========================================================
   SEPARATE CHAINING (Supports custom user-typed h(k))
========================================================= */

export class SeparateChaining {
  constructor(bucketCount = 7, h1Expr = "k % m") {
    this.bucketCount = Math.max(1, Number(bucketCount) || 7);
    this.h1Expr = h1Expr || "k % m";

    this.buckets = Array.from(
      { length: this.bucketCount },
      (_, index) => ({
        id: index,
        keys: [],
      })
    );

    this.operations = [];
    this.totalCollisions = 0;
    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalProbes = 0;
  }

  hash(key) {
    return evaluateHashExpr(
      this.h1Expr,
      Number(key),
      this.bucketCount,
      false
    );
  }

  insert(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "INSERT",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    const bucketIndex = this.hash(numericKey);
    const bucket = this.buckets[bucketIndex];

    this.totalProbes += (bucket.keys.length + 1);

    if (bucket.keys.includes(numericKey)) {
      return this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: bucketIndex,
        status: "DUPLICATE",
        message: `Key ${numericKey} already exists in bucket ${bucketIndex}.`,
      });
    }

    if (bucket.keys.length > 0) {
      this.totalCollisions++;
    }

    bucket.keys.push(numericKey);
    this.totalInsertions++;

    return this.recordOperation({
      type: "INSERT",
      key: numericKey,
      bucket: bucketIndex,
      status: "SUCCESS",
      message:
        bucket.keys.length === 1
          ? `Key ${numericKey} inserted into bucket ${bucketIndex}.`
          : `Collision resolved by chaining. Key ${numericKey} added to bucket ${bucketIndex}.`,
    });
  }

  search(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "SEARCH",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    const bucketIndex = this.hash(numericKey);
    const bucket = this.buckets[bucketIndex];

    const position = bucket.keys.indexOf(numericKey);
    const found = position !== -1;

    this.totalSearches++;
    this.totalProbes += (found ? position + 1 : bucket.keys.length + 1);

    return this.recordOperation({
      type: "SEARCH",
      key: numericKey,
      bucket: bucketIndex,
      status: found ? "FOUND" : "NOT_FOUND",
      message: found
        ? `Key ${numericKey} found in bucket ${bucketIndex} at chain position ${position + 1}.`
        : `Key ${numericKey} was not found in bucket ${bucketIndex}.`,
      found,
      position,
    });
  }

  delete(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "DELETE",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    const bucketIndex = this.hash(numericKey);
    const bucket = this.buckets[bucketIndex];

    const index = bucket.keys.indexOf(numericKey);
    this.totalProbes += (index !== -1 ? index + 1 : bucket.keys.length + 1);

    if (index === -1) {
      return this.recordOperation({
        type: "DELETE",
        key: numericKey,
        bucket: bucketIndex,
        status: "NOT_FOUND",
        message: `Key ${numericKey} not found. Deletion failed.`,
      });
    }

    bucket.keys.splice(index, 1);
    this.totalDeletes++;

    return this.recordOperation({
      type: "DELETE",
      key: numericKey,
      bucket: bucketIndex,
      status: "SUCCESS",
      message: `Key ${numericKey} deleted from bucket ${bucketIndex}.`,
    });
  }

  recordOperation(operation) {
    const record = {
      ...operation,
      timestamp: new Date().toISOString(),
    };

    this.operations.push(record);
    return this.getState();
  }

  getLoadFactor() {
    const totalKeys = this.buckets.reduce(
      (sum, bucket) => sum + bucket.keys.length,
      0
    );
    return totalKeys / this.bucketCount;
  }

  getState() {
    return {
      algorithm: "Separate Chaining",
      bucketCount: this.bucketCount,
      h1Expr: this.h1Expr,
      buckets: this.buckets.map((bucket) => ({
        id: bucket.id,
        keys: [...bucket.keys],
      })),
      totalKeys: this.buckets.reduce(
        (sum, bucket) => sum + bucket.keys.length,
        0
      ),
      loadFactor: this.getLoadFactor(),
      totalCollisions: this.totalCollisions,
      totalInsertions: this.totalInsertions,
      totalSearches: this.totalSearches,
      totalDeletes: this.totalDeletes,
      totalProbes: this.totalProbes,
      operations: [...this.operations],
    };
  }

  reset() {
    this.buckets = Array.from(
      { length: this.bucketCount },
      (_, index) => ({
        id: index,
        keys: [],
      })
    );

    this.operations = [];
    this.totalCollisions = 0;
    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalProbes = 0;

    return this.getState();
  }
}

/* =========================================================
   LINEAR PROBING (Supports custom user-typed h(k) & step,
   with robust Tombstone deletion support)
========================================================= */

export class LinearProbing {
  constructor(bucketCount = 7, stepSize = 1, h1Expr = "k % m") {
    this.bucketCount = Math.max(1, Number(bucketCount) || 7);
    this.stepSize = Math.max(1, Number(stepSize) || 1);
    this.h1Expr = h1Expr || "k % m";

    this.buckets = Array.from(
      { length: this.bucketCount },
      (_, index) => ({
        id: index,
        key: null,
        occupied: false,
        deleted: false, // Tombstone indicator
      })
    );

    this.operations = [];
    this.totalCollisions = 0;
    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalProbes = 0;
  }

  hash(key) {
    return evaluateHashExpr(
      this.h1Expr,
      Number(key),
      this.bucketCount,
      false
    );
  }

  getIndex(key, i) {
    const raw = this.hash(key) + i * this.stepSize;
    return ((raw % this.bucketCount) + this.bucketCount) % this.bucketCount;
  }

  insert(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "INSERT",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    let firstAvailableIndex = -1;
    let firstAvailableProbes = 0;

    for (let i = 0; i < this.bucketCount; i++) {
      const index = this.getIndex(numericKey, i);
      this.totalProbes++;

      const bucket = this.buckets[index];

      // Check if duplicate key already exists
      if (bucket.occupied && bucket.key === numericKey) {
        return this.recordOperation({
          type: "INSERT",
          key: numericKey,
          bucket: index,
          status: "DUPLICATE",
          probes: i + 1,
          message: `Key ${numericKey} already exists in bucket ${index}.`,
        });
      }

      // Track the first tombstone or empty slot where this key can be stored
      if ((!bucket.occupied || bucket.deleted) && firstAvailableIndex === -1) {
        firstAvailableIndex = index;
        firstAvailableProbes = i + 1;
      }

      // If slot is completely empty (never used or reset, NOT a tombstone),
      // key cannot exist past this point in the table.
      if (!bucket.occupied && !bucket.deleted) {
        break;
      }
    }

    // Insert into the first available slot (reusing tombstones if present)
    if (firstAvailableIndex !== -1) {
      const targetBucket = this.buckets[firstAvailableIndex];
      targetBucket.key = numericKey;
      targetBucket.occupied = true;
      targetBucket.deleted = false;

      this.totalInsertions++;

      if (firstAvailableProbes > 1) {
        this.totalCollisions++;
      }

      return this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: firstAvailableIndex,
        status: "SUCCESS",
        probes: firstAvailableProbes,
        collision: firstAvailableProbes > 1,
        message:
          firstAvailableProbes === 1
            ? `Key ${numericKey} inserted into bucket ${firstAvailableIndex}.`
            : `Collision resolved by linear probing. Key ${numericKey} placed in bucket ${firstAvailableIndex}.`,
      });
    }

    return this.recordOperation({
      type: "INSERT",
      key: numericKey,
      status: "TABLE_FULL",
      message: "Hash table is full. Key could not be inserted.",
    });
  }

  search(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "SEARCH",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    for (let i = 0; i < this.bucketCount; i++) {
      const index = this.getIndex(numericKey, i);
      const bucket = this.buckets[index];

      // Key found in an occupied slot
      if (bucket.occupied && bucket.key === numericKey) {
        this.totalSearches++;
        return this.recordOperation({
          type: "SEARCH",
          key: numericKey,
          bucket: index,
          status: "FOUND",
          probes: i + 1,
          message: `Key ${numericKey} found in bucket ${index} after ${i + 1} probe(s).`,
        });
      }

      // If slot was never occupied (not occupied and NOT a tombstone), key cannot exist
      if (!bucket.occupied && !bucket.deleted) {
        break;
      }
      // If slot is a tombstone (deleted: true), continue probing!
    }

    this.totalSearches++;
    return this.recordOperation({
      type: "SEARCH",
      key: numericKey,
      status: "NOT_FOUND",
      message: `Key ${numericKey} was not found in the hash table.`,
    });
  }

  delete(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "DELETE",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    for (let i = 0; i < this.bucketCount; i++) {
      const index = this.getIndex(numericKey, i);
      const bucket = this.buckets[index];

      if (bucket.occupied && bucket.key === numericKey) {
        bucket.key = null;
        bucket.occupied = false;
        bucket.deleted = true; // Mark as tombstone to preserve probe chain
        this.totalDeletes++;

        return this.recordOperation({
          type: "DELETE",
          key: numericKey,
          bucket: index,
          status: "SUCCESS",
          message: `Key ${numericKey} deleted from bucket ${index} (tombstone marked).`,
        });
      }

      // If slot was never occupied, key is not in table
      if (!bucket.occupied && !bucket.deleted) {
        break;
      }
    }

    return this.recordOperation({
      type: "DELETE",
      key: numericKey,
      status: "NOT_FOUND",
      message: `Key ${numericKey} not found. Deletion failed.`,
    });
  }

  recordOperation(operation) {
    const record = {
      ...operation,
      timestamp: new Date().toISOString(),
    };

    this.operations.push(record);
    return this.getState();
  }

  getLoadFactor() {
    const occupiedBuckets = this.buckets.filter((b) => b.occupied).length;
    return occupiedBuckets / this.bucketCount;
  }

  getState() {
    return {
      algorithm: "Linear Probing",
      bucketCount: this.bucketCount,
      stepSize: this.stepSize,
      h1Expr: this.h1Expr,
      buckets: this.buckets.map((bucket) => ({
        id: bucket.id,
        key: bucket.key,
        occupied: bucket.occupied,
        deleted: bucket.deleted || false,
      })),
      totalKeys: this.buckets.filter((bucket) => bucket.occupied).length,
      loadFactor: this.getLoadFactor(),
      totalCollisions: this.totalCollisions,
      totalInsertions: this.totalInsertions,
      totalSearches: this.totalSearches,
      totalDeletes: this.totalDeletes,
      totalProbes: this.totalProbes,
      operations: [...this.operations],
    };
  }

  reset() {
    this.buckets = Array.from(
      { length: this.bucketCount },
      (_, index) => ({
        id: index,
        key: null,
        occupied: false,
        deleted: false,
      })
    );

    this.operations = [];
    this.totalCollisions = 0;
    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalProbes = 0;

    return this.getState();
  }
}

/* =========================================================
   QUADRATIC PROBING (Supports custom user-typed h(k) & c1, c2,
   with robust Tombstone deletion support & safe modulo)
========================================================= */

export class QuadraticProbing {
  constructor(bucketCount = 7, c1 = 0, c2 = 1, h1Expr = "k % m") {
    this.bucketCount = Math.max(1, Number(bucketCount) || 7);
    this.c1 = Number(c1) || 0;
    this.c2 = Number(c2) === 0 ? 0 : Number(c2) || 1;
    this.h1Expr = h1Expr || "k % m";

    this.buckets = Array.from(
      { length: this.bucketCount },
      (_, index) => ({
        id: index,
        key: null,
        occupied: false,
        deleted: false,
      })
    );

    this.operations = [];
    this.totalCollisions = 0;
    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalProbes = 0;
  }

  hash(key) {
    return evaluateHashExpr(
      this.h1Expr,
      Number(key),
      this.bucketCount,
      false
    );
  }

  getIndex(key, i) {
    const raw = this.hash(key) + this.c1 * i + this.c2 * i * i;
    return ((raw % this.bucketCount) + this.bucketCount) % this.bucketCount;
  }

  insert(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "INSERT",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    let firstAvailableIndex = -1;
    let firstAvailableProbes = 0;

    for (let i = 0; i < this.bucketCount; i++) {
      const index = this.getIndex(numericKey, i);
      this.totalProbes++;

      const bucket = this.buckets[index];

      // Check if duplicate key already exists
      if (bucket.occupied && bucket.key === numericKey) {
        return this.recordOperation({
          type: "INSERT",
          key: numericKey,
          bucket: index,
          status: "DUPLICATE",
          probes: i + 1,
          message: `Key ${numericKey} already exists in bucket ${index}.`,
        });
      }

      // Track first available slot (tombstone or unallocated)
      if ((!bucket.occupied || bucket.deleted) && firstAvailableIndex === -1) {
        firstAvailableIndex = index;
        firstAvailableProbes = i + 1;
      }

      // Stop scanning if an unallocated slot (not tombstone) is reached
      if (!bucket.occupied && !bucket.deleted) {
        break;
      }
    }

    if (firstAvailableIndex !== -1) {
      const targetBucket = this.buckets[firstAvailableIndex];
      targetBucket.key = numericKey;
      targetBucket.occupied = true;
      targetBucket.deleted = false;
      this.totalInsertions++;

      if (firstAvailableProbes > 1) {
        this.totalCollisions++;
      }

      return this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: firstAvailableIndex,
        status: "SUCCESS",
        probes: firstAvailableProbes,
        collision: firstAvailableProbes > 1,
        message:
          firstAvailableProbes === 1
            ? `Key ${numericKey} inserted into bucket ${firstAvailableIndex}.`
            : `Collision resolved by quadratic probing. Key ${numericKey} placed in bucket ${firstAvailableIndex}.`,
      });
    }

    return this.recordOperation({
      type: "INSERT",
      key: numericKey,
      status: "TABLE_FULL",
      message: "Hash table is full. Key could not be inserted.",
    });
  }

  search(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "SEARCH",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    for (let i = 0; i < this.bucketCount; i++) {
      const index = this.getIndex(numericKey, i);
      const bucket = this.buckets[index];

      if (bucket.occupied && bucket.key === numericKey) {
        this.totalSearches++;
        return this.recordOperation({
          type: "SEARCH",
          key: numericKey,
          bucket: index,
          status: "FOUND",
          probes: i + 1,
          message: `Key ${numericKey} found in bucket ${index} after ${i + 1} probe(s).`,
        });
      }

      // If slot was never occupied, key is not present
      if (!bucket.occupied && !bucket.deleted) {
        break;
      }
      // Continue probing through tombstones
    }

    this.totalSearches++;
    return this.recordOperation({
      type: "SEARCH",
      key: numericKey,
      status: "NOT_FOUND",
      message: `Key ${numericKey} was not found in the hash table.`,
    });
  }

  delete(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "DELETE",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    for (let i = 0; i < this.bucketCount; i++) {
      const index = this.getIndex(numericKey, i);
      const bucket = this.buckets[index];

      if (bucket.occupied && bucket.key === numericKey) {
        bucket.key = null;
        bucket.occupied = false;
        bucket.deleted = true; // Mark as tombstone
        this.totalDeletes++;

        return this.recordOperation({
          type: "DELETE",
          key: numericKey,
          bucket: index,
          status: "SUCCESS",
          message: `Key ${numericKey} deleted from bucket ${index} (tombstone marked).`,
        });
      }

      if (!bucket.occupied && !bucket.deleted) {
        break;
      }
    }

    return this.recordOperation({
      type: "DELETE",
      key: numericKey,
      status: "NOT_FOUND",
      message: `Key ${numericKey} not found. Deletion failed.`,
    });
  }

  recordOperation(operation) {
    const record = {
      ...operation,
      timestamp: new Date().toISOString(),
    };

    this.operations.push(record);
    return this.getState();
  }

  getLoadFactor() {
    const occupiedBuckets = this.buckets.filter((b) => b.occupied).length;
    return occupiedBuckets / this.bucketCount;
  }

  getState() {
    return {
      algorithm: "Quadratic Probing",
      bucketCount: this.bucketCount,
      c1: this.c1,
      c2: this.c2,
      h1Expr: this.h1Expr,
      buckets: this.buckets.map((bucket) => ({
        id: bucket.id,
        key: bucket.key,
        occupied: bucket.occupied,
        deleted: bucket.deleted || false,
      })),
      totalKeys: this.buckets.filter((bucket) => bucket.occupied).length,
      loadFactor: this.getLoadFactor(),
      totalCollisions: this.totalCollisions,
      totalInsertions: this.totalInsertions,
      totalSearches: this.totalSearches,
      totalDeletes: this.totalDeletes,
      totalProbes: this.totalProbes,
      operations: [...this.operations],
    };
  }

  reset() {
    this.buckets = Array.from(
      { length: this.bucketCount },
      (_, index) => ({
        id: index,
        key: null,
        occupied: false,
        deleted: false,
      })
    );

    this.operations = [];
    this.totalCollisions = 0;
    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalProbes = 0;

    return this.getState();
  }
}

/* =========================================================
   DOUBLE HASHING (Supports user-typed custom h1 and h2 formulas,
   with robust Tombstones & non-negative modulo)
========================================================= */

export class DoubleHashing {
  constructor(
    bucketCount = 7,
    h1Expr = "k % m",
    h2Expr = "5 - (k % 5)"
  ) {
    this.bucketCount = Math.max(1, Number(bucketCount) || 7);
    this.h1Expr = h1Expr || "k % m";
    this.h2Expr = h2Expr || "5 - (k % 5)";

    this.buckets = Array.from(
      { length: this.bucketCount },
      (_, index) => ({
        id: index,
        key: null,
        occupied: false,
        deleted: false,
      })
    );

    this.operations = [];
    this.totalCollisions = 0;
    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalProbes = 0;
  }

  hash1(key) {
    return evaluateHashExpr(
      this.h1Expr,
      Number(key),
      this.bucketCount,
      false
    );
  }

  hash2(key) {
    return evaluateHashExpr(
      this.h2Expr,
      Number(key),
      this.bucketCount,
      true
    );
  }

  getIndex(key, i) {
    const firstHash = this.hash1(key);
    const secondHash = this.hash2(key);
    const raw = firstHash + i * secondHash;
    return ((raw % this.bucketCount) + this.bucketCount) % this.bucketCount;
  }

  insert(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "INSERT",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    let firstAvailableIndex = -1;
    let firstAvailableProbes = 0;

    for (let i = 0; i < this.bucketCount; i++) {
      const index = this.getIndex(numericKey, i);
      this.totalProbes++;

      const bucket = this.buckets[index];

      // Check for duplicates
      if (bucket.occupied && bucket.key === numericKey) {
        return this.recordOperation({
          type: "INSERT",
          key: numericKey,
          bucket: index,
          status: "DUPLICATE",
          probes: i + 1,
          message: `Key ${numericKey} already exists in bucket ${index}.`,
        });
      }

      // Track first tombstone or empty slot
      if ((!bucket.occupied || bucket.deleted) && firstAvailableIndex === -1) {
        firstAvailableIndex = index;
        firstAvailableProbes = i + 1;
      }

      // If slot was never occupied, key cannot exist beyond this
      if (!bucket.occupied && !bucket.deleted) {
        break;
      }
    }

    if (firstAvailableIndex !== -1) {
      const targetBucket = this.buckets[firstAvailableIndex];
      targetBucket.key = numericKey;
      targetBucket.occupied = true;
      targetBucket.deleted = false;
      this.totalInsertions++;

      if (firstAvailableProbes > 1) {
        this.totalCollisions++;
      }

      return this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: firstAvailableIndex,
        status: "SUCCESS",
        probes: firstAvailableProbes,
        collision: firstAvailableProbes > 1,
        message:
          firstAvailableProbes === 1
            ? `Key ${numericKey} inserted into bucket ${firstAvailableIndex}.`
            : `Collision resolved by double hashing. Key ${numericKey} placed in bucket ${firstAvailableIndex}.`,
      });
    }

    return this.recordOperation({
      type: "INSERT",
      key: numericKey,
      status: "TABLE_FULL",
      message: "Hash table is full. Key could not be inserted.",
    });
  }

  search(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "SEARCH",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    for (let i = 0; i < this.bucketCount; i++) {
      const index = this.getIndex(numericKey, i);
      const bucket = this.buckets[index];

      if (bucket.occupied && bucket.key === numericKey) {
        this.totalSearches++;
        return this.recordOperation({
          type: "SEARCH",
          key: numericKey,
          bucket: index,
          status: "FOUND",
          probes: i + 1,
          message: `Key ${numericKey} found in bucket ${index} after ${i + 1} probe(s).`,
        });
      }

      if (!bucket.occupied && !bucket.deleted) {
        break;
      }
    }

    this.totalSearches++;
    return this.recordOperation({
      type: "SEARCH",
      key: numericKey,
      status: "NOT_FOUND",
      message: `Key ${numericKey} was not found in the hash table.`,
    });
  }

  delete(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "DELETE",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });
    }

    for (let i = 0; i < this.bucketCount; i++) {
      const index = this.getIndex(numericKey, i);
      const bucket = this.buckets[index];

      if (bucket.occupied && bucket.key === numericKey) {
        bucket.key = null;
        bucket.occupied = false;
        bucket.deleted = true; // Mark tombstone
        this.totalDeletes++;

        return this.recordOperation({
          type: "DELETE",
          key: numericKey,
          bucket: index,
          status: "SUCCESS",
          message: `Key ${numericKey} deleted from bucket ${index} (tombstone marked).`,
        });
      }

      if (!bucket.occupied && !bucket.deleted) {
        break;
      }
    }

    return this.recordOperation({
      type: "DELETE",
      key: numericKey,
      status: "NOT_FOUND",
      message: `Key ${numericKey} not found. Deletion failed.`,
    });
  }

  recordOperation(operation) {
    const record = {
      ...operation,
      timestamp: new Date().toISOString(),
    };

    this.operations.push(record);
    return this.getState();
  }

  getLoadFactor() {
    const occupiedBuckets = this.buckets.filter((b) => b.occupied).length;
    return occupiedBuckets / this.bucketCount;
  }

  getState() {
    return {
      algorithm: "Double Hashing",
      bucketCount: this.bucketCount,
      h1Expr: this.h1Expr,
      h2Expr: this.h2Expr,
      buckets: this.buckets.map((bucket) => ({
        id: bucket.id,
        key: bucket.key,
        occupied: bucket.occupied,
        deleted: bucket.deleted || false,
      })),
      totalKeys: this.buckets.filter((bucket) => bucket.occupied).length,
      loadFactor: this.getLoadFactor(),
      totalCollisions: this.totalCollisions,
      totalInsertions: this.totalInsertions,
      totalSearches: this.totalSearches,
      totalDeletes: this.totalDeletes,
      totalProbes: this.totalProbes,
      operations: [...this.operations],
    };
  }

  reset() {
    this.buckets = Array.from(
      { length: this.bucketCount },
      (_, index) => ({
        id: index,
        key: null,
        occupied: false,
        deleted: false,
      })
    );

    this.operations = [];
    this.totalCollisions = 0;
    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalProbes = 0;

    return this.getState();
  }
}
