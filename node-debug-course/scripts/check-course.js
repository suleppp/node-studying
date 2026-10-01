'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const failures = [];

function recordFailure(message) {
  failures.push(message);
  console.error('FAIL', message);
}

function run(relativeFile, expectedText) {
  const result = spawnSync(process.execPath, [relativeFile], {
    cwd: root,
    encoding: 'utf8',
    timeout: 8_000,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;

  if (result.error) {
    recordFailure(`${relativeFile}: ${result.error.message}`);
    return;
  }
  if (result.status !== 0) {
    recordFailure(`${relativeFile}: exit=${result.status}\n${output}`);
    return;
  }
  if (!output.includes(expectedText)) {
    recordFailure(`${relativeFile}: missing output ${JSON.stringify(expectedText)}\n${output}`);
    return;
  }
  console.log('PASS', relativeFile);
}

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function checkMarkdownLinks() {
  const markdownFiles = walk(root).filter((file) => file.endsWith('.md'));
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;

  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(linkPattern)) {
      const target = match[1].trim();
      if (/^(?:https?:|mailto:|#)/.test(target)) continue;
      const withoutFragment = target.split('#', 1)[0];
      const resolved = path.resolve(path.dirname(file), decodeURIComponent(withoutFragment));
      if (!fs.existsSync(resolved)) {
        recordFailure(`${path.relative(root, file)}: broken link ${target}`);
      }
    }
  }

  console.log('checked markdown files:', markdownFiles.length);
}

function checkStructure() {
  const required = [
    'README.md',
    'book/00-study-guide.md',
    'book/learning-path.md',
    'book/workbook.md',
    ...Array.from({ length: 19 }, (_, index) => `book/${String(index + 1).padStart(2, '0')}-${[
      'source-program-process',
      'node-startup',
      'execution-position',
      'call-stack',
      'how-debugger-works',
      'vscode-debug-session',
      'scope-and-variables',
      'console-repl-terminal',
      'breakpoints-and-stepping',
      'commonjs',
      'redis-simulation',
      'async-event-loop',
      'service-project',
      'launch-json',
      'npm-child-process',
      'debug-console-safety',
      'debugging-method',
      'workplace-ticket',
      'capstone',
    ][index]}.md`),
    'book/final-checklist.md',
    'labs/README.md',
    'answers/README.md',
    '.vscode/launch.json',
  ];

  for (const relativeFile of required) {
    if (!fs.existsSync(path.join(root, relativeFile))) {
      recordFailure(`missing required file: ${relativeFile}`);
    }
  }

  assert.equal(required.length, 27);
}

function checkIntentionalSyntaxError() {
  const relativeFile = 'examples/02-startup/syntax-error.js';
  const result = spawnSync(process.execPath, ['--check', relativeFile], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status === 0 || !`${result.stderr}${result.stdout}`.includes('SyntaxError')) {
    recordFailure(`${relativeFile}: expected an intentional SyntaxError`);
  } else {
    console.log('PASS intentional syntax-error fixture');
  }
}

checkStructure();
checkMarkdownLinks();

run('app.js', 'result = 30');
run('examples/01-process/app.js', 'process identity');
run('examples/02-startup/app.js', 'function declaration was initialized');
run('examples/03-order/app.js', '8. result 30');
run('examples/04-stack/app.js', 'factorial(4) = 24');
run('examples/05-scope/app.js', 'secondId: 42');
run('examples/06-commonjs/app.js', 'shared final count: 2');
run('examples/07-fake-redis/app.js', 'after TTL: null');
run('examples/08-event-loop/app.js', '3. nextTick');
run('examples/09-async-stack/app.js', 'displayName:');
run('examples/10-service-project/self-test.js', 'service self-test passed');
run('examples/11-supervisor/supervisor.js', 'supervisor restarting worker');
run('labs/01-sync-order-bug/app.js', 'BUG REPRODUCED');
run('labs/02-cache-key-bug/app.js', 'BUG REPRODUCED');
run('labs/03-service-stale-cache/app.js', 'BUG REPRODUCED');
run('labs/04-multitenant-cache-leak/app.js', 'BUG REPRODUCED');
checkIntentionalSyntaxError();

if (failures.length > 0) {
  console.error(`\n${failures.length} course check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll course checks passed.');
}
