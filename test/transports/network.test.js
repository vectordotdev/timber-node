import NetworkStream from '../../src/transports/network';
import HTTPSStream from '../../src/transports/https';

describe("NetworkStream", () => {
  describe("constructor", () => {
    it("extends HTTPSStream", () => {
      expect(NetworkStream.prototype).toBeInstanceOf(HTTPSStream);
    })

    it("instantiates properly", () => {
      let stream = new NetworkStream('api_key');
      expect(stream.apiKey).toBe('api_key');
    });
  });
});