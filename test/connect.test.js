import connect from '../src/connect.js';
import { Writable, Readable } from 'stream';

class TestWriteStream extends Writable { _write(){} }
class TestReadStream extends Readable {}

describe('Connect STDOUT', () => {

  it('intercepts stdout', () => {
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
    const written = testStream._writableState.getBuffer().pop().chunk.toString('utf8');
    expect(written).toBe(log);
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