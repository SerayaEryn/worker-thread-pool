# worker-thread-pool

[![Build Status](https://travis-ci.org/SerayaEryn/worker-thread-pool.svg?branch=master)](https://travis-ci.org/SerayaEryn/worker-thread-pool)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/worker-thread-pool/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/worker-thread-pool?branch=master)

A easy way to create a pool of worker threads.

## Usage

```js
//main.js
const Pool = require('worker-thread-pool');

const pool = new Pool({
  path: __dirname + '/worker.js'
});
pool.run({data: 'something'})
  .then((result) => {
    //...
  })
```

```js
//worker.js
const { parentPort } = require('worker_threads');

parentPort.on('message', handleMessage);

function handleMessage(message) {
  message.port.postMessage('hello world');
  message.port.close();
}
```

## API

### new Pool(options)

#### options

##### path

The path to the javascript file containing the source code to be executed in the thread pool.

##### size (optional)

The size of the thread pool. Defaults to `4`.

## License

[MIT](./LICENSE)