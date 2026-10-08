// The wordmark is the progress indicator; the first settled turn completes it.
export const initialLoaderBootstrap = `(() => {
  try {
    if (sessionStorage.getItem('valinor:entered')) return;
    sessionStorage.setItem('valinor:entered', '1');
  } catch { /* The persistent root layout still prevents client-navigation replay. */ }
  const root = document.documentElement;
  root.setAttribute('data-initial-loading', 'loading');
  let visualStarted = null, pageReady = false, cubeSettled = false;
  let finished = false, cleaned = false, progress = 0, staticFrame = 0, exitTimer = 0;
  const advance = value => {
    if (finished || !Number.isFinite(value) || value < progress) return;
    progress = Math.max(0, Math.min(1, value));
    root.style.setProperty('--initial-loader-progress', String(progress));
  };
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    clearTimeout(exitTimer);
    window.removeEventListener('pagehide', finish);
    root.removeAttribute('data-initial-loading');
    root.style.removeProperty('--initial-loader-progress');
    window.dispatchEvent(new Event('valinor:loader-finished'));
  };
  const finish = event => {
    if (finished) { if (event && event.type === 'pagehide') cleanup(); return; }
    advance(1);
    finished = true;
    clearTimeout(deadline);
    clearTimeout(visualDeadline);
    cancelAnimationFrame(staticFrame);
    window.removeEventListener('valinor:visual-ready', visualReady);
    window.removeEventListener('valinor:visual-progress', visualProgress);
    window.removeEventListener('valinor:cube-settled', settled);
    window.removeEventListener('valinor:page-ready', ready);
    if (event && event.type === 'pagehide') { cleanup(); return; }
    // Ink is already fully white. Reveal immediately; keep the settled cube
    // intact through the fade and only release its WebGL resources afterward.
    root.setAttribute('data-initial-loading', 'leaving');
    exitTimer = setTimeout(cleanup, 160);
  };
  const check = () => { if (pageReady && cubeSettled) finish(); };
  const ready = () => { pageReady = true; check(); };
  const settled = () => { cubeSettled = true; check(); };
  const visualProgress = event => advance(Math.min(.98, Number(event.detail)));
  const staticTick = () => {
    const fraction = Math.min(1, (performance.now() - visualStarted) / 3000);
    advance(Math.min(.98, fraction));
    if (fraction >= 1) settled();
    else staticFrame = requestAnimationFrame(staticTick);
  };
  const visualReady = event => {
    if (finished) return;
    visualStarted ??= performance.now();
    clearTimeout(visualDeadline);
    if (!event || event.detail?.quality === 'static') {
      cancelAnimationFrame(staticFrame);
      staticFrame = requestAnimationFrame(staticTick);
    }
  };
  advance(0);
  const deadline = setTimeout(finish, 4500);
  const visualDeadline = setTimeout(() => visualReady(), 1300);
  window.addEventListener('valinor:visual-ready', visualReady);
  window.addEventListener('valinor:visual-progress', visualProgress);
  window.addEventListener('valinor:cube-settled', settled, { once: true });
  window.addEventListener('valinor:page-ready', ready, { once: true });
  window.addEventListener('pagehide', finish, { once: true });
})();`;
