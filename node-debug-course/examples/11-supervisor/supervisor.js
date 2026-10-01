'use strict';

const path = require('node:path');
const { fork } = require('node:child_process');

const workerPath = path.join(__dirname, 'worker.js');
let runNumber = 0;

console.log('supervisor started', { pid: process.pid, ppid: process.ppid });

function startWorker() {
  runNumber += 1;
  const child = fork(workerPath, [String(runNumber)], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });

  child.on('message', (message) => {
    console.log('supervisor received IPC', { fromPid: child.pid, message });
  });

  child.on('exit', (code, signal) => {
    console.log('supervisor observed exit', { childPid: child.pid, code, signal });
    if (code === 75 && runNumber < 2) {
      console.log('supervisor restarting worker');
      startWorker();
      return;
    }
    process.exitCode = code || 0;
  });
}

startWorker();

