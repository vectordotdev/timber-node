import { Writable, Readable } from 'stream';

class TestWriteStream extends Writable {
  constructor() { super({ objectMode: true }) }
  _write(){}
}
class TestReadStream extends Readable {}

export { TestWriteStream, TestReadStream }
