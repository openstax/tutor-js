import interpolate from 'interpolate';
import { action as mobxAction } from 'mobx';
import { METHODS_TO_ACTIONS } from './collections';
import qs from 'qs';
import {
    partial, map, mapValues, reject, pick, merge, first,
    wrap, invert, partition, defaults, isEmpty,
    clone, isFunction, isObjectLike, reduce,
} from 'lodash';

const makeRequestHandlers = function(Actions, options) {
    let { onSuccess, onFail } = options;
    if (onFail == null) { onFail = 'FAILED'; }

    const handlers = {
        onSuccess(response, ...args) {
            Actions[onSuccess](response.data, ...Array.from(args));
            return response;
        },
    };

    if (options.handleError != null) {
        handlers.onFail = function(error, ...args) {
            const { response } = error;
            const isErrorHandled = options.handleError(response, ...Array.from(args));

            if (!isErrorHandled) { return Promise.reject(error); }
            return null;
        };
    }

    if (options.errorHandlers != null) {
        handlers.onFail = function(error, ...args) {
            const { response } = error;
            const { errors } = response.data;

            const unhandledErrors = reject(errors, function(error) {
                if (options.errorHandlers[error.code] != null) {
                    return (typeof Actions[options.errorHandlers[error.code]] === 'function' ? Actions[options.errorHandlers[error.code]](...Array.from(args), error) : undefined);
                }
                return null;
            });

            if (!isEmpty(unhandledErrors)) {
                error.response.data.errors = unhandledErrors;
                return Promise.reject(error);
            }
            return null;
        };
    }

    if (handlers.onFail == null) { handlers.onFail = function(error, ...args) {
        const { response } = error;
        const { status, statusMessage } = response;

        Actions[onFail](status, statusMessage, ...Array.from(args));
        return Promise.reject(error);
    }; }

    return handlers;
};

const resolveOptions = (...args) =>
    function(option, key) {
        if (isFunction(option) && (key !== 'handleError')) {
            return option(...Array.from(args || []));
        } else {
            return option;
        }
    }
;

const resolveAndMergeHandlerOptions = function(options, makeRequestOptions, ...args) {
    const resolvedAndMergedOptions = mapValues(options, resolveOptions(...Array.from(args || [])));
    const additionalRequestOptions = map(makeRequestOptions, resolveOptions(...Array.from(args || [])));
    merge(resolvedAndMergedOptions, ...Array.from(additionalRequestOptions));
    return resolvedAndMergedOptions;
};

// convenient aliases
const makeIdRouteData = function(data) {
    if (isObjectLike(data)) {
        return data;
    } else {
        return { id: data };
    }
};

const ACTIONS = {
    create: {
        trigger: 'create',
        onSuccess: 'created',
    },

    read: {
        trigger: 'load',
        onSuccess: 'loaded',
    },

    update: {
        trigger: 'save',
        onSuccess: 'saved',
    },

    'delete': {
        trigger: 'delete',
        onSuccess: 'deleted',
    },
};

const METHODS = invert(METHODS_TO_ACTIONS);

const connectHandler = function(apiHandler, Actions, ...allOptions) {
    const [objectOptions, makeRequestOptions] = Array.from(partition(allOptions, isObjectLike));
    const options = merge({}, ...Array.from(objectOptions));
    const { trigger } = options;

    return Actions[trigger].addListener('trigger', function(...args) {
        const request = resolveAndMergeHandlerOptions(options, makeRequestOptions, ...Array.from(args));

        const handlers = makeRequestHandlers(Actions, options);

        const requestConfig = pick(request, 'url', 'method', 'data', 'params', 'handledErrors');
        if (requestConfig.url == null) { requestConfig.url = interpolate(options.pattern, options.route || makeIdRouteData(...Array.from(args || []))); }

        const requestOptions = merge(pick(request, 'delay'), handlers);

        return apiHandler.send(requestConfig, requestOptions, ...Array.from(args));
    });
};

const connectAction = function(action, apiHandler, Actions, ...allOptions) {
    const actionOptions = merge({ method: METHODS[action] }, ACTIONS[action] || {});
    return connectHandler(apiHandler, Actions, actionOptions, ...Array.from(allOptions));
};

const emptyFn = () => ({});

const connectModelAction = function(action, apiHandler, klass, method, options) {
    defaults(options, { method: METHODS[action] });
    const handler = function(originalMethod, ...reqArgs) {
        const firstArg = first(reqArgs);
        let requestConfig = mapValues(
            pick(options,
                'interceptors', 'pattern', 'url', 'query',
                'method', 'data', 'params', 'handledErrors', 'timeout'
            ), (val) => {
                return isFunction(val) ? val.call(this, ...Array.from(reqArgs)) : val;
            });
        const updatedConfig = originalMethod.call(this, ...Array.from(reqArgs), requestConfig);

        if (updatedConfig === 'ABORT') { return null; }
        merge(requestConfig, updatedConfig);
        if (options.interceptors) {
            requestConfig = reduce(
                options.interceptors,
                (config, interceptor) => interceptor.call(this, config),
                requestConfig,
            );
        }
        if (requestConfig.pattern) {
            if (requestConfig.url == null) { requestConfig.url = interpolate(requestConfig.pattern, defaults({}, firstArg, requestConfig, this)); }
        }
        let { query } = requestConfig;
        if (query) {
            if (isObjectLike(requestConfig.query)) { query = qs.stringify(query, { arrayFormat: 'brackets', encode: false }); }
            requestConfig.url += `?${query}`;
        }

        const perRequestOptions = clone(options);

        ['onSuccess', 'onFail'].forEach((option) => {
            perRequestOptions[option] = mobxAction(option, (resp) => {
                const handler = (options[option] && this[options[option]]) ||
          apiHandler.getOptions().handlers[option];

                handler.call(this, resp, reqArgs, requestConfig);
                if (this.api) {
                    this.api.requestCounts[action] += 1;
                    this.api.requestsInProgress.delete(action);
                }
            });
        });

        if (this.api) {
            this.api.requestsInProgress.set(action, requestConfig);
        }

        return apiHandler.send(requestConfig, perRequestOptions, firstArg);
    };

    return klass.prototype[method] = wrap(klass.prototype[method] || emptyFn, handler);
};


const adaptHandler = apiHandler => ({
    connectHandler: partial(connectHandler, apiHandler),
    connectCreate:  partial(connectAction, 'create', apiHandler),
    connectRead:    partial(connectAction, 'read', apiHandler),
    connectUpdate:  partial(connectAction, 'update', apiHandler),
    connectDelete:  partial(connectAction, 'delete', apiHandler),
    connectModelCreate: partial(connectModelAction, 'create', apiHandler),
    connectModelRead:   partial(connectModelAction, 'read', apiHandler),
    connectModelUpdate: partial(connectModelAction, 'update', apiHandler),
    connectModelDelete: partial(connectModelAction, 'delete', apiHandler),
})
;

export default adaptHandler;
