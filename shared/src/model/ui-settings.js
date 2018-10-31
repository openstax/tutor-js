import { debounce, isNil, isObject } from 'lodash';
import { toJS, observable } from 'mobx';
import Map from './map';
import URLs from './urls';
import Networking from './networking';

const SETTINGS = new Map();

const saveSettings = debounce( () =>
  Networking.perform({
    method: 'PUT',
    url: URLs.construct('tutor_api', 'user', 'ui_settings'),
    withCredentials: true,

    data: {
      ui_settings: SETTINGS.toJS(),
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
  _dump() { return SETTINGS.toJS(); },
};

export default UiSettings;
