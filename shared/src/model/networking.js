import axios from 'axios';
import extend from 'lodash/extend';
import defaultsDeep from 'lodash/defaultsDeep';

let OPTIONS = {};

const emitError = function({ response }) {
  __guardMethod__(OPTIONS.handlers, 'onFail', o => o.onFail({ response }));
  return response;
};

const Networking = {
  setOptions(options) {
    return OPTIONS = options;
  },

  updateOptions(options) {
    return defaultsDeep(OPTIONS, options);
  },

  perform(opts) {
    return axios(extend({}, OPTIONS != null ? OPTIONS.xhr : undefined, opts)).catch(function(err) {
      if (!opts.silenceErrors) { emitError(err); }
      return err.response;
    });
  },
};

export default Networking;

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}