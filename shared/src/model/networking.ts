import axios from 'axios';
import extend from 'lodash/extend';
import defaultsDeep from 'lodash/defaultsDeep';

let OPTIONS = {};

const emitError = function({ response }) {
    OPTIONS.handlers.onFail && OPTIONS.handlers.onFail({ response });
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
        return axios(extend({}, OPTIONS != null ? OPTIONS.xhr : undefined, opts))
            .catch(function(err) {
                if (!opts.silenceErrors) { emitError(err); }
                if (opts.onError) { opts.onError(err); }
                return err.response;
            });
    },
};

export default Networking;
