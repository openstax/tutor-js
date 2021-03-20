import { pick, defaultsDeep } from 'lodash'

let OPTIONS:any = {};

const emitError = function({ response }: any) {
    OPTIONS.handlers.onFail && OPTIONS.handlers.onFail({ response });
    return response;
};

const Networking = {
    setOptions(options:any) {
        return OPTIONS = options;
    },

    updateOptions(options:any) {
        return defaultsDeep(OPTIONS, options);
    },

    perform(opts: any) {
        const req = pick(opts, 'method') as any
        if (opts.data) {
            req.data = JSON.stringify(opts.data)
        }
        return fetch(opts.url, req)
            .catch((err) => {
                if (!opts.silenceErrors) { emitError(err); }
                if (opts.onError) { opts.onError(err); }
                return err.response;
            })
    },

};

export default Networking;
