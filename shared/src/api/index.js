import axios from 'axios';
import {
    isEmpty, pick, omit, merge, delay, spread, each, defaultsDeep,
} from 'lodash';
import interpolate from 'interpolate';

import extractValues from 'extract-values';
import EventEmitter2 from 'eventemitter2';
import Networking from '../model/networking';
import { Routes, XHRRecords, METHODS_TO_ACTIONS } from './collections';
import { Interceptors } from './interceptors';

const API_DEFAULTS = {
    request: {
        delay: 0,
    },

    xhr: {
        dataType: 'json',
    },

    eventOptions: {
        pattern: '{subject}.{topic}.{action}',
        send: 'send',
        receive: 'receive.{status}',

        statuses: {
            success: 'success',
            failure: 'failure',
        },
    },

    events: [],

    handlers: {
        onSuccess(response) {
            return response;
        },

        onFail(response) {
            return Promise.reject(response);
        },
    },

    isLocal: false,
    errorNameProperty: 'code',
};

const setUpXHRInterceptors = function(xhrInstance, interceptors, isLocal) {
    // tell app that a request is pending.
    xhrInstance.interceptors.request.use(interceptors.queRequest);

    // modify request to use local stubs
    if (isLocal) { xhrInstance.interceptors.request.use(interceptors.makeLocalRequest); }

    // modify response when using the local api stubs.
    if (isLocal) { xhrInstance.interceptors.response.use(interceptors.makeLocalResponse, interceptors.handleLocalErrors); }

    // make sure app knows a response has been returned for a pending request,
    // for both successes and errors
    xhrInstance.interceptors.response.use(interceptors.setResponseReceived, interceptors.setErrorReceived);

    // broadcast response status
    xhrInstance.interceptors.response.use(interceptors.broadcastSuccess, interceptors.broadcastError);

    // on response, transform error as needed
    xhrInstance.interceptors.response.use(null, interceptors.handleNonAPIErrors);
    xhrInstance.interceptors.response.use(null, interceptors.handleMalformedRequest);
    xhrInstance.interceptors.response.use(null, interceptors.handleNotFound);
    xhrInstance.interceptors.response.use(null, interceptors.handleErrorMessage);

    return xhrInstance.interceptors.response.use(null, interceptors.filterErrors);
};

const makeRequestConfig = function(routeOptions, routeData, requestData) {
    const { pattern } = routeOptions;

    const requestConfig = omit(routeOptions, 'subject', 'topic', 'pattern', 'action', 'delay', 'onSuccess', 'onFail');
    requestConfig.url = interpolate(pattern, routeData);

    if (!isEmpty(requestData)) {
        if (requestData.data || requestData.params) {
            merge(requestConfig, pick(requestData, 'data', 'params'));
        } else {
            requestConfig.data = requestData;
        }
    }

    return requestConfig;
};

const guessInfoFromConfig = function(requestConfig) {
    const uriParts = requestConfig.url.split('/');

    const subject = requestConfig.url;
    const topic = uriParts[1] || 'topic';
    const action = METHODS_TO_ACTIONS[requestConfig.method];

    return { subject, topic, action };
};

const DEFAULT_SUCCESS = response => response;
const DEFAULT_FAIL = response => Promise.reject(response);

const ALL_EVENTS = {
    subject: '*',
    topic: '*',
    action: '*',
};


class APIHandlerBase {
    constructor(options) {
        this.destroy = this.destroy.bind(this);
        this.initializeRecords = this.initializeRecords.bind(this);
        this.initializeXHR = this.initializeXHR.bind(this);
        this.updateXHR = this.updateXHR.bind(this);
        this.initializeEventOptions = this.initializeEventOptions.bind(this);
        this.setOptions = this.setOptions.bind(this);
        this.setOptions(options);

        this.initializeRecords();
        this.initializeEventOptions(this.getOptions().eventOptions);
        this.initializeXHR(this.getOptions().xhr, new Interceptors(this.getOptions().hooks, this), this.getOptions().isLocal);
    }

    destroy() {
        return this.channel.removeAllListeners();
    }

    initializeRecords() {
        return this.records = new XHRRecords();
    }

    initializeXHR(xhrOptions, interceptors, isLocal) {
        const xhr = axios.create(xhrOptions);
        setUpXHRInterceptors(xhr, interceptors, isLocal);

        return this._xhr = xhr;
    }

    updateXHR(xhrOptions) {
        Networking.updateOptions({ xhr: xhrOptions });
        return defaultsDeep(this._xhr.defaults, xhrOptions);
    }

    initializeEventOptions(eventOptions) {
        const { pattern, send, receive, statuses } = eventOptions;

        // {subject}.{topic}.{action}.send||(receive.(failure||success))
        const patterns = {
            base: pattern,
            send: [pattern, send].join('.'),
            receive: [pattern, receive].join('.'),
        };

        this._patterns = patterns;
        return this._statuses = statuses;
    }

    setOptions(options) {
        const previousOptions = (typeof this.getOptions === 'function' ? this.getOptions() : undefined) || {};
        options = merge({}, API_DEFAULTS, previousOptions, options);
        Networking.setOptions(options);

        return this.getOptions = () => options;
    }

    // send can now be used separately without initializing routes
    send(requestConfig, routeOptions, ...args) {
        let requestInfo = pick(routeOptions, 'subject', 'topic', 'action');
        if (isEmpty(requestInfo)) { requestInfo = guessInfoFromConfig(requestConfig); }

        requestConfig.events = {
            success: interpolate(this._patterns.receive, merge({ status: this._statuses.success }, requestInfo)),
            failure: interpolate(this._patterns.receive, merge({ status: this._statuses.failure }, requestInfo)),
        };

        const requestDelay = routeOptions.delay || this.getOptions().request.delay;
        const { handlers } = this.getOptions();
        let { onSuccess, onFail } = routeOptions;

        if (onSuccess == null) { onSuccess = DEFAULT_SUCCESS; }
        if (onFail == null) { onFail = DEFAULT_FAIL; }

        const onSuccessHandler = (fn, args) =>
            function(resp) {
                fn(resp, ...Array.from(args));
                return Promise.resolve(resp);
            }
    ;
        const onFailHandler = (fn, args) =>
            function(resp) {
                fn(resp, ...Array.from(args));
                return Promise.reject(resp);
            }
    ;

        return new Promise((resolve, reject) => {

            return delay(() => {
                return this._xhr.request(requestConfig)
                    .then(onSuccessHandler(onSuccess, args), onFailHandler(onFail, args))
                    .then(onSuccessHandler(handlers.onSuccess, args), onFailHandler(handlers.onFail, args))
                    .then(resolve, reject);
            }, requestDelay);
        });
    }
}


class APIHandler extends APIHandlerBase {
    constructor(options, routes = [], channel) {
        super(options, channel);
        this.initializeRoutes = this.initializeRoutes.bind(this);
        this.setUpReceivers = this.setUpReceivers.bind(this);
        this.initializeEvents = this.initializeEvents.bind(this);
        this.sendRequest = this.sendRequest.bind(this);

        if (!isEmpty(routes)) { this.initializeRoutes(routes); }
        this.setUpReceivers(this.getOptions().events);
        this.initializeEvents(this.getOptions().events, routes.length, channel);
    }

    initializeRoutes(routes) {
        return this.routes = new Routes(routes);
    }

    setUpReceivers(events) {
        const { sendRequest } = this;
        const patterns = this._patterns;

        const handleSend = function(...args) {
            const requestInfo = extractValues(this.event, patterns.send);
            return sendRequest(requestInfo, ...Array.from(args));
        };

        return events.push([interpolate(patterns.send, ALL_EVENTS), handleSend]);
    }

    initializeEvents(events, numberOfRoutes, channel) {
        this.channel = channel || new EventEmitter2({ wildcard: true, maxListeners: numberOfRoutes * 2 });
        each(events, spread(this.channel.on.bind(this.channel)));
    }

    sendRequest(requestInfo, routeData, requestData, ...args) {
        const routeOptions = this.routes.get(requestInfo);
        // TODO throw error somewheres.
        if (routeOptions == null) { return null; }

        const requestConfig = makeRequestConfig(routeOptions, routeData, requestData);
        requestConfig.topic = requestInfo.topic;

        merge(routeOptions, pick(requestInfo, 'subject', 'topic', 'action'));

        return this.send(requestConfig, routeOptions, ...Array.from(args));
    }
}

// include and export cascading error handler for convenience/custom error handling.

export { APIHandler, APIHandlerBase };
