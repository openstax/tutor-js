import Raven from 'raven-js';
import { first } from 'lodash';
const isProd = (process.env.NODE_ENV === 'production');

const isMathJaxUrl = /mathjax/;

const isMathjax = (crumb) => ('xhr' === crumb.category && isMathJaxUrl.test(crumb.data.url));

const RavenErrorLogging = {

  boot() {
    if (!isProd) { return; }
    Raven.config('https://10044345c10446119e980e2ba2f5fe14@sentry.cnx.org/10', {
      tags: {
        environment: first(window.location.host.split('.')),
      },
      breadcrumbCallback(crumb) {
        if (isMathjax(crumb)) { return false; }
        return crumb;
      },
    }).install();
  },

  setUser(user) {
    Raven.setUserContext({
      id: user.account_uuid,
    });
  },

  captureException(error, xtra) {
    if (!isProd) {
      console.warn(error); // eslint-disable-line no-console
    }
    Raven.captureException(error, xtra);
  },

};


export default RavenErrorLogging;
