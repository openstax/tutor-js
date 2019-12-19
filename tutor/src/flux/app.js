// Store for api requests and responses
// NS: not sure if this is used
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
      const { status } = this._currentServerError;
      if (status === 403) {
        return { href: '/' };
      } else {
        return { shouldReload: false };
      }
    },
  },
};

const { actions, store } = makeSimpleStore(AppConfig);
export { actions as AppActions, store as AppStore };
