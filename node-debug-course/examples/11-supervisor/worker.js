'use strict';

const runNumber = Number.parseInt(process.argv[2], 10);
let localCounter = 0;

console.log('worker started', {
  runNumber,
  pid: process.pid,
  ppid: process.ppid,
  localCounter,
});

localCounter += 1;

if (process.send) {
  process.send({ type: 'ready', runNumber, pid: process.pid, localCounter });
}

setTimeout(() => {
  const exitCode = runNumber === 1 ? 75 : 0;
  console.log('worker exiting', { runNumber, pid: process.pid, exitCode, localCounter });
  process.exitCode = exitCode;
}, 20);

