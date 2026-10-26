export class Rehashing {
  constructor(
    initialBucketCount = 5,
    bucketCapacity = 2,
    loadFactorThreshold = 0.7
  ) {
    this.initialBucketCount = initialBucketCount;
    this.bucketCount = initialBucketCount;
    this.bucketCapacity = bucketCapacity;
    this.loadFactorThreshold = loadFactorThreshold;

    this.buckets = this.createBuckets(
      this.bucketCount
    );

    this.operations = [];

    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalCollisions = 0;
    this.totalRehashes = 0;
    this.totalProbes = 0;
  }

  createBuckets(count) {
    return Array.from(
      { length: count },
      (_, index) => ({
        id: index,
        keys: [],
      })
    );
  }

  hash(key) {
    return (
      Math.abs(Number(key)) %
      this.bucketCount
    );
  }

  getTotalKeys() {
    return this.buckets.reduce(
      (total, bucket) =>
        total + bucket.keys.length,
      0
    );
  }

  getLoadFactor() {
    const totalCapacity =
      this.bucketCount *
      this.bucketCapacity;

    if (totalCapacity === 0) {
      return 0;
    }

    return this.getTotalKeys() / totalCapacity;
  }

  findKey(key) {
    const bucketIndex = this.hash(key);

    const bucket =
      this.buckets[bucketIndex];

    return bucket.keys.includes(key)
      ? bucketIndex
      : -1;
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

    const existingBucket =
      this.findKey(numericKey);

    if (existingBucket !== -1) {
      return this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: existingBucket,
        status: "DUPLICATE",
        message:
          `Key ${numericKey} already exists.`,
      });
    }

    let bucketIndex =
      this.hash(numericKey);

    this.totalProbes++;

    let bucket =
      this.buckets[bucketIndex];

    /*
     * If the target bucket is full,
     * perform rehashing before insertion (up to a safe rehash limit).
     */
    let rehashAttempts = 0;
    const MAX_REHASHES = 5;
    while (
      bucket.keys.length >= this.bucketCapacity &&
      rehashAttempts < MAX_REHASHES
    ) {
      this.totalCollisions++;
      this.rehash();
      bucketIndex = this.hash(numericKey);
      bucket = this.buckets[bucketIndex];
      rehashAttempts++;
    }

    bucket.keys.push(numericKey);

    this.totalInsertions++;

    /*
     * Check the load factor after insertion.
     */
    if (
      this.getLoadFactor() >
      this.loadFactorThreshold
    ) {
      this.rehash();

      bucketIndex =
        this.hash(numericKey);
    }

    return this.recordOperation({
      type: "INSERT",
      key: numericKey,
      bucket: bucketIndex,
      status: "SUCCESS",
      message:
        `Key ${numericKey} inserted successfully.`,
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

    const bucketIndex =
      this.hash(numericKey);

    this.totalProbes++;

    const bucket =
      this.buckets[bucketIndex];

    const found =
      bucket.keys.includes(numericKey);

    this.totalSearches++;

    return this.recordOperation({
      type: "SEARCH",
      key: numericKey,
      bucket: bucketIndex,
      status: found
        ? "FOUND"
        : "NOT_FOUND",
      found,
      message: found
        ? `Key ${numericKey} found in bucket ${bucketIndex}.`
        : `Key ${numericKey} was not found.`,
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

    const bucketIndex =
      this.hash(numericKey);

    this.totalProbes++;

    const bucket =
      this.buckets[bucketIndex];

    const position =
      bucket.keys.indexOf(numericKey);

    if (position === -1) {
      return this.recordOperation({
        type: "DELETE",
        key: numericKey,
        bucket: bucketIndex,
        status: "NOT_FOUND",
        message:
          `Key ${numericKey} was not found.`,
      });
    }

    bucket.keys.splice(
      position,
      1
    );

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

  rehash() {
    const oldBucketCount =
      this.bucketCount;

    const oldBuckets =
      this.buckets;

    /*
     * Double the number of buckets.
     */
    this.bucketCount =
      this.bucketCount * 2;

    this.buckets =
      this.createBuckets(
        this.bucketCount
      );

    /*
     * Redistribute every existing key
     * using the new hash function.
     */
    for (const bucket of oldBuckets) {
      for (const key of bucket.keys) {
        const newIndex =
          this.hash(key);

        this.buckets[
          newIndex
        ].keys.push(key);
      }
    }

    this.totalRehashes++;

    this.operations.push({
      type: "REHASH",
      status: "SUCCESS",
      oldBucketCount,
      newBucketCount:
        this.bucketCount,
      message:
        `Table rehashed from ${oldBucketCount} to ${this.bucketCount} buckets.`,
      timestamp:
        new Date().toISOString(),
    });
  }

  recordOperation(operation) {
    this.operations.push({
      ...operation,
      timestamp:
        new Date().toISOString(),
    });

    return this.getState();
  }

  getState() {
    return {
      algorithm: "Rehashing",

      bucketCount:
        this.bucketCount,

      bucketCapacity:
        this.bucketCapacity,

      loadFactorThreshold:
        this.loadFactorThreshold,

      loadFactor:
        this.getLoadFactor(),

      buckets:
        this.buckets.map(
          (bucket) => ({
            id: bucket.id,
            keys: [
              ...bucket.keys,
            ],
          })
        ),

      totalKeys:
        this.getTotalKeys(),

      totalInsertions:
        this.totalInsertions,

      totalSearches:
        this.totalSearches,

      totalDeletes:
        this.totalDeletes,

      totalCollisions:
        this.totalCollisions,

      totalRehashes:
        this.totalRehashes,

      totalProbes:
        this.totalProbes,

      operations: [
        ...this.operations,
      ],
    };
  }

  reset() {
    this.bucketCount =
      this.initialBucketCount;

    this.buckets =
      this.createBuckets(
        this.bucketCount
      );

    this.operations = [];

    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalCollisions = 0;
    this.totalRehashes = 0;
    this.totalProbes = 0;

    return this.getState();
  }
}
