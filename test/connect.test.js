import connect from '../src/connect.js';
import { Writable, Readable } from 'stream';
import util from 'util';

// Stub console.log and console.warn to be what the are in node by default
// https://github.com/nodejs/node/blob/master/lib/console.js#L42
console.log = function log(...args) {
  process.stdout.write(`${util.format.apply(null, args)}\n`);
};

console.warn = function log(...args) {
  process.stderr.write(`${util.format.apply(null, args)}\n`);
};

class TestWriteStream extends Writable {
  constructor() { super({ objectMode: true }) }
  _write(){}
}
class TestReadStream extends Readable {}

describe('Connect STDOUT', () => {

  it('intercepts stdout write', () => {
    const log = 'test log...';
    
    // Create a new write stream and cork it
    // to keep the data in the buffer
    let testStream = new TestWriteStream();
    const detach = connect(testStream);
    testStream.cork();

    // Write the sample message to stdout
    process.stdout.write(log);

    // Bring back the original stdout.write
    detach();

    // Since we've detached, this shouldn't be added to the stream
    process.stdout.write("\n");

    // Check that the buffered content is correct
    const written = testStream._writableState.getBuffer().pop().chunk.message;
    expect(written).toBe(log);
  });

  it('sets the proper level for console.log', () => {
    const log = 'console log test';
    let testStream = new TestWriteStream();
    connect(testStream);
    testStream.cork();

    console.log(log);

    const chunk = testStream._writableState.getBuffer().pop().chunk;
    expect(chunk.message).toBe(`${log}\n`);
    expect(chunk.level).toBe('info');
  });

  it('sets the proper level for console.warn', () => {
    const log = 'console log test';
    let testStream = new TestWriteStream();
    connect(testStream);
    testStream.cork();

    console.warn(log);

    const chunk = testStream._writableState.getBuffer().pop().chunk;
    expect(chunk.message).toBe(`${log}\n`);
    expect(chunk.level).toBe('error');
  });

  it("throws an error when not passed a Writable stream", () => {
    let testStream = new TestReadStream();
    expect(() => {
      connect(testStream);
    }).toThrow();
  });

  it("does not throw an error when instantiated properly", () => {
    let testStream = new TestWriteStream();
    expect(() => {
      connect(testStream);
    }).not.toThrow();
  });
  
});