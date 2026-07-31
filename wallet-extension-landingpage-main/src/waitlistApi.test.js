import test from 'node:test';
import assert from 'node:assert/strict';

import { submitWaitlist } from './waitlistApi.js';

test('submits the join form to the public waitlist endpoint', async () => {
  const calls = [];
  const fetchImpl = async (...args) => {
    calls.push(args);
    return new Response(JSON.stringify({ submission_id: 'submission-1', status: 'submitted' }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  };

  const result = await submitWaitlist({ email: 'jane@example.com', twitter: '@jane' }, { fetchImpl });

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'https://api-extension.rocky.exchange/v1/waitlist');
  assert.equal(calls[0][1].method, 'POST');
  assert.deepEqual(JSON.parse(calls[0][1].body), {
    email: 'jane@example.com',
    twitter: '@jane',
  });
  assert.deepEqual(result, { submission_id: 'submission-1', status: 'submitted' });
});

test('surfaces waitlist API errors', async () => {
  const fetchImpl = async () => new Response(JSON.stringify({ error: 'twitter is required' }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  });

  await assert.rejects(
    submitWaitlist({ email: 'jane@example.com', twitter: '' }, { fetchImpl }),
    /twitter is required/,
  );
});
