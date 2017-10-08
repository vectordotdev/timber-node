import { TestWriteStream, TestReadStream } from './support/test_streams';
import attach from '../src/utils/attach.js';
import '../src/console';

describe('Console', () => {
  it('should patch console.log', () => {
    const log = 'test console log';
    const level = 'info';

    // Create a new write stream and cork it
    // to keep the data in the buffer
    const testStream = new TestWriteStream();
    attach([testStream], process.stdout);
    testStream.cork();

    // Write the sample message to stdout
    console.log(log);

    // Check that the buffered content is correct
    const written = testStream._writableState.getBuffer().pop().chunk;

    // If the output is equal to the log message, its not patched
    expect(written).not.toBe(log);
    // The log should start with the original message
    expect(written.startsWith(`${log} @metadata`)).toBe(true);
  });
  it('should patch console.info', () => {
    const log = 'test console log';
    const level = 'info';

    // Create a new write stream and cork it
    // to keep the data in the buffer
    const testStream = new TestWriteStream();
    attach([testStream], process.stdout);
    testStream.cork();

    // Write the sample message to stdout
    console.info(log);

    // Check that the buffered content is correct
    const written = testStream._writableState.getBuffer().pop().chunk;

    // If the output is equal to the log message, its not patched
    expect(written).not.toBe(log);
    // The log should start with the original message
    expect(written.startsWith(`${log} @metadata`)).toBe(true);
  });
  it('should patch console.warn', () => {
    const log = 'test console log';
    const level = 'info';

    // Create a new write stream and cork it
    // to keep the data in the buffer
    const testStream = new TestWriteStream();
    attach([testStream], process.stdout);
    testStream.cork();

    // Write the sample message to stdout
    console.warn(log);

    // Check that the buffered content is correct
    const written = testStream._writableState.getBuffer().pop().chunk;

    // If the output is equal to the log message, its not patched
    expect(written).not.toBe(log);
    // The log should start with the original message
    expect(written.startsWith(`${log} @metadata`)).toBe(true);
  });
  it('should patch console.error', () => {
    const log = 'test console log';
    const level = 'info';

    // Create a new write stream and cork it
    // to keep the data in the buffer
    const testStream = new TestWriteStream();
    attach([testStream], process.stderr);
    testStream.cork();

    // Write the sample message to stdout
    console.error(log);

    // Check that the buffered content is correct
    const written = testStream._writableState.getBuffer().pop().chunk;

    // If the output is equal to the log message, its not patched
    expect(written).not.toBe(log);
    // The log should start with the original message
    expect(written.startsWith(`${log} @metadata`)).toBe(true);
  });
});
