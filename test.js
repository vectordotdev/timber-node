const PATH = '/frames';

const options = {
  apiKey: '12345',
  path: '/'
};

function test(apiKey, ...options) {
  console.log(apiKey);
  console.log(JSON.stringify(options));
}

test(options.apiKey, options);