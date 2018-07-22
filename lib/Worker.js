'use strict';

const { Worker, MessageChannel } = require('worker_threads');
const EventEmitter = require('events');
const List = require('./List')

module.exports = class ThreadPool extends EventEmitter {
  constructor(options) {
    super()
    const opts = options;
    this.size = opts.size || 4;
    this.pool = new List();
    this.queue = new List();
    for (let i = 0; i < this.size; i++) {
      this._addNewWorkerToPool(opts.path);
    }
    this._onRelease = this._onRelease.bind(this);
    this.on('release', this._onRelease);
  }

  run(workerData) {
    if (this.pool.length > 0) {
      return new Promise((resolve, reject) => {
        const worker = this.pool.shift();
        this._run(worker, workerData, resolve, reject);
      });
    } else {
      return new Promise((resolve, reject) => {
        this.queue.push((worker) => {
          this._run(worker, workerData, resolve, reject);
        });
      });
    }
  }

  close() {
    for (const worker of this.pool) {
      const workerData = {command: 'terminate'};
      let messageChannel = new MessageChannel();
      workerData.port = messageChannel.port1;
      worker.postMessage(workerData, [messageChannel.port1]);
      worker.unref();
    }
  }

  _onRelease(worker) {
    if (this.queue.length > 0) {
      const cb = this.queue.shift();
      cb(worker);
    } else {
      this.pool.push(worker)
    }
  }

  _run(worker, workerData, resolve, reject) {
    let messageChannel = new MessageChannel();
    workerData.port = messageChannel.port1;
    messageChannel.port2.once('message', (result) => {
      this.emit('release', worker);
      resolve(result);
    });
    messageChannel.port2.once('error', reject);
    worker.postMessage(workerData, [messageChannel.port1]);
  }

  _addNewWorkerToPool(path) {
    const worker = new Worker(path);
    worker.once('exit', (exitCode) => {
      if (exitCode !== 0) {
        this._addNewWorkerToPool(path);
      }
    });
    this.pool.push(worker);
  }
}

