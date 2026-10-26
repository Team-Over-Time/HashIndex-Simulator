export class ExtendibleHash {
  constructor(
    bucketCapacity = 2,
    initialGlobalDepth = 1
  ) {
    this.bucketCapacity = bucketCapacity;
    this.initialGlobalDepth = initialGlobalDepth;

    this.globalDepth = initialGlobalDepth;

    this.nextBucketId = 0;

    this.operations = [];

    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalCollisions = 0;
    this.totalSplits = 0;
    this.totalDirectoryDoublings = 0;
    this.totalProbes = 0;

    /*
     * Create the initial buckets.
     *
     * With global depth 1:
     *
     * 0 → 0
     * 1 → 1
     */
    this.directory = [];

    const initialBucketCount =
      Math.pow(2, this.globalDepth);

    for (
      let i = 0;
      i < initialBucketCount;
      i++
    ) {
      this.directory.push(
        this.createBucket(
          this.globalDepth
        )
      );
    }
  }

  /*
   * Create a new bucket.
   */
  createBucket(localDepth) {
    const bucket = {
      id: this.nextBucketId,
      localDepth,
      keys: [],
    };

    this.nextBucketId++;

    return bucket;
  }

  /*
   * Hash function.
   *
   * We use the lowest globalDepth bits
   * of the key.
   */
  hash(key) {
    const numericKey =
      Math.abs(Number(key));

    const mask =
      Math.pow(2, this.globalDepth) - 1;

    return numericKey & mask;
  }

  /*
   * Get bucket using directory index.
   */
  getBucket(key) {
    this.totalProbes++;
    const directoryIndex =
      this.hash(key);

    return this.directory[
      directoryIndex
    ];
  }

  /*
   * Find a key.
   */
  findKey(key) {
    const bucket =
      this.getBucket(key);

    return bucket.keys.includes(key);
  }

  /*
   * Insert a key.
   */
  insert(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "INSERT",
        key,
        status: "INVALID",
        message:
          "Key must be an integer.",
      });
    }

    /*
     * Prevent duplicate keys.
     */
    if (this.findKey(numericKey)) {
      const bucket =
        this.getBucket(numericKey);

      return this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: bucket.id,
        status: "DUPLICATE",
        message:
          `Key ${numericKey} already exists.`,
      });
    }

    let bucket =
      this.getBucket(numericKey);

    /*
     * If bucket has space,
     * insert directly.
     */
    if (
      bucket.keys.length <
      this.bucketCapacity
    ) {
      bucket.keys.push(
        numericKey
      );

      this.totalInsertions++;

      return this.recordOperation({
        type: "INSERT",
        key: numericKey,
        bucket: bucket.id,
        status: "SUCCESS",
        message:
          `Key ${numericKey} inserted into bucket ${bucket.id}.`,
      });
    }

    /*
     * Bucket overflow.
     */
    this.totalCollisions++;

    /*
     * Keep splitting until the key
     * can be inserted or maximum depth is reached.
     */
    const MAX_DEPTH = 8;
    while (true) {
      bucket =
        this.getBucket(numericKey);

      /*
       * Safety guard: if max depth is reached,
       * store key in overflow bucket to avoid freezing browser.
       */
      if (
        bucket.localDepth >= MAX_DEPTH ||
        this.globalDepth >= MAX_DEPTH
      ) {
        bucket.keys.push(numericKey);
        this.totalInsertions++;

        return this.recordOperation({
          type: "INSERT",
          key: numericKey,
          bucket: bucket.id,
          status: "SUCCESS",
          message:
            `Key ${numericKey} inserted into bucket ${bucket.id} (Maximum depth ${MAX_DEPTH} reached, placed in overflow).`,
        });
      }

      /*
       * If the bucket's local depth
       * equals the global depth,
       * the directory must double.
       */
      if (
        bucket.localDepth ===
        this.globalDepth
      ) {
        this.doubleDirectory();
      }

      /*
       * Split the overflowing bucket.
       */
      this.splitBucket(
        bucket.id
      );

      bucket =
        this.getBucket(numericKey);

      /*
       * If the new bucket has room,
       * insert the key.
       */
      if (
        bucket.keys.length <
        this.bucketCapacity
      ) {
        bucket.keys.push(
          numericKey
        );

        this.totalInsertions++;

        return this.recordOperation({
          type: "INSERT",
          key: numericKey,
          bucket: bucket.id,
          status: "SUCCESS",
          message:
            `Key ${numericKey} inserted into bucket ${bucket.id} after bucket split.`,
        });
      }
    }
  }

  /*
   * Double the directory size.
   */
  doubleDirectory() {
    const oldSize =
      this.directory.length;

    this.directory = [
      ...this.directory,
      ...this.directory,
    ];

    this.globalDepth++;

    this.totalDirectoryDoublings++;

    this.operations.push({
      type: "DIRECTORY_DOUBLE",
      status: "SUCCESS",
      oldSize,
      newSize:
        this.directory.length,
      globalDepth:
        this.globalDepth,
      message:
        `Directory doubled from ${oldSize} to ${this.directory.length} entries. Global depth is now ${this.globalDepth}.`,
      timestamp:
        new Date().toISOString(),
    });
  }

  /*
   * Split one bucket.
   */
  splitBucket(bucketId) {
    /*
     * Find the actual bucket object.
     */
    const bucket =
      this.findBucketById(
        bucketId
      );

    if (!bucket) {
      return;
    }

    const oldLocalDepth =
      bucket.localDepth;

    const newLocalDepth =
      oldLocalDepth + 1;

    /*
     * Create the new bucket.
     */
    const newBucket =
      this.createBucket(
        newLocalDepth
      );

    /*
     * Increase the local depth
     * of the original bucket.
     */
    bucket.localDepth =
      newLocalDepth;

    /*
     * Find all directory entries
     * pointing to the old bucket.
     *
     * The new bucket gets entries where
     * the new local-depth bit is 1.
     */
    const splitBit =
      Math.pow(
        2,
        newLocalDepth - 1
      );

    for (
      let i = 0;
      i < this.directory.length;
      i++
    ) {
      if (
        this.directory[i] !==
        bucket
      ) {
        continue;
      }

      if (
        (i & splitBit) !== 0
      ) {
        this.directory[i] =
          newBucket;
      }
    }

    /*
     * Save the old keys.
     */
    const oldKeys = [
      ...bucket.keys,
    ];

    bucket.keys = [];

    /*
     * Redistribute all keys.
     */
    for (const key of oldKeys) {
      const targetBucket =
        this.getBucket(key);

      targetBucket.keys.push(
        key
      );
    }

    this.totalSplits++;

    this.operations.push({
      type: "BUCKET_SPLIT",
      status: "SUCCESS",
      bucketId,
      newBucketId:
        newBucket.id,
      oldLocalDepth,
      newLocalDepth,
      message:
        `Bucket ${bucketId} split. Local depth increased from ${oldLocalDepth} to ${newLocalDepth}.`,
      timestamp:
        new Date().toISOString(),
    });
  }

  /*
   * Find bucket by its unique ID.
   */
  findBucketById(bucketId) {
    for (
      const bucket of this.directory
    ) {
      if (
        bucket.id === bucketId
      ) {
        return bucket;
      }
    }

    return null;
  }

  /*
   * Search.
   */
  search(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "SEARCH",
        key,
        status: "INVALID",
        message:
          "Key must be an integer.",
      });
    }

    const bucket =
      this.getBucket(numericKey);

    const found =
      bucket.keys.includes(
        numericKey
      );

    this.totalSearches++;

    return this.recordOperation({
      type: "SEARCH",
      key: numericKey,
      bucket: bucket.id,
      status: found
        ? "FOUND"
        : "NOT_FOUND",
      found,
      message: found
        ? `Key ${numericKey} found in bucket ${bucket.id}.`
        : `Key ${numericKey} was not found.`,
    });
  }

  /*
   * Delete.
   */
  delete(key) {
    const numericKey = Number(key);

    if (!Number.isInteger(numericKey)) {
      return this.recordOperation({
        type: "DELETE",
        key,
        status: "INVALID",
        message:
          "Key must be an integer.",
      });
    }

    const bucket =
      this.getBucket(numericKey);

    const position =
      bucket.keys.indexOf(
        numericKey
      );

    if (position === -1) {
      return this.recordOperation({
        type: "DELETE",
        key: numericKey,
        bucket: bucket.id,
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
      bucket: bucket.id,
      status: "SUCCESS",
      message:
        `Key ${numericKey} deleted from bucket ${bucket.id}.`,
    });
  }

  /*
   * Record an operation.
   */
  recordOperation(operation) {
    this.operations.push({
      ...operation,
      timestamp:
        new Date().toISOString(),
    });

    return this.getState();
  }

  /*
   * Get all unique buckets.
   *
   * The directory can contain multiple
   * references to the same bucket.
   */
  getUniqueBuckets() {
    const uniqueBuckets = [];

    for (
      const bucket of this.directory
    ) {
      if (
        !uniqueBuckets.includes(
          bucket
        )
      ) {
        uniqueBuckets.push(
          bucket
        );
      }
    }

    return uniqueBuckets;
  }

  /*
   * Load factor.
   */
  getLoadFactor() {
    const uniqueBuckets =
      this.getUniqueBuckets();

    const totalCapacity =
      uniqueBuckets.length *
      this.bucketCapacity;

    if (
      totalCapacity === 0
    ) {
      return 0;
    }

    return (
      this.getTotalKeys() /
      totalCapacity
    );
  }

  /*
   * Total keys.
   */
  getTotalKeys() {
    return this.getUniqueBuckets()
      .reduce(
        (total, bucket) =>
          total +
          bucket.keys.length,
        0
      );
  }

  /*
   * Current state.
   */
  getState() {
    const uniqueBuckets =
      this.getUniqueBuckets();

    return {
      algorithm:
        "Extendible Hashing",

      globalDepth:
        this.globalDepth,

      bucketCapacity:
        this.bucketCapacity,

      directorySize:
        this.directory.length,

      directory:
        this.directory.map(
          (bucket, index) => ({
            index,
            bucketId:
              bucket.id,
          })
        ),

      buckets:
        uniqueBuckets.map(
          (bucket) => ({
            id: bucket.id,
            localDepth:
              bucket.localDepth,
            keys: [
              ...bucket.keys,
            ],
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

      totalDirectoryDoublings:
        this.totalDirectoryDoublings,

      totalProbes:
        this.totalProbes,

      operations: [
        ...this.operations,
      ],
    };
  }

  /*
   * Reset.
   */
  reset() {
    this.globalDepth =
      this.initialGlobalDepth;

    this.nextBucketId = 0;

    this.operations = [];

    this.totalInsertions = 0;
    this.totalSearches = 0;
    this.totalDeletes = 0;
    this.totalCollisions = 0;
    this.totalSplits = 0;
    this.totalDirectoryDoublings = 0;
    this.totalProbes = 0;

    this.directory = [];

    const initialBucketCount =
      Math.pow(
        2,
        this.globalDepth
      );

    for (
      let i = 0;
      i < initialBucketCount;
      i++
    ) {
      this.directory.push(
        this.createBucket(
          this.globalDepth
        )
      );
    }

    return this.getState();
  }
}
