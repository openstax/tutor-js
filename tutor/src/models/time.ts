import { now as getNow } from 'mobx-utils';
import { isDate } from 'lodash';

let shiftMs = 0;
const defaultResolution = 1000 * 60; // one minute resolution
let timeResolution = defaultResolution;

const WRM_START_DATE = new Date('2020-06-18');

export { WRM_START_DATE };

export function setNow(now) {
    if (!isDate(now)) {
        now = now ? new Date(now) : new Date();
    }
    shiftMs = now.getTime() - (new Date()).getTime();
}

export function setResolution(r = defaultResolution) {
    timeResolution = r;
}

const Store = {

    DATE_FORMAT: 'MM/DD/YYYY',

    get now() {
        const now = getNow(timeResolution);
        return new Date(now + shiftMs);
    },

};

export default Store;
