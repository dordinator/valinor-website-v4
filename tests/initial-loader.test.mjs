import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
const source = await readFile(new URL('../src/components/initial-loader/bootstrap.ts', import.meta.url), 'utf8');
const script = source.match(/= `([\s\S]*)`;/)[1];
function gate(storage = new Map()) {
  const attributes = new Map(), style = new Map(), timers = new Map();
  const window = new EventTarget(); let now = 0, nextTimer = 0;
  const timer = (fn, delay) => { const id = ++nextTimer; timers.set(id, { fn, at: now + delay }); return id; };
  const document = { documentElement: {
    style: { setProperty: (key, value) => style.set(key, value), removeProperty: key => style.delete(key) },
    setAttribute: (key, value) => attributes.set(key, value), removeAttribute: key => attributes.delete(key),
  }};
  vm.runInNewContext(script, { document, window, Event,
    performance: { now: () => now },
    sessionStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    setTimeout: timer, clearTimeout: id => timers.delete(id),
    requestAnimationFrame: fn => timer(fn, 16), cancelAnimationFrame: id => timers.delete(id),
  });
  function advance(ms) {
    const target = now + ms;
    while (true) {
      const next = [...timers].filter(([, task]) => task.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      now = next[1].at; timers.delete(next[0]); next[1].fn();
    }
    now = target;
  }
  const emit = (name, detail) => window.dispatchEvent(new CustomEvent('valinor:' + name, { detail }));
  return { attributes, style, timers, window, advance, emit };
}

test('white mask follows actual turn progress without completing early', () => {
  const g = gate(); g.emit('visual-ready', { quality: 'high' }); g.emit('page-ready');
  g.emit('visual-progress', .4); assert.equal(g.style.get('--initial-loader-progress'), '0.4');
  g.emit('visual-progress', .2); assert.equal(g.style.get('--initial-loader-progress'), '0.4');
  g.emit('visual-progress', 1); assert.equal(g.style.get('--initial-loader-progress'), '0.98');
  assert.equal(g.attributes.get('data-initial-loading'), 'loading');
});

test('settling completes all lettering and immediately begins revealing the page', () => {
  const g = gate(); let disposed = 0;
  g.window.addEventListener('valinor:loader-finished', () => disposed++);
  g.emit('visual-ready', { quality: 'high' }); g.emit('page-ready');
  g.advance(3000); assert.equal(g.attributes.get('data-initial-loading'), 'loading');
  g.emit('cube-settled');
  assert.equal(g.style.get('--initial-loader-progress'), '1');
  assert.equal(g.attributes.get('data-initial-loading'), 'leaving');
  assert.equal(disposed, 0); // Hold the last cube frame through the fade.
  g.advance(160); assert.equal(disposed, 1);
  assert.equal(g.attributes.has('data-initial-loading'), false); assert.equal(g.timers.size, 0);
});

test('a settled cube waits if the actual page is not ready', () => {
  const g = gate(); g.emit('visual-ready', { quality: 'light' });
  g.emit('visual-progress', 1); g.emit('cube-settled');
  assert.equal(g.attributes.get('data-initial-loading'), 'loading');
  assert.equal(g.style.get('--initial-loader-progress'), '0.98');
  g.emit('page-ready'); assert.equal(g.style.get('--initial-loader-progress'), '1');
  assert.equal(g.attributes.get('data-initial-loading'), 'leaving');
});

test('static fallback fills over three seconds and exits fully white', () => {
  const g = gate(); g.emit('visual-ready', { quality: 'static' }); g.emit('page-ready');
  g.advance(1500); assert.ok(Number(g.style.get('--initial-loader-progress')) > .49);
  assert.ok(Number(g.style.get('--initial-loader-progress')) < .51);
  g.advance(1520); assert.equal(g.style.get('--initial-loader-progress'), '1');
  assert.equal(g.attributes.get('data-initial-loading'), 'leaving');
});

test('missing hydration or renderer cannot trap the page', () => {
  const g = gate(); g.advance(4500);
  assert.equal(g.style.get('--initial-loader-progress'), '1');
  assert.equal(g.attributes.get('data-initial-loading'), 'leaving');
  g.advance(160); assert.equal(g.attributes.has('data-initial-loading'), false);
});

test('page exit disposes immediately, including during the final fade', () => {
  const g = gate(); g.emit('page-ready'); g.emit('cube-settled');
  g.window.dispatchEvent(new Event('pagehide'));
  assert.equal(g.attributes.has('data-initial-loading'), false); assert.equal(g.timers.size, 0);
});

test('later full-document pages in the same tab skip the gate', () => {
  const storage = new Map(); gate(storage); const next = gate(storage);
  assert.equal(next.attributes.has('data-initial-loading'), false); assert.equal(next.timers.size, 0);
});
