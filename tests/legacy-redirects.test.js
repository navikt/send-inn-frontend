import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

const environments = [
  { legacyBasePath: '/sendinn', basePath: '/sendinn-dokumenter' },
  { legacyBasePath: '/sendinn-alt', basePath: '/sendinn-dokumenter-alt' },
  { legacyBasePath: '/sendinn-delingslenke', basePath: '/sendinn-dokumenter-delingslenke' },
];

for (const { legacyBasePath, basePath } of environments) {
  test(`redirects ${legacyBasePath} before rendering or login`, { timeout: 120_000 }, async (t) => {
    const server = spawn(
      process.execPath,
      [
        require.resolve('next/dist/bin/next'),
        'dev',
        fileURLToPath(new URL('./fixtures/redirects', import.meta.url)),
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
          NEXT_PUBLIC_BASE_PATH: basePath,
          LEGACY_BASE_PATH: legacyBasePath,
          NEXT_TELEMETRY_DISABLED: '1',
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

    for (const suffix of [
      '',
      '/example-id',
      '/ettersending/example-id',
      '/dokumentinnsending/example-id',
      '/nb/example-id',
      '/en/ettersending/example-id',
      '/nn/dokumentinnsending/example-id',
    ]) {
      const query = '?source=notification&tag=one&tag=two&redirect=%2Fsendinn%2Fexample-id';
      const response = await fetch(`${origin}${legacyBasePath}${suffix}${query}`, {
        redirect: 'manual',
        signal: AbortSignal.timeout(10_000),
      });
      assert.equal(response.status, 307, `${legacyBasePath}${suffix}`);
      const destination = new URL(response.headers.get('location'), origin);
      assert.equal(destination.origin, origin);
      assert.equal(destination.pathname, `${basePath}${suffix}`);
      assert.deepEqual([...destination.searchParams], [...new URLSearchParams(query)]);
    }

    const response = await fetch(`${origin}${basePath}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(10_000),
    });
    assert.equal(response.status, 200, 'the new base path must not redirect to itself');

    const returnPath = `${basePath}/example-id`;
    const loginResponse = await fetch(
      `${origin}${basePath}/redirect/login?redirect=${encodeURIComponent(returnPath)}`,
      {
        redirect: 'manual',
        signal: AbortSignal.timeout(10_000),
      },
    );
    assert.equal(loginResponse.status, 307);
    const loginDestination = new URL(loginResponse.headers.get('location'), origin);
    assert.equal(loginDestination.origin, origin);
    assert.equal(loginDestination.pathname, `${basePath}/oauth2/login`);
    assert.equal(loginDestination.searchParams.get('redirect'), returnPath);
  });
}
