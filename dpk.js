const crypto = require('crypto');
const { TRIVIAL_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH } = require('./constants');


/**
 * Return deterministic partition key associated with event
 * @param {string} event Containing partition key
 * @returns Normalized partition key
 */
exports.deterministicPartitionKey = (event) => {
  let candidate='';

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = crypto.createHash('sha3-512').update(data).digest('hex');
    }
  }

  if (candidate) {
    if (typeof candidate !== 'string') {
      candidate = JSON.stringify(candidate);
    }
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash('sha3-512').update(candidate).digest('hex');
  }
  return candidate;
};
