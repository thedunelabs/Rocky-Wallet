import assert from 'node:assert/strict';
import test from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

const COMMAND = 'npm install @rocky-wallet/dapp-sdk';
const DOM_GLOBALS = ['window', 'document', 'navigator', 'HTMLElement', 'Node', 'Event', 'MouseEvent'];

let CopyCommand;
let server;

test.before(async () => {
  server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });
  ({ default: CopyCommand } = await server.ssrLoadModule('/src/CopyCommand.jsx'));
});

test.after(async () => {
  await server.close();
});

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

function createScheduler() {
  let nextId = 1;
  const tasks = new Map();
  const scheduleCalls = [];

  return {
    cancelReset(id) {
      tasks.delete(id);
    },
    get pendingCount() {
      return tasks.size;
    },
    runAll() {
      const callbacks = [...tasks.values()];
      tasks.clear();
      callbacks.forEach((callback) => callback());
    },
    scheduleCalls,
    scheduleReset(callback, delay) {
      const id = nextId;
      nextId += 1;
      scheduleCalls.push({ delay, id });
      tasks.set(id, callback);
      return id;
    },
  };
}

function renderCopyCommand(props) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
  const originalGlobals = new Map(
    DOM_GLOBALS.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]),
  );
  const originalActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;

  for (const name of DOM_GLOBALS) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value: dom.window[name],
    });
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  const container = dom.window.document.getElementById('root');
  const root = createRoot(container);
  let mounted = true;
  act(() => root.render(React.createElement(CopyCommand, { command: COMMAND, ...props })));

  function unmount() {
    if (!mounted) return;
    act(() => root.unmount());
    mounted = false;
  }

  return {
    button: () => container.querySelector('button'),
    cleanup() {
      unmount();
      dom.window.close();
      for (const [name, descriptor] of originalGlobals) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor);
        else delete globalThis[name];
      }
      globalThis.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment;
    },
    code: () => container.querySelector('code'),
    dom,
    status: () => container.querySelector('.rw-copy-status'),
    unmount,
  };
}

function click(view) {
  act(() => {
    view.button().dispatchEvent(new view.dom.window.MouseEvent('click', { bubbles: true }));
  });
}

async function settle(action) {
  await act(async () => {
    action();
    await Promise.resolve();
    await Promise.resolve();
  });
}

test('keeps the command selectable while exposing disabled pending feedback', async (context) => {
  const pendingCopy = deferred();
  const scheduler = createScheduler();
  const view = renderCopyCommand({
    cancelReset: scheduler.cancelReset,
    copy: () => pendingCopy.promise,
    scheduleReset: scheduler.scheduleReset,
  });
  context.after(() => view.cleanup());

  click(view);

  assert.equal(view.code().textContent, COMMAND);
  assert.equal(view.button().disabled, true);
  assert.equal(view.button().textContent.trim(), 'Copying');
  assert.equal(view.button().getAttribute('aria-label'), 'Copying SDK install command');
  assert.equal(view.status().getAttribute('aria-live'), 'polite');
  assert.equal(view.status().textContent, 'Copying install command.');

  await settle(() => pendingCopy.resolve(COMMAND));
});

test('announces success and resets with the supplied scheduler', async (context) => {
  const scheduler = createScheduler();
  const view = renderCopyCommand({
    cancelReset: scheduler.cancelReset,
    copy: async () => COMMAND,
    scheduleReset: scheduler.scheduleReset,
  });
  context.after(() => view.cleanup());

  click(view);
  await settle(() => {});

  assert.equal(view.button().disabled, false);
  assert.equal(view.button().textContent.trim(), 'Copied');
  assert.equal(view.button().getAttribute('aria-label'), 'Copied SDK install command');
  assert.equal(view.status().textContent, 'Install command copied.');
  assert.deepEqual(scheduler.scheduleCalls, [{ delay: 2000, id: 1 }]);

  act(() => scheduler.runAll());

  assert.equal(view.button().textContent.trim(), 'Copy');
  assert.equal(view.button().getAttribute('aria-label'), 'Copy SDK install command');
  assert.equal(view.status().textContent, '');
  assert.equal(scheduler.pendingCount, 0);
});

test('clears failure feedback while retrying so repeated failures are announced', async (context) => {
  const attempts = [deferred(), deferred()];
  let attempt = 0;
  const view = renderCopyCommand({ copy: () => attempts[attempt++].promise });
  context.after(() => view.cleanup());

  click(view);
  assert.equal(view.button().textContent.trim(), 'Copying');
  assert.equal(view.status().textContent, 'Copying install command.');
  await settle(() => attempts[0].reject(new Error('first failure')));
  assert.equal(view.button().textContent.trim(), 'Retry');
  assert.equal(view.button().getAttribute('aria-label'), 'Retry SDK install command');
  assert.equal(view.status().textContent, 'Copy failed — select the command manually');

  click(view);
  assert.equal(view.button().textContent.trim(), 'Copying');
  assert.equal(view.status().textContent, 'Copying install command.');
  await settle(() => attempts[1].reject(new Error('second failure')));
  assert.equal(view.button().textContent.trim(), 'Retry');
  assert.equal(view.status().textContent, 'Copy failed — select the command manually');
});

test('ignores stale completion from an overlapping copy attempt', async (context) => {
  const firstCopy = deferred();
  const secondCopy = deferred();
  const scheduler = createScheduler();
  let copyCalls = 0;
  let view;
  const copy = () => {
    copyCalls += 1;
    if (copyCalls === 1) {
      view.button().dispatchEvent(new view.dom.window.MouseEvent('click', { bubbles: true }));
      return firstCopy.promise;
    }
    return secondCopy.promise;
  };
  view = renderCopyCommand({
    cancelReset: scheduler.cancelReset,
    copy,
    scheduleReset: scheduler.scheduleReset,
  });
  context.after(() => view.cleanup());

  click(view);
  assert.equal(copyCalls, 2);

  await settle(() => secondCopy.resolve(COMMAND));
  assert.equal(view.button().textContent.trim(), 'Copied');
  assert.equal(scheduler.pendingCount, 1);

  await settle(() => firstCopy.reject(new Error('stale failure')));
  assert.equal(view.button().textContent.trim(), 'Copied');
  assert.equal(view.status().textContent, 'Install command copied.');
  assert.equal(scheduler.pendingCount, 1);
});

test('invalidates a pending copy on unmount without scheduling a reset', async () => {
  const pendingCopy = deferred();
  const scheduler = createScheduler();
  let copyCalls = 0;
  const view = renderCopyCommand({
    cancelReset: scheduler.cancelReset,
    copy: () => {
      copyCalls += 1;
      return pendingCopy.promise;
    },
    scheduleReset: scheduler.scheduleReset,
  });

  click(view);
  assert.equal(copyCalls, 1);
  view.unmount();
  await settle(() => pendingCopy.resolve(COMMAND));

  assert.equal(scheduler.scheduleCalls.length, 0);
  view.cleanup();
});
