// this file should contain only the minimal amount of code to boot up a react instance
import whenDomReady from 'when-dom-ready';
import React from 'react';
import ReactDOM from 'react-dom';
import { detect } from 'detect-browser';

function removeSplash() {
    const splash = document.querySelector('.boot-splash-screen');
    if (splash) { splash.parentNode.removeChild(splash); }
}

export default
async function renderRoot({ Component, props = {} }) {
    await whenDomReady();

    const rootEl = document.createElement('div');
    const browser = detect();
    if (browser) {
        rootEl.setAttribute('data-browser', browser.name);
        rootEl.setAttribute('data-browser-version', browser.version);
    }
    rootEl.setAttribute('role', 'main');
    rootEl.hidden = true;
    rootEl.id = 'ox-react-root-container';

    document.body.appendChild(rootEl);

    const performRender = (C) => {
        if (rootEl.hidden) { removeSplash(rootEl); }
        rootEl.hidden = false;
        ReactDOM.render(<C {...props} />, rootEl);
    };

    performRender(Component);

    return Promise.resolve(performRender);
}
