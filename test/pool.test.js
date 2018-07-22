'use strict';

const t = require('tap');
const test = t.test;
const Pool = require('../lib/Worker');

test('should create pool', (t) => {
  t.plan(1);
  const pool = new Pool({
    path: __dirname + '/worker.js'
  })

  return pool.run({test: 1})
    .then((result) => {
      t.strictEquals(result, 'hello world')
      pool.close();
    });
});

test('should create pool', (t) => {
  t.plan(1);
  const pool = new Pool({
    path: __dirname + '/worker.js',
    size: 1
  })

  return Promise.all([
    pool.run({test: 1}),
    pool.run({test: 2}),
    pool.run({test: 3}),
    pool.run({test: 4})
  ])
    .then((result) => {
      t.deepEquals(result, ['hello world', 'hello world', 'hello world', 'hello world'])
      pool.close();
    })
    .catch((error) => t.error(error));
});