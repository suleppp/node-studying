'use strict';

const { getJson } = require('./http-client');

async function main() {
  const port = Number.parseInt(process.env.PORT || '3000', 10);
  const first = await getJson({ port, path: '/users/u1', requestId: 'manual-1' });
  const second = await getJson({ port, path: '/users/u1', requestId: 'manual-2' });
  const missing = await getJson({ port, path: '/users/missing', requestId: 'manual-3' });
  const stats = await getJson({ port, path: '/debug/stats', requestId: 'manual-4' });

  console.log('first request', first);
  console.log('second request', second);
  console.log('missing request', missing);
  console.log('stats', JSON.stringify(stats, null, 2));
}

main().catch((error) => {
  console.error('Start the service first with: npm run service');
  console.error(error);
  process.exitCode = 1;
});

