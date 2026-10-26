export class LinearHash {
  constructor(initialBucketCount = 2, bucketCapacity = 2) {
    this.initialBucketCount = initialBucketCount;
    this.bucketCapacity = bucketCapacity;

    this.level = 0;
    this.splitPointer = 0;
    this.nextBucketId = initialBucketCount;

    this.buckets = this.createInitialBuckets(
      initialBucketCount
    );

    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalCollisions = 0;
    this.totalSplits = 0;
    this.totalProbes = 0;

    this.operations = [];
  }

  createInitialBuckets(count) {
    return Array.from(
      { length: count },
      (_, index) => ({
        id: index,
        keys: [],
      })
    );
  }

  /*
   * Number of buckets at the current level.
   */
  getLevelBucketCount() {
    return (
      this.initialBucketCount *
      Math.pow(2, this.level)
    );
  }

  /*
   * Hash function used by Linear Hashing.
   */
  getBucketIndex(key) {
    const numericKey = Math.abs(Number(key));

    const currentBucketCount =
      this.getLevelBucketCount();

    let index =
      numericKey % currentBucketCount;

    /*
     * Buckets that have already been split
     * use the next-level hash function.
     */
    if (index < this.splitPointer) {
      const nextBucketCount =
        currentBucketCount * 2;

      index =
        numericKey % nextBucketCount;
    }

    return index;
  }

  getBucket(key) {
    this.totalProbes++;
    const index = this.getBucketIndex(key);

    return this.buckets[index] || null;
  }

  findKey(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return -1;
    }

    const bucket =
      this.getBucket(numericKey);

    if (!bucket) {
      return -1;
    }

    return bucket.keys.includes(numericKey)
      ? bucket.id
      : -1;
  }

  /*
   * INSERT
   */
  insert(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      this.recordOperation({
        type: "INSERT",
        key,
        status: "INVALID",
        message: "Key must be an integer.",
      });

      return this.getState();
    }

    /*
     * Prevent duplicate keys.
     */
    const existingBucket =
      this.findKey(numericKey);

    if (existingBucket !== -1) {
      this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: existingBucket,
        status: "DUPLICATE",
        message:
          `Key ${numericKey} already exists in bucket ${existingBucket}.`,
      });

      return this.getState();
    }

    let bucket =
      this.getBucket(numericKey);

    if (!bucket) {
      this.recordOperation({
        type: "INSERT",
        key: numericKey,
        status: "ERROR",
        message:
          `Unable to locate bucket for key ${numericKey}.`,
      });

      return this.getState();
    }

    /*
     * If bucket is full, record a collision.
     */
    if (
      bucket.keys.length >=
      this.bucketCapacity
    ) {
      this.totalCollisions++;

      this.recordOperation({
        type: "COLLISION",
        key: numericKey,
        bucket: bucket.id,
        status: "DETECTED",
        message:
          `Collision detected in bucket ${bucket.id}.`,
      });
    }

    /*
     * Insert the key first.
     *
     * This allows the split operation to
     * redistribute it correctly.
     */
    bucket.keys.push(numericKey);

    this.totalInsertions++;

    this.recordOperation({
      type: "INSERT",
      key: numericKey,
      bucket: bucket.id,
      status: "SUCCESS",
      message:
        `Key ${numericKey} inserted into bucket ${bucket.id}.`,
    });

    /*
     * Check whether a split is required.
     */
    if (
      bucket.keys.length >
      this.bucketCapacity
    ) {
      this.splitBucket();
    }

    return this.getState();
  }

  /*
   * Split the bucket pointed to by
   * the Linear Hashing split pointer.
   */
  splitBucket() {
    const splitBucketIndex =
      this.splitPointer;

    const oldBucket =
      this.buckets[splitBucketIndex];

    if (!oldBucket) {
      return;
    }

    const newBucketId =
      this.nextBucketId;

    const newBucket = {
      id: newBucketId,
      keys: [],
    };

    this.nextBucketId++;

    /*
     * Add the new bucket.
     */
    this.buckets.push(newBucket);

    /*
     * Next-level hash.
     */
    const nextBucketCount =
      this.getLevelBucketCount() * 2;

    const oldKeys =
      [...oldBucket.keys];

    oldBucket.keys = [];

    /*
     * Redistribute old bucket contents.
     */
    for (const key of oldKeys) {
      const index =
        Math.abs(Number(key)) %
        nextBucketCount;

      if (index === newBucketId) {
        newBucket.keys.push(key);
      } else {
        oldBucket.keys.push(key);
      }
    }

    this.totalSplits++;

    this.operations.push({
      type: "BUCKET_SPLIT",
      status: "SUCCESS",
      splitBucket:
        splitBucketIndex,
      newBucket:
        newBucketId,
      level:
        this.level,
      splitPointerBefore:
        this.splitPointer,
      message:
        `Bucket ${splitBucketIndex} split. New bucket ${newBucketId} created and records redistributed.`,
      timestamp:
        new Date().toISOString(),
    });

    /*
     * Move split pointer.
     */
    this.splitPointer++;

    /*
     * When every bucket in this level
     * has been split, start a new level.
     */
    if (
      this.splitPointer >=
      this.getLevelBucketCount()
    ) {
      this.level++;

      this.splitPointer = 0;

      this.operations.push({
        type: "LEVEL_INCREASE",
        status: "SUCCESS",
        level:
          this.level,
        message:
          `Linear Hashing advanced to level ${this.level}. Split pointer reset to 0.`,
        timestamp:
          new Date().toISOString(),
      });
    }
  }

  /*
   * SEARCH
   */
  search(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      this.recordOperation({
        type: "SEARCH",
        key,
        status: "INVALID",
        message:
          "Key must be an integer.",
      });

      return this.getState();
    }

    const bucket =
      this.getBucket(numericKey);

    this.totalSearches++;

    if (!bucket) {
      this.recordOperation({
        type: "SEARCH",
        key: numericKey,
        status: "NOT_FOUND",
        message:
          `Unable to locate bucket for key ${numericKey}.`,
      });

      return this.getState();
    }

    const found =
      bucket.keys.includes(numericKey);

    this.recordOperation({
      type: "SEARCH",
      key: numericKey,
      bucket: bucket.id,
      status:
        found
          ? "FOUND"
          : "NOT_FOUND",
      message:
        found
          ? `Key ${numericKey} found in bucket ${bucket.id}.`
          : `Key ${numericKey} was not found.`,
    });

    return this.getState();
  }

  /*
   * DELETE
   */
  delete(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      this.recordOperation({
        type: "DELETE",
        key,
        status: "INVALID",
        message:
          "Key must be an integer.",
      });

      return this.getState();
    }

    const bucket =
      this.getBucket(numericKey);

    this.totalDeletes++;

    if (!bucket) {
      this.recordOperation({
        type: "DELETE",
        key: numericKey,
        status: "NOT_FOUND",
        message:
          `Unable to locate bucket for key ${numericKey}.`,
      });

      return this.getState();
    }

    const index =
      bucket.keys.indexOf(numericKey);

    if (index === -1) {
      this.recordOperation({
        type: "DELETE",
        key: numericKey,
        bucket: bucket.id,
        status: "NOT_FOUND",
        message:
          `Key ${numericKey} was not found.`,
      });

      return this.getState();
    }

    bucket.keys.splice(index, 1);

    this.recordOperation({
      type: "DELETE",
      key: numericKey,
      bucket: bucket.id,
      status: "SUCCESS",
      message:
        `Key ${numericKey} deleted from bucket ${bucket.id}.`,
    });

    return this.getState();
  }

  /*
   * Total number of stored keys.
   */
  getTotalKeys() {
    return this.buckets.reduce(
      (total, bucket) =>
        total + bucket.keys.length,
      0
    );
  }

  /*
   * Load factor.
   */
  getLoadFactor() {
    const totalCapacity =
      this.buckets.length *
      this.bucketCapacity;

    if (totalCapacity === 0) {
      return 0;
    }

    return (
      this.getTotalKeys() /
      totalCapacity
    );
  }

  /*
   * Record an operation.
   */
  recordOperation(operation) {
    const completeOperation = {
      ...operation,
      timestamp:
        operation.timestamp ||
        new Date().toISOString(),
    };

    this.operations.push(
      completeOperation
    );

    return completeOperation;
  }

  /*
   * Return complete simulator state.
   */
  getState() {
    return {
      algorithm:
        "Linear Hashing",

      level:
        this.level,

      splitPointer:
        this.splitPointer,

      bucketCapacity:
        this.bucketCapacity,

      bucketCount:
        this.buckets.length,

      buckets:
        this.buckets.map(
          (bucket) => ({
            id: bucket.id,
            keys: [...bucket.keys],
          })
        ),

      totalKeys:
        this.getTotalKeys(),

      loadFactor:
        this.getLoadFactor(),

      totalInsertions:
        this.totalInsertions,

      totalSearches:
        this.totalSearches,

      totalDeletes:
        this.totalDeletes,

      totalCollisions:
        this.totalCollisions,

      totalSplits:
        this.totalSplits,

      totalProbes:
        this.totalProbes,

      operations:
        [...this.operations],
    };
  }

  /*
   * RESET
   */
  reset() {
    this.level = 0;

    this.splitPointer = 0;

    this.nextBucketId =
      this.initialBucketCount;

    this.buckets =
      this.createInitialBuckets(
        this.initialBucketCount
      );

    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalCollisions = 0;
    this.totalSplits = 0;
    this.totalProbes = 0;

    this.operations = [];

    return this.getState();
  }
}