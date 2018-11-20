// Store for api requests and responses
import _ from 'underscore';

import { makeSimpleStore } from './helpers';


const AppConfig = {
  resetServerErrors() {
    return delete this._currentServerError;
  },

  setServerError(errorResponse) {
    const { status, data } = errorResponse;
    this._currentServerError = errorResponse;
    return this.emit('server-error', status, data);
  },

  exports: {
    getError() { return this._currentServerError; },

    errorNavigation() {
      if (!this._currentServerError) { return {}; }
      const { status, request } = this._currentServerError;
      if (status === 403) {
        return { href: '/' };
      } else {
        const isGET404 = (status === 404) && (request.method === 'GET');
        const isInRange = 400 <= status && status < 600;
        return { shouldReload: false };
      }
    },
  },
};

const { actions, store } = makeSimpleStore(AppConfig);
export { actions as AppActions, store as AppStore };
