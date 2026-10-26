
export class StaticHash {
  constructor(bucketCount = 5, bucketCapacity = 3) {
    this.bucketCount = bucketCount;
    this.bucketCapacity = bucketCapacity;

    this.buckets = Array.from(
      { length: bucketCount },
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
  }

  hash(key) {
    return Math.abs(Number(key)) % this.bucketCount;
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

    if (bucket.keys.includes(numericKey)) {
      return this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: bucketIndex,
        status: "DUPLICATE",
        message: `Key ${numericKey} already exists.`,
      });
    }

    if (bucket.keys.length >= this.bucketCapacity) {
      this.totalCollisions++;

      return this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: bucketIndex,
        status: "COLLISION",
        message:
          `Collision: bucket ${bucketIndex} is full.`,
      });
    }

    bucket.keys.push(numericKey);
    this.totalInsertions++;

    return this.recordOperation({
      type: "INSERT",
      key: numericKey,
      bucket: bucketIndex,
      status: "SUCCESS",
      message:
        `Key ${numericKey} inserted into bucket ${bucketIndex}.`,
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

    const found = bucket.keys.includes(numericKey);

    this.totalSearches++;

    return this.recordOperation({
      type: "SEARCH",
      key: numericKey,
      bucket: bucketIndex,
      status: found ? "FOUND" : "NOT_FOUND",
      message: found
        ? `Key ${numericKey} found in bucket ${bucketIndex}.`
        : `Key ${numericKey} was not found.`,
      found,
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

    const keyIndex = bucket.keys.indexOf(numericKey);

    if (keyIndex === -1) {
      return this.recordOperation({
        type: "DELETE",
        key: numericKey,
        bucket: bucketIndex,
        status: "NOT_FOUND",
        message:
          `Key ${numericKey} was not found.`,
      });
    }

    bucket.keys.splice(keyIndex, 1);

    this.totalDeletes++;

    return this.recordOperation({
      type: "DELETE",
      key: numericKey,
      bucket: bucketIndex,
      status: "SUCCESS",
      message:
        `Key ${numericKey} deleted from bucket ${bucketIndex}.`,
    });
  }

  recordOperation(operation) {
    this.operations.push({
      ...operation,
      timestamp: new Date().toISOString(),
    });

    return this.getState();
  }

  getLoadFactor() {
    const totalKeys = this.buckets.reduce(
      (total, bucket) => total + bucket.keys.length,
      0
    );

    const totalCapacity =
      this.bucketCount * this.bucketCapacity;

    if (totalCapacity === 0) {
      return 0;
    }

    return totalKeys / totalCapacity;
  }

  getState() {
    return {
      bucketCount: this.bucketCount,
      bucketCapacity: this.bucketCapacity,

      buckets: this.buckets.map((bucket) => ({
        id: bucket.id,
        keys: [...bucket.keys],
      })),

      loadFactor: this.getLoadFactor(),

      totalKeys: this.buckets.reduce(
        (total, bucket) =>
          total + bucket.keys.length,
        0
      ),

      totalCollisions: this.totalCollisions,
      totalInsertions: this.totalInsertions,
      totalSearches: this.totalSearches,
      totalDeletes: this.totalDeletes,

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

    return this.getState();
  }
}

