import attach from '../../src/utils/attach.js';
import { Writable, Readable } from 'stream';
import winston from 'winston';

class TestWriteStream extends Writable {
  constructor() { super({ objectMode: true }) }
  _write(){}
}
class TestReadStream extends Readable {}

describe('Winston', () => {
  it('captures Winston info logs', () => {
    const log = 'test winston log...';
    const level = 'info';

    // Create a new write stream and cork it
    // to keep the data in the buffer
    let testStream = new TestWriteStream();
    const detach = attach([testStream], process.stdout);
    testStream.cork();

    // Write the sample message to stdout
    winston.log(level, log);

    // Check that the buffered content is correct
    const written = testStream._writableState.getBuffer().pop().chunk;
    expect(written).toBe(`${level}: ${log}\n`);
  });
});
