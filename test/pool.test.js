'use strict'

const t = require('tap')
const test = t.test
const Pool = require('../lib/Worker')
const path = require('path')

test('should create pool', (t) => {
  t.plan(2)
  const pool = new Pool({
    path: path.join(__dirname, '/worker.js')
  })

  return pool.run({ test: 1 })
    .then((result) => {
      t.strictEquals(result, 'hello world')
      pool.close()
    })
    .then(() => t.pass())
})

test('should close pool', (t) => {
  t.plan(2)
  const pool = new Pool({
    path: path.join(__dirname, '/worker.js'),
    size: 1
  })

  return Promise.all([
    pool.run({ test: 1 }),
    pool.run({ test: 2 }),
    pool.run({ test: 3 }),
    pool.run({ test: 4 })
  ])
    .then((result) => {
      t.deepEquals(result, ['hello world', 'hello world', 'hello world', 'hello world'])
      pool.close()
    })
    .then(() => {
      t.equals(pool.pool.length, 0)
    })
})

test('should create new worker if error in worker', (t) => {
  t.plan(3)
  const pool = new Pool({
    path: path.join(__dirname, '/boom.js'),
    size: 1
  })

  return pool.run({ test: 1 })
    .catch((err) => {
      t.equals(err.message, 'boooom')
      t.equals(pool.pool.length, 1)
      pool.close()
      t.equals(pool.pool.length, 0)
    })
})
