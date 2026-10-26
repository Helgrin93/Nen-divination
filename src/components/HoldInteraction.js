export const HOLD_MS = 4500;

export function mountHold({ button, progress, onStart, onReset, onComplete }) {
  let active = false, finished = false, frame = 0, startedAt = 0, pointerId = null, heldKey = null;
  const controller = new AbortController();
  const listen = (el, type, fn) => el.addEventListener(type, fn, { signal: controller.signal });
  function tick(now) {
    if (!active) return;
    const ratio = Math.min(1, (now - startedAt) / HOLD_MS);
    progress.style.setProperty('--progress', ratio);
    progress.setAttribute('aria-valuenow', Math.floor(ratio * 100));
    if (ratio >= 1) {
      active = false; finished = true;
      onComplete();
    } else frame = requestAnimationFrame(tick);
  }
  function start() {
    if (active || finished) return;
    active = true; startedAt = performance.now(); onStart();
    frame = requestAnimationFrame(tick);
  }
  function reset() {
    pointerId = null; heldKey = null;
    if (!active || finished) return;
    active = false; cancelAnimationFrame(frame);
    progress.style.setProperty('--progress', 0);
    progress.setAttribute('aria-valuenow', '0');
    onReset();
  }
  listen(button, 'pointerdown', e => {
    if (e.button !== 0 || !e.isPrimary || active) return;
    e.preventDefault(); button.focus({ preventScroll: true });
    pointerId = e.pointerId;
    try { button.setPointerCapture(pointerId); } catch { /* Global release is also monitored. */ }
    start();
  });
  const release = e => { if (e.pointerId === pointerId) reset(); };
  listen(window, 'pointerup', release);
  listen(window, 'pointercancel', release);
  listen(button, 'lostpointercapture', release);
  listen(button, 'contextmenu', e => e.preventDefault());
  listen(button, 'keydown', e => {
    if (![' ', 'Enter'].includes(e.key)) return;
    e.preventDefault();
    if (e.repeat || active) return;
    heldKey = e.key; start();
  });
  listen(window, 'keyup', e => { if (e.key === heldKey) { e.preventDefault(); reset(); } });
  listen(window, 'blur', reset);
  listen(document, 'visibilitychange', () => { if (document.hidden) reset(); });
  return () => { active = false; cancelAnimationFrame(frame); controller.abort(); };
}
