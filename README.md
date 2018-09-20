# worker-thread-pool

[![Build Status](https://travis-ci.org/SerayaEryn/worker-thread-pool.svg?branch=master)](https://travis-ci.org/SerayaEryn/worker-thread-pool)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/worker-thread-pool/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/worker-thread-pool?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![NPM version](https://img.shields.io/npm/v/worker-thread-pool.svg?style=flat)](https://www.npmjs.com/package/worker-thread-pool)

An easy way to create a pool of worker threads.

## Usage

To use the `worker-thread-pool` module you need to run at least node v10.5.0 and start node with the `--experimental-worker` flag.

```js
//main.js
const Pool = require('worker-thread-pool');

const pool = new Pool({
  path: __dirname + '/worker.js'
});
pool.run({name: 'world'})
  .then((result) => {
    //...
  })
```

```js
//worker.js
const { parentPort } = require('worker_threads');

parentPort.on('message', handleMessage);

function handleMessage(message) {
  message.port.postMessage('hello ' + message.name);
  message.port.close();
}
```

## API

### Pool(options)

Creates a new pool with workers for the specified javascript file.

#### options

##### path

The path to the javascript file containing the source code to be executed in the thread pool.

##### size (optional)

The size of the thread pool. Defaults to `4`.

### Pool#run(workerData)

Passes the `workerData` to the worker and waits until the worker sends back an answer. Resolves the answer of the worker in a Promise.

### Pool#close()

Removes all workers from the pool and calls `terminate` on them. Returns a Promise.

## License

[MIT](./LICENSE)