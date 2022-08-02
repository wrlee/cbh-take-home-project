const crypto = require('crypto');
const { TRIVIAL_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH } = require('./constants');

/**
 *
 * @param {*} event
 * @returns Encrypted key based on event
 */
function setKeyFromEvent(event) {
  if (event) {
    if (event.partitionKey) {
      return event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      return crypto.createHash('sha3-512').update(data).digest('hex');
    }
  } else {
    return TRIVIAL_PARTITION_KEY;
  }
}

function limitKeyLength(key) {
  return (key.length > MAX_PARTITION_KEY_LENGTH)
    ? crypto.createHash('sha3-512').update(key).digest('hex')
    : key;
}

/**
 * Return deterministic partition key associated with event
 *
 * @param {string} event Containing partition key
 * @returns Normalized partition key corresponding to event
 */
exports.deterministicPartitionKey = (event) => {
  const candidate=setKeyFromEvent(event);

  return limitKeyLength(typeof candidate !== 'string'
    ? JSON.stringify(candidate)
    : candidate);
};
