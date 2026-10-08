import assert from 'node:assert/strict';
import { test } from 'node:test';
import { preferredQuality, mountAdaptiveCube } from '../public/loader-live/quality.js';

function fixture() {
  const canvas = () => ({ cloneNode: () => canvas(), replaceWith() {} });
  return { dataset: {}, querySelector: () => canvas() };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

test('quality policy honours motion/data saving and weak or slow devices', () => {
  assert.equal(preferredQuality({}), 'high');
  assert.equal(preferredQuality({ cores: 8, memory: 8, effectiveType: '4g' }), 'high');
  for (const hints of [{ cores: 2 }, { memory: 2 }, { effectiveType: '3g' }, { downlink: 1 }]) {
    assert.equal(preferredQuality(hints), 'light');
  }
  assert.equal(preferredQuality({ reduced: true }), 'static');
  assert.equal(preferredQuality({ saveData: true }), 'static');
});

test('working high quality never downloads or starts a second renderer', async () => {
  const element = fixture(), calls = []; let disposed = 0, announcements = 0;
  const gate = mountAdaptiveCube(element, async (_, options) => {
    calls.push(options.quality); options.onReady(); return { dispose() { disposed++; } };
  }, 'high', { onVisualReady: () => announcements++ });
  await flush();
  assert.deepEqual(calls, ['high']); assert.equal(element.dataset.live, 'true');
  assert.equal(announcements, 1); gate.dispose(); gate.dispose(); assert.equal(disposed, 1);
});

test('high failure falls through light failure to the still', async () => {
  const element = fixture(), calls = []; let disposed = 0;
  const gate = mountAdaptiveCube(element, async (_, options) => {
    calls.push(options.quality); options.onError(); return { dispose() { disposed++; } };
  }, 'high');
  await flush();
  assert.deepEqual(calls, ['high', 'light']); assert.equal(element.dataset.quality, 'static');
  assert.equal(element.dataset.live, 'false'); assert.equal(disposed, 2); gate.dispose();
});

test('slow high startup is aborted before the lightweight attempt', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const element = fixture(), calls = []; let highSignal;
  const gate = mountAdaptiveCube(element, async (_, options) => {
    calls.push(options.quality);
    if (options.quality === 'high') { highSignal = options.signal; return new Promise(() => {}); }
    assert.equal(highSignal.aborted, true); options.onReady(); return { dispose() {} };
  }, 'high');
  t.mock.timers.tick(550); await flush();
  assert.deepEqual(calls, ['high', 'light']); assert.equal(element.dataset.quality, 'light');
  gate.dispose();
});

test('poor frame timing downgrades a live high tier once without restarting the entrance clock', async () => {
  const element = fixture(); let slow, announcements = 0; const calls = [];
  const gate = mountAdaptiveCube(element, async (_, options) => {
    calls.push(options.quality); if (options.quality === 'high') slow = options.onSlow;
    options.onReady(); return { dispose() {} };
  }, 'high', { onVisualReady: () => announcements++ });
  await flush(); slow(); await flush(); slow(); await flush();
  assert.deepEqual(calls, ['high', 'light']); assert.equal(announcements, 1); gate.dispose();
});

test('the stop pose has all 27 cubies fully settled at their first quarter-turn', async () => {
  const { FIRST_TURN_END } = await import('../public/loader-live/0ee6a15df8ec/cube.js');
  const order = [3,0,6,7,4,1,2,8,5];
  const fractions = Array.from({ length: 27 }, (_, i) => {
    const depth = Math.floor(i / 9), rank = order[(i + depth * 3) % 9];
    return (FIRST_TURN_END / 6.6 - .39 - rank * .019 - depth * .006) / (.35 + i % 3 * .013);
  });
  assert.ok(fractions.every(t => t >= 1 - 1e-12));
  assert.ok(FIRST_TURN_END < 6.6);
});
