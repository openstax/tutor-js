import * as Sentry from '@sentry/browser';
import { first, isEmpty, isObject, each } from 'lodash';
import { isProd } from '../../helpers/production';

const isMathJaxUrl = /mathjax/;

const isMathjax = (crumb) => ('xhr' === crumb.category && isMathJaxUrl.test(crumb.data.url));
const IGNORED = /ResizeObserver|ChunkLoadError|button after page initialization/

const sendWithXtras = (method, arg, xtra) => {
  if (isEmpty(xtra)) {
    Sentry[method](arg);
  } else {
    Sentry.withScope((scope) => {
      if (isObject(xtra)) {
        each(xtra, (value, key) => {
          scope.setExtra(key, value);
        });
      } else {
        scope.setExtra('info', xtra);
      }
      Sentry[method](arg);
    });
  }
};

const RavenErrorLogging = {

  boot() {
    if (!isProd) { return; }
    Sentry.init({
      debug: false,
      dsn: 'https://c591c5c17b6f46c1b0656a10e0b8adfa@o484761.ingest.sentry.io/5538479',
      environment: first(window.location.host.split('.')),
      beforeBreadcrumb(breadcrumb) {
        if (isMathjax(breadcrumb)) { return null; }
        return breadcrumb;
      },
      beforeSend(event, hint){
        const error = hint.originalException;
        if (error?.message?.match(IGNORED)) {
          return null
        }
        return event
      },
    });
  },

  setUser(user) {
    Sentry.configureScope(scope => {
      scope.setUser({ id: user.account_uuid });
    });
  },

  captureException(error, xtra) {
    if (!isProd) {
      console.warn(error); // eslint-disable-line no-console
    }
    sendWithXtras('captureException', error, xtra);
  },

  log(msg, xtra) {
    sendWithXtras('captureMessage', msg, xtra);
  },

};


export default RavenErrorLogging;
