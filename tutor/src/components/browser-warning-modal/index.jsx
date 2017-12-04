import React from 'react';
import { map, includes } from 'lodash';
import browser from 'detect-browser';

import CourseBranding from '../branding/course';
import WarningModal from '../warning-modal';

const EXCLUDED_BROWSERS = ['ie'];

const BROWSERS_AND_LINKS = [{
  name: 'Chrome',
  link: 'https://www.google.com/chrome/browser/desktop/index.html',
}, {
  name: 'Firefox',
  link: 'https://www.mozilla.org/en-US/firefox/new/',
}, {
  name: 'Safari',
  link: 'https://support.apple.com/en_GB/downloads/safari',
}, {
  name: 'Microsoft Edge',
  link: 'https://www.microsoft.com/en-us/windows/microsoft-edge',
}];

const isBrowserExcluded = () => ( includes(EXCLUDED_BROWSERS, browser.name) )

const getConnector = (browserIndex) => {
  let connector = ', ';

  if (browserIndex === BROWSERS_AND_LINKS.length - 2) {
    connector = ' or ';
  }

  if (browserIndex === BROWSERS_AND_LINKS.length - 1) {
    connector = '.';
  }

  return connector;
}

const BrowserWarning = (props) => {
  return (
    <WarningModal
      title="We're sorry, your browser isn't supported."
    >
      <p>
        You can't pay for <CourseBranding /> using this browser.
        We recommend using a recent version of 
        {map(BROWSERS_AND_LINKS, (browser, index) => {
          const connector = getConnector(index);

          return (
            <span> <a
                href={browser.link}
                target='_blank'
                key={`browser-${browser.name}-link`}
              >
                {browser.name}
              </a>
              {connector}
            </span>
          );
        })}
      </p>
      <p>
        Please launch Tutor in a new, supported browser.
      </p>
    </WarningModal>
  );
}

export {
  BrowserWarning as default,
  isBrowserExcluded
}
