import test from 'node:test';
import assert from 'node:assert/strict';

import { validateJoinForm } from './joinForm.js';

test('requires a valid email address', () => {
  assert.deepEqual(validateJoinForm({ email: '', twitter: '@jane' }), {
    email: 'Enter your email address.',
  });
  assert.deepEqual(validateJoinForm({ email: 'not-an-email', twitter: '@jane' }), {
    email: 'Enter a valid email address.',
  });
});

test('requires an X handle before joining the waitlist', () => {
  assert.deepEqual(validateJoinForm({ email: 'jane@example.com', twitter: '  ' }), {
    twitter: 'Enter your X / Twitter handle.',
  });
});

test('accepts a submission without optional consent fields', () => {
  assert.deepEqual(validateJoinForm({ email: ' jane@example.com ', twitter: ' @jane ' }), {});
});
