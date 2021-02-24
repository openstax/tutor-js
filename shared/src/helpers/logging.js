import loglevel from 'loglevel';
import { defaults, last, isObject, debounce } from 'lodash';
import Networking from '../model/networking';
import URLs from '../model/urls';

let PENDING = [];
const LOG_TO = 'tutor_api';

const DEFAULT_OPTIONS = {
    warn: {
        persist: true,
    },

    error: {
        persist: true,
    },
};

const Logger = {
    levels: ['trace', 'debug', 'info', 'warn', 'error'],

    clearPending() {
        return PENDING = [];
    },
};

const transmitPending = debounce(function() {
    if (!URLs.hasApiHost(LOG_TO)) { return; }
    Networking.perform({
        method: 'POST',
        url: URLs.construct(LOG_TO, 'log', 'entry'),
        data: { entries: PENDING },
    });
    PENDING = [];
}
, 300);

const loggerFactory = level =>
    function(msg, ...args) {
        let options = isObject(last(args)) ? args.pop() : {};
        loglevel[level](msg, ...Array.from(args));
        options = defaults(options, DEFAULT_OPTIONS[level]);
        if (options.persist) {
            PENDING.push({ location: window.location.href, message: msg, level });
            transmitPending();
        }
        return msg;
    }
;

for (let level of Logger.levels) {
    Logger[level] = loggerFactory(level);
}

export default Logger;
