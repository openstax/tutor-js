import * as Sentry from '@sentry/browser';
import { first, isEmpty, isObject, each } from 'lodash';
const isProd = (process.env.NODE_ENV === 'production');

const isMathJaxUrl = /mathjax/;

const isMathjax = (crumb) => ('xhr' === crumb.category && isMathJaxUrl.test(crumb.data.url));

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
      dsn: 'https://10044345c10446119e980e2ba2f5fe14@sentry.cnx.org/10',
      environment: first(window.location.host.split('.')),
      beforeBreadcrumb(breadcrumb) {
        if (isMathjax(breadcrumb)) { return null; }
        return breadcrumb;
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
