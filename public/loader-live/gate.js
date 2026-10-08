import { preferredQuality, mountAdaptiveCube } from './quality.js';

async function start() {
  const pending = () => document.documentElement.getAttribute('data-initial-loading') === 'loading';
  if (!pending()) return;
  const element = document.querySelector('[data-valinor-loader]');
  if (!element) return;
  const visualReady = quality => window.dispatchEvent(new CustomEvent('valinor:visual-ready', { detail: { quality } }));
  const connection = navigator.connection;
  const preferred = preferredQuality({
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: connection?.saveData,
    cores: navigator.hardwareConcurrency,
    memory: navigator.deviceMemory,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
  });
  if (preferred === 'static') { element.dataset.quality = 'static'; visualReady('static'); return; }
  let controller;
  const finish = () => {
    controller?.dispose();
    window.removeEventListener('valinor:loader-finished', finish);
  };
  window.addEventListener('valinor:loader-finished', finish, { once: true });
  try {
    const { startCube, FIRST_TURN_END } = await import('./0ee6a15df8ec/cube.js');
    if (!pending()) return;
    controller = mountAdaptiveCube(element, startCube, preferred, {
      firstTurnEnd: FIRST_TURN_END, onVisualReady: visualReady,
      onSettled: () => window.dispatchEvent(new Event('valinor:cube-settled')),
      onProgress: value => window.dispatchEvent(new CustomEvent('valinor:visual-progress', { detail: value })),
    });
    if (!pending()) finish();
  } catch {
    element.dataset.quality = 'static';
    visualReady('static');
  } finally {
    if (!pending()) window.removeEventListener('valinor:loader-finished', finish);
  }
}

// Do not wait behind the application's deferred scripts to start the cube.
if (document.querySelector('[data-valinor-loader]')) {
  void start();
} else if (document.documentElement.getAttribute('data-initial-loading') === 'loading') {
  const stop = () => {
    observer.disconnect();
    window.removeEventListener('valinor:loader-finished', stop);
  };
  const observer = new MutationObserver(() => {
    if (document.querySelector('[data-valinor-loader]')) { stop(); void start(); }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('valinor:loader-finished', stop, { once: true });
}
