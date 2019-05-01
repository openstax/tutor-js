import * as Sentry from '@sentry/browser';
import { first } from 'lodash';
const isProd = (process.env.NODE_ENV === 'production');

const isMathJaxUrl = /mathjax/;

const isMathjax = (crumb) => ('xhr' === crumb.category && isMathJaxUrl.test(crumb.data.url));

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
    Sentry.captureException(error, xtra);
  },

  log(msg) {
    if (!isProd) { console.info(msg); } // eslint-disable-line no-console
    Sentry.captureMessage(msg);
  },

};


export default RavenErrorLogging;
