import get from 'lodash/get';
import setWith from 'lodash/setWith';
import debounce from 'lodash/debounce';
import includes from 'lodash/includes';
import assign from 'lodash/assign';
import isObject from 'lodash/isObject';
import isNil from 'lodash/isNil';
import cloneDeep from 'lodash/cloneDeep';
import mobx from 'mobx';
import URLs from './urls';
import Networking from './networking';
import { toJS, observable } from 'mobx';

const SETTINGS = mobx.observable.map();

const saveSettings = debounce( () =>
  Networking.perform({
    method: 'PUT',
    url: URLs.construct('tutor_api', 'user', 'ui_settings'),
    withCredentials: true,

    data: {
      ui_settings: mobx.toJS(SETTINGS),
    },
  })

  , 500);

const UiSettings = {
  initialize(settings) {
    return SETTINGS.replace(observable.object(settings));
  },

  get(key, id) {
    const obj = SETTINGS.get(key);
    if (!isNil(id) && isObject(obj)) { return obj[id]; } else { return obj; }
  },

  set(key, id, value) {
    if (isObject(key)) {
      SETTINGS.merge(key);
    } else {
      if (isNil(value)) {
        SETTINGS.set(key, id);
      } else {
        let obj = SETTINGS.get(key) || {};
        if (!isObject(obj)) { obj = {}; }
        obj[id] = value;
        SETTINGS.set(key, observable(toJS(obj)));
      }
    }
    return saveSettings();
  },

  // for use by specs to reset
  _reset() {
    return SETTINGS.clear();
  },

  // for debugging purposes
  _dump() { return mobx.toJS(SETTINGS); },
};

export default UiSettings;
