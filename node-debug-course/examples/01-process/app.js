'use strict';

console.log('process identity', {
  pid: process.pid,
  ppid: process.ppid,
  platform: process.platform,
});

console.log('paths', {
  cwd: process.cwd(),
  filename: __filename,
  dirname: __dirname,
});

console.log('arguments', {
  execPath: process.execPath,
  entry: process.argv[1],
  userArgs: process.argv.slice(2),
});

console.log('active for this example: no server or repeating timer');

