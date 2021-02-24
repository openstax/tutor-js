const RELOADED_FLAG = 'reloaded';

export function isReloaded({ windowImpl = window } = {}) {
    return -1 !== windowImpl.location.href.indexOf(RELOADED_FLAG);
}

export function reloadOnce({ windowImpl = window } = {}) {
    if (isReloaded({ windowImpl })) { return; }
    const join = windowImpl.location.href.indexOf('?') == -1 ? '?' : '&';
    windowImpl.history.pushState('', '', `${windowImpl.location.href}${join}${RELOADED_FLAG}`);
    forceReload({ windowImpl });
}

export function forceReload({ windowImpl = window } = {}) {
    windowImpl.location.reload(true); // true == no-cache
}
