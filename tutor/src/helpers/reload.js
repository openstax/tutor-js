const RELOADED_FLAG = 'reloaded';

export function isReloaded() {
  return -1 !== window.location.search.indexOf(RELOADED_FLAG);
}

export function reloadOnce() {
  if (isReloaded()) { return; }
  const join = window.location.href.indexOf('?') == -1 ? '?' : '&';
  window.history.pushState('', '', `${window.location.href}${join}${RELOADED_FLAG}`);
  forceReload();
}

export function forceReload() {
  window.location.reload(true); // true == no-cache
}
