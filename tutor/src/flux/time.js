// Store for getting the current server time.
// Defaults to browser time if a server request has not been made yet.

import { setNow } from '../models/time';

import flux from 'flux-react';

import { makeSimpleStore } from './helpers';

const TutorDateFormat = 'MM/DD/YYYY';

const TimeConfig = {
  reset() {
    return this._shiftMs = 0;
  },

  setNow(now, localNow = new Date()) {
    setNow(now, localNow); // also notify the mobx store
    // # called by API
    return this._shiftMs = now.getTime() - localNow.getTime();
  },

  setFromString(txtDate, localNow = new Date()) {
    if (!txtDate) { return; }
    const date = new Date(txtDate);
    if (isNaN(date.getTime())) { // "Invalid Date"
      return __guardMethod__(console, 'warn', o => o.warn(`Attempted to set invalid date ${txtDate} on TimeStore`));
    } else {
      return this.setNow(date, localNow);
    }
  },

  exports: {
    getNow(localNow = new Date()) {
      const shift = this._shiftMs || 0;
      return new Date(localNow.getTime() + shift);
    },

    getFormat() { return TutorDateFormat; },
  },
};

const { actions, store } = makeSimpleStore(TimeConfig);
export { actions as TimeActions, store as TimeStore };

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}