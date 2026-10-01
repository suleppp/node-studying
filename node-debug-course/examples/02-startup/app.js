'use strict';

const path = require('node:path');

function declaredFunction() {
  return 'function declaration was initialized before this call';
}

console.log('startup facts', {
  pid: process.pid,
  cwd: process.cwd(),
  dirname: __dirname,
  entry: process.argv[1],
  userArgs: process.argv.slice(2),
  resolvedSelf: require.resolve('./app'),
  siblingPath: path.join(__dirname, 'syntax-error.js'),
});

console.log(declaredFunction());

