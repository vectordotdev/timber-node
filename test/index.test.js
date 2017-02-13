import Index from '../src/index';

describe('Entry File', () => {

  it('exports middlewares', () => {
    expect(typeof Index.middlewares).not.toBeUndefined();
  });

  it('exports a client', () => {
    expect(typeof Index.Client).not.toBeUndefined();
  });

  it('exports transport methods', () => {
    expect(typeof Index.transports).not.toBeUndefined();
  });

  it('exports stdout connect', () => {
    expect(typeof Index.connect).not.toBeUndefined();
  });

});