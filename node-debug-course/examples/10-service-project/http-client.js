'use strict';

const http = require('node:http');

function getJson({ host = '127.0.0.1', port, path, requestId }) {
  return new Promise((resolve, reject) => {
    const request = http.get({
      host,
      port,
      path,
      headers: requestId ? { 'x-request-id': requestId } : {},
    }, (response) => {
      response.setEncoding('utf8');
      let raw = '';
      response.on('data', (chunk) => { raw += chunk; });
      response.on('end', () => {
        try {
          resolve({ statusCode: response.statusCode, body: JSON.parse(raw) });
        } catch (error) {
          reject(new Error(`invalid JSON response: ${raw}`, { cause: error }));
        }
      });
    });
    request.on('error', reject);
  });
}

module.exports = { getJson };

