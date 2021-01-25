import { get, merge } from 'lodash';
import { APIHandler } from 'shared';
import { APIActionAdapter } from 'shared';
import { observe } from 'mobx';
import { setNow } from '../models/time';
import { AppActions } from '../flux/app';
import User from '../models/user';
import Courses from '../models/courses';

let tutorAPIHandler = null;
const baseUrl =
  process.env.BACKEND_SERVER_URL ?
    process.env.BACKEND_SERVER_URL
    : window.location.port === '8000' ?
      'http://localhost:3001/api'
      :
      `${window.location.origin}/api`;

const storeAppDateHeader = function(headers) {
  // axios will lower case headers https://github.com/axios/axios/issues/413
  const date = headers['x-app-date'] || headers['date'];
  return setNow(date);
};

const updateHeadersWithToken = token =>
  tutorAPIHandler != null ? tutorAPIHandler.updateXHR({
    headers: {
      'X-CSRF-Token': token,
      token,
    },
  }) : undefined
;

const OPTIONS = {
  xhr: {
    baseURL: baseUrl,

    headers: {
      'X-CSRF-Token': User.csrf_token,
      token: User.csrf_token,
    },
  },

  events: [['set.tokens', updateHeadersWithToken]],

  handlers: {
    onFail(error) {
      const { response } = error;
      if (!(error != null ? error.isRecorded : undefined)) {
        AppActions.setServerError(response || error);
      }
    },
  },

  hooks: {
    handleMalformedRequest() { // at one time this logged out the user, but that seems too drastic
      return null;
    },
  },

  isLocal: false,
};

tutorAPIHandler = new APIHandler(OPTIONS);
tutorAPIHandler.channel.on('*.*.*.receive.*', function(response = {}) {
  const headers = get(response, 'headers') || get(response, 'response.headers');
  if (headers) {
    storeAppDateHeader(headers);
  }
});

observe(User, 'csrf_token', function(change) {
  if (change.newValue) {
    tutorAPIHandler.channel.emit('set.tokens', change.newValue);
  }
});

const setRole = (config) => {
  if (config.courseId) {
    const course = Courses.get(config.courseId);
    if (course && course.current_role_id) {
      config.query = (config.query || {});
      config.query.role_id = course.current_role_id;
    }
  }
  return config;
};

const addInterceptors = (name, fn) => {
  return (klass, method, options = {}) => {
    options.interceptors = (options.interceptors || []);
    options.interceptors.push(setRole);
    return fn(klass, method, options);
  };
};

const adapters = APIActionAdapter(tutorAPIHandler);
[
  'connectModelCreate',
  'connectModelDelete',
  'connectModelRead',
  'connectModelUpdate',
].forEach((handler) => {
  adapters[handler] = addInterceptors(handler, adapters[handler]);
});

export default merge({ handler: tutorAPIHandler }, adapters);
