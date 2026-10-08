// Capability hints only select the first attempt. Actual startup and frame timing
// determine whether it stays on the high tier; unknown hardware is allowed a try.
export function preferredQuality({ reduced = false, saveData = false, cores, memory, effectiveType, downlink } = {}) {
  if (reduced || saveData) return 'static';
  if ((cores && cores < 4) || (memory && memory < 4) ||
      ['slow-2g', '2g', '3g'].includes(effectiveType) || (downlink && downlink < 2)) return 'light';
  return 'high';
}

export function mountAdaptiveCube(element, startCube, preferred, { onVisualReady = () => {}, onSettled = () => {}, onProgress = () => {}, firstTurnEnd } = {}) {
  let stopped = false, generation = 0, controller, abort, timer;
  let firstFrameAt = null, announced = false;
  const announce = quality => { if (!announced) { announced = true; onVisualReady(quality); } };
  const release = () => { clearTimeout(timer); abort?.abort(); controller?.dispose(); controller = undefined; };
  const launch = async quality => {
    const version = ++generation;
    release();
    if (stopped) return;
    element.dataset.live = 'false';
    element.dataset.quality = quality;
    if (quality === 'static') { onVisualReady('static'); return; }
    abort = new AbortController();
    const signal = abort.signal;
    const old = element.querySelector('canvas');
    const canvas = old.cloneNode(false);
    // A lost WebGL context is not reused by the next tier.
    old.replaceWith(canvas);
    const fallback = () => {
      if (stopped || version !== generation || signal.aborted) return;
      void launch(quality === 'high' ? 'light' : 'static');
    };
    timer = setTimeout(fallback, quality === 'high' ? 550 : 700);
    try {
      const candidate = await startCube(canvas, {
        quality, signal, playbackRate: (firstTurnEnd - 3) / 3,
        timeOffset: 3 + (firstFrameAt === null ? 0 : (performance.now() - firstFrameAt) / 1000 * (firstTurnEnd - 3) / 3),
        settleAfterFirstTurn: true,
        onSettled() { if (!stopped && version === generation) onSettled(); },
        onProgress(value) { if (!stopped && version === generation) onProgress(value); },
        onReady() {
          if (stopped || version !== generation || signal.aborted) return;
          clearTimeout(timer);
          firstFrameAt ??= performance.now();
          element.dataset.live = 'true';
          element.dataset.quality = quality;
          announce(quality);
        },
        onError: fallback,
        onSlow: fallback,
      });
      if (stopped || version !== generation) candidate.dispose();
      else controller = candidate;
    } catch { fallback(); }
  };
  void launch(preferred);
  return { dispose() { if (stopped) return; stopped = true; generation++; release(); } };
}
