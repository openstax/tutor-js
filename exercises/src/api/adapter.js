import { get, merge } from 'lodash';
import { APIHandler } from 'shared';
import { APIActionAdapter } from 'shared';

import Errors from '../models/errors';
const CSRF_Token = get(document.head.querySelector('meta[name=csrf-token]'), 'content');

const IS_LOCAL = (window.location.port === '8001') || window.__karma__;

const OPTIONS = {
  xhr: {
    baseURL: `${window.location.origin}/api`,
    headers: {
      'X-CSRF-Token': CSRF_Token,
    },
  },
  handlers: {
    onFail(error) {
      const { response } = error;
      const { status, data, config } = response;
      const opts = config;

      return Errors.setServerError(status, data, { url: (config != null ? config.url : undefined), opts });
    },
  },
  isLocal: IS_LOCAL,
};

const exerciseAPIHandler = new APIHandler(OPTIONS);

export default merge({ handler: exerciseAPIHandler }, APIActionAdapter(exerciseAPIHandler));
