import minimatch from 'minimatch';

import {
    partial, merge, extend, includes, some,
    set, every, isError, isEmpty, propertyOf, isObjectLike,
} from 'lodash';

const makeLocalRequest = function(requestConfig) {
    let { url } = requestConfig;

    const [uri, params] = Array.from(url.split('?'));
    if (requestConfig.method === 'GET') {
        url = `${uri}.json`;
    } else {
        url = `${uri}/${requestConfig.method}.json`;
        requestConfig.mockMethod = requestConfig.method;
        requestConfig.method = 'GET';
    }

    merge(requestConfig, { url, params });
    return requestConfig;
};

const makeLocalResponse = function(response) {
    const payload = response.config.data ? JSON.parse(response.config.data) : {};
    return response.data = extend({}, response.data, payload);
};

const doesErrorMatch = (handledErrors, errorName) =>
    includes(handledErrors, errorName) ||
    some(handledErrors, partial(minimatch, errorName))
;

const areAllErrorsHandled = function(handledErrors, errors, errorNameProperty) {

    // use set and propertyOf for flexible errorNameProperty -- i.e. can be nested
    if (errors == null) { errors = [set({}, errorNameProperty, 'HTTP_ERROR')]; }

    return every(errors, function(error) {
        const errorName = propertyOf(error)(errorNameProperty);
        return doesErrorMatch(handledErrors, errorName);
    });
};


class Interceptors {
    constructor(hooks = {}, apiHandler) {
        this.queRequest = this.queRequest.bind(this);
        this.makeLocalRequest = this.makeLocalRequest.bind(this);
        this.setResponseReceived = this.setResponseReceived.bind(this);
        this.setErrorReceived = this.setErrorReceived.bind(this);
        this.broadcastSuccess = this.broadcastSuccess.bind(this);
        this.broadcastError = this.broadcastError.bind(this);
        this.makeLocalResponse = this.makeLocalResponse.bind(this);
        this.handleNonAPIErrors = this.handleNonAPIErrors.bind(this);
        this.handleLocalErrors = this.handleLocalErrors.bind(this);
        this.handleMalformedRequest = this.handleMalformedRequest.bind(this);
        this.handleNotFound = this.handleNotFound.bind(this);
        this.handleErrorMessage = this.handleErrorMessage.bind(this);
        this.filterErrors = this.filterErrors.bind(this);
        this._apiHandler = apiHandler;
        this._hooks = hooks;
        this;
    }

    queRequest(requestConfig) {
        this._apiHandler.records.queRequest(requestConfig);
        return requestConfig;
    }

    makeLocalRequest(requestConfig) {
        makeLocalRequest(requestConfig);
        return requestConfig;
    }

    setResponseReceived(response) {
        this._apiHandler.records.recordResponse(response);
        return response;
    }

    setErrorReceived(response) {
        this._apiHandler.records.recordResponse(response);
        return Promise.reject(response);
    }

    broadcastSuccess(response) {
        const { config } = response;
        if (__guard__(config != null ? config.events : undefined, x => x.success)) { this._apiHandler.channel.emit(config.events.success, response); }
        return response;
    }

    broadcastError(response) {
        const { config } = response;
        if (__guard__(config != null ? config.events : undefined, x => x.failure)) { this._apiHandler.channel.emit(config.events.failure, response); }
        return Promise.reject(response);
    }

    makeLocalResponse(response) {
        makeLocalResponse(response);
        return response;
    }

    handleNonAPIErrors(error) {
        if (!error.response) {
            const status = 0;
            // TODO, see if error.toString() would be better here.
            const statusText = `${error.name} ${error.message}`;
            const data = error.stack;

            // spoof response error
            error.response = { status, statusText, data };
        }

        return Promise.reject(error);
    }

    handleLocalErrors(error) {
        const { response, config } = error;
        const { status, statusText } = response;

        // Hack for local testing, fake successful PUT and PATCH
        if (status === 404) {
            response.data = `No mock data found at ${config.url}.
This error only happens locally.`;
        }

        // Hack for local testing. Webserver returns 200 + HTML for 404's
        if ((statusText === 'parsererror') && (status === 200)) {
            response.status = 404;
            response.data = 'Error Parsing the JSON or a 404';
        }

        return Promise.reject(error);
    }

    handleMalformedRequest(error) {
        if ((error.response.status === 400) &&
      (this._hooks.handleMalformedRequest != null)) {

            error = this._hooks.handleMalformedRequest(error);
        }

        if (isError(error)) { return Promise.reject(error); }
        return null;
    }

    handleNotFound(error) {
        if (error.response.status === 404) {
            if (error.response.statusText == null) { error.response.statusText = 'ERROR_NOTFOUND'; }
            if (this._hooks.handleNotFound != null) { error = this._hooks.handleNotFound(error); }
        }

        if (isError(error)) { return Promise.reject(error); }
        return null;
    }

    handleErrorMessage(error) {
        let data, msg, statusText;
        if (isObjectLike(error.response)) {
            ({ statusText, data } = error.response);
        }

        try {
            msg = JSON.parse(statusText);
        } catch (error1) {
            msg = statusText;
        }

        error.response.statusMessage = msg;

        if (!isObjectLike(data)) {
            try {
                error.response.data = JSON.parse(data);
            } catch (error2) { console.warn(error2); } // eslint-disable-line no-console
        }

        return Promise.reject(error);
    }

    filterErrors(error) {
        let data;
        const { response, config } = error;
        if (isObjectLike(response)) { (((({ data } = response)))); }
        if (isEmpty(config)) { return Promise.reject(error); }
        if (isEmpty(config.handledErrors) ||
      !areAllErrorsHandled(config.handledErrors, data != null ? data.errors : undefined, this._apiHandler.getOptions().errorNameProperty)) {
            return Promise.reject(error);
        } else {
            return response;
        }
    }
}

export { Interceptors };

function __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
