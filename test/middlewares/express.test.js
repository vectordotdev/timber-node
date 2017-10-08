import attach from '../../src/utils/attach.js';
import httpMocks from 'node-mocks-http';
import expressMiddleware from '../../src/middlewares/express';

describe('Express Middleware', () => {
  it('log the events properly', () => {
    // let logs = [];
    // var storeLog = inputs => (logs.push(inputs));
    // console["info"] = jest.fn(storeLog);

    // var req = httpMocks.createRequest({
    //   id: 1234,
    //   url: '/user/42',
    //   method: 'GET',
    //   headers: {
    //     'host': 'google.com',
    //     'x-forwarded-for': '192.12.321.23'
    //   },
    //   protocol: 'https'
    // });

    // var res = httpMocks.createResponse({});

    // var mw = expressMiddleware();
    // var next = () => { };
    // mw(req, res, next);

    // // Check that the buffered content is correct
    // //const written = testStream._writableState.getBuffer().pop().chunk;

    // // If the output is equal to the log message, its not patched
    // var log = logs[0];
    // expect(log.constructor.name).toBe("Augment");
    // expect(log.data.context.http.method).toBe("GET");
    // expect(log.data.event.http_request.direction).toBe("incoming");
  })
})