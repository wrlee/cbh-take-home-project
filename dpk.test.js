const crypto = require('crypto');
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the `partitionKey` field when included", () => {
    const partitionKey = 'whatever'
    const trivialKey = deterministicPartitionKey({partitionKey});
    expect(trivialKey).toBe(partitionKey);
  });

  it("Returns encrypted hash of entire event when no partitionKey is included", () => {
    const event = {};
    const trivialKey = deterministicPartitionKey(event);
    const key = crypto.createHash('sha3-512').update(JSON.stringify(event)).digest('hex')
    expect(trivialKey).toBe( key );
  });

  it("Returns the encrypted has of partitionKey when it is too long", () => {
    const partitionKey = 'x'.repeat(512)
    const trivialKey = deterministicPartitionKey({partitionKey});
    const key = crypto.createHash('sha3-512').update(partitionKey).digest('hex')
    expect(trivialKey).toBe(key);
  });

});
