import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';


let URL = {};
const URL_SUFFIX = /_url$/;

const URLMethods = {
    update(urls) {
        return (() => {
            const result = [];
            for (let name in urls) {
                const url = urls[name];
                if (name.match(URL_SUFFIX) && isString(url)) {
                    result.push(URL[ name.replace(URL_SUFFIX, '') ] = url.replace(/\/$/, ''));
                }
            }
            return result;
        })();
    },

    get(url) {
        return URL[url];
    },

    construct(base, ...parts) {
        return `${this.get(base)}/${parts.join('/')}`;
    },

    hasApiHost(key) {
        return !isEmpty(URL[key]);
    },

    reset() { return URL = {}; },
};

export default URLMethods;
