import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

test('backend proxy omits Accept-Language and preserves the request', { timeout: 120_000 }, async (t) => {
  const backend = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    res.setHeader('content-type', 'application/json');
    res.end(
      JSON.stringify({
        acceptLanguage: req.headers['accept-language'] ?? null,
        contentType: req.headers['content-type'] ?? null,
        requestMarker: req.headers['x-test-marker'],
        method: req.method,
        url: req.url,
        body: Buffer.concat(chunks).toString(),
      }),
    );
  });
  backend.listen(0, '127.0.0.1');
  await once(backend, 'listening');
  t.after(() => new Promise((resolve) => backend.close(resolve)));
  const backendOrigin = `http://127.0.0.1:${backend.address().port}`;
  const nextEnvPath = new URL('../next-env.d.ts', import.meta.url);
  const nextEnv = await readFile(nextEnvPath);

  const server = spawn(
    process.execPath,
    [
      require.resolve('next/dist/bin/next'),
      'dev',
      fileURLToPath(new URL('..', import.meta.url)),
      '--webpack',
      '--hostname',
      '127.0.0.1',
      '--port',
      '0',
    ],
    {
      env: {
        ...process.env,
        NODE_ENV: 'development',
        APP_ENV: 'test',
        NEXT_PUBLIC_BASE_PATH: '/sendinn-dokumenter',
        LEGACY_BASE_PATH: '',
        NEXT_TELEMETRY_DISABLED: '1',
        REMOTE_API_URL: backendOrigin,
        NAIS_TOKEN_EXCHANGE_ENDPOINT: backendOrigin,
        NAIS_TOKEN_INTROSPECTION_ENDPOINT: backendOrigin,
        NO_PROXY: `${process.env.NO_PROXY || ''},127.0.0.1`,
        no_proxy: `${process.env.no_proxy || ''},127.0.0.1`,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  t.after(async () => {
    if (server.exitCode === null && server.signalCode === null) {
      const closed = once(server, 'close');
      server.kill('SIGTERM');
      await closed;
    }
    // Next dev rewrites this tracked file to reference its generated dev types.
    await writeFile(nextEnvPath, nextEnv);
  });
  let output = '';
  const origin = await new Promise((resolve, reject) => {
    server.on('error', reject);
    server.on('exit', (code, signal) => reject(new Error(`Next.js exited (${code ?? signal}): ${output}`)));
    server.stderr.on('data', (chunk) => {
      output += chunk;
    });
    server.stdout.on('data', (chunk) => {
      output += chunk;
      const address = output.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (address && output.includes('Ready in')) resolve(address[0]);
    });
  });

  for (const acceptLanguage of ['nb-NO,nb,nn-NO,nn,en-US,en,en-GB,sv-SE,sv,da-DK,da', 'nb', undefined]) {
    for (const method of ['GET', 'POST']) {
      const body = method === 'POST' ? JSON.stringify({ test: 'streamed request' }) : undefined;
      const response = await fetch(`${origin}/sendinn-dokumenter/api/backend/frontend/v1/soknad/test-id?test=1`, {
        method,
        headers: {
          ...(acceptLanguage && { 'Accept-Language': acceptLanguage }),
          ...(body && { 'Content-Type': 'application/json' }),
          'X-Test-Marker': 'preserve-this-header',
        },
        body,
        signal: AbortSignal.timeout(30_000),
      });
      assert.equal(response.status, 200, output);
      const forwarded = await response.json();
      assert.equal(forwarded.acceptLanguage, null, 'Accept-Language must not reach the backend');
      assert.equal(forwarded.requestMarker, 'preserve-this-header');
      assert.equal(forwarded.method, method);
      assert.equal(forwarded.url, '/frontend/v1/soknad/test-id?test=1');
      assert.equal(forwarded.body, body ?? '');
      if (body) assert.equal(forwarded.contentType, 'application/json');
    }
  }
});
