const RELOADED_FLAG = 'reloaded';

export function isReloaded(win = window) {
  return -1 !== win.location.search.indexOf(RELOADED_FLAG);
}

export function reloadOnce(win = window) {
  if (isReloaded(win)) { return; }
  const join = win.location.href.indexOf('?') == -1 ? '?' : '&';
  win.history.pushState('', '', `${win.location.href}${join}${RELOADED_FLAG}`);
  forceReload(win);
}

export function forceReload(win = window) {
  win.location.reload(true); // true == no-cache
}
