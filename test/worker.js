'use strict';

const { parentPort } = require('worker_threads');

parentPort.on('message', handleMessage);

function handleMessage(message) {
  if (message.command === 'terminate')
    process.exit(0);
  setTimeout(() => {
    message.port.postMessage('hello world');
    message.port.close();
  }, 50)
}