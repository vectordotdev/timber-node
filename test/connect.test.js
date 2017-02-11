import connect from '../src/connect.js';
import { Writable, Readable } from 'stream';
import test from 'blue-tape';

class TestWriteStream extends Writable {}
class TestReadStream extends Readable {}

test("connect intercepts stdout", assert => {
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

  // Check that the buffered request count and content are correct
  const logCount = testStream._writableState.bufferedRequestCount;
  const written = testStream._writableState.getBuffer().pop().chunk.toString('utf8');

  assert.equal(logCount, 1);
  assert.equal(written, log);
  assert.end();
});

// test("throws an error when not passed a Writable stream", assert => {
//   let testStream = new TestReadStream();
//   assert.throws(() => {
//     connect(testStream);
//   });
//   assert.end();
// });

// test("does not throw an error when instantiated properly", assert => {
//   let testStream = new TestWriteStream();
//   assert.doesNotThrow(() => {
//     connect(testStream);
//   });
//   assert.end();
// });

// test("when called again, connect reverts back to original stdout", assert => {
//   assert.end();
// });