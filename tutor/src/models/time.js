import { computed, decorate } from 'mobx';
import { now as getNow } from 'mobx-utils';

let shiftMs = 0;
const defaultResolution = 1000 * 60; // one minute resolution
let timeResolution = defaultResolution;

export function setNow(now) {
  shiftMs = now.getTime() - (new Date()).getTime();
}

export function setResolution(r = defaultResolution) {
  timeResolution = r;
}

const Store = {

  get now() {
    const now = getNow(timeResolution);
    return new Date(now + shiftMs);
  },

};

decorate(Store, {
  now: computed,
});

export default Store;
