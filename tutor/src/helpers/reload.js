export function isReloaded() {
  return -1 !== window.location.search.indexOf('reloaded');
}

export function reloadOnce() {
  if (!isReloaded()) {
    const join = window.location.search ? '&' : '?';
    window.location.search = `${window.location.search}${join}reloaded`;
  }
}

export function forceReload() {
  window.location.reload(true);
}
