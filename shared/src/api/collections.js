import hash from 'object-hash';
import moment from 'moment';
import {
  partial, every, pick, trim, omitBy, merge, some, has,
  flow, last, size, keys, memoize, forEach, isEmpty,
  cloneDeep, isString, isUndefined,
} from 'lodash';

const validateOptions = (...requiredProperties) =>
  options => every(requiredProperties, partial(has, options))
;

const hashWithArrays = partial(hash, partial.placeholder, { unorderedArrays: true });

const makeHashWith = (...uniqueProperties) =>
  objectToHash => hashWithArrays(pick(objectToHash, ...Array.from(uniqueProperties)))
;

const constructCollection = function(context, makeItem, lookup) {
  context._cache = {};
  context.make = makeItem;
  context.lookup = memoize(lookup) || memoize(flow(makeItem, hashWithArrays));

  return context;
};

class Collection {
  constructor(makeItem, lookup) {
    this.set = this.set.bind(this);
    this.update = this.update.bind(this);
    this.load = this.load.bind(this);
    this.get = this.get.bind(this);
    this.delete = this.delete.bind(this);
    constructCollection(this, makeItem, lookup);
  }

  set(...args) {
    return this._cache[this.lookup(...Array.from(args || []))] = this.make(...Array.from(args || []));
  }

  update(...args) {
    return merge(this._cache[this.lookup(...Array.from(args || []))], ...Array.from(args));
  }

  load(items) {
    return forEach(items, this.set);
  }

  get(...args) {
    return cloneDeep(this._cache[this.lookup(...Array.from(args || []))]);
  }

  delete(...args) {
    delete this._cache[this.lookup(...Array.from(args || []))];
    return true;
  }
}


class CollectionCached {
  constructor(makeItem, lookup) {
    this.update = this.update.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getSize = this.getSize.bind(this);
    this.reset = this.reset.bind(this);
    constructCollection(this, makeItem, lookup);
  }

  update(...args) {
    let name;
    if (this._cache[name = this.lookup(...Array.from(args || []))] == null) { this._cache[name] = []; }
    return this._cache[this.lookup(...Array.from(args || []))].push(this.make(...Array.from(args || [])));
  }

  get(...args) {
    return flow(last, cloneDeep)(this._cache[this.lookup(...Array.from(args || []))]);
  }

  getAll(...args) {
    return cloneDeep(this._cache[this.lookup(...Array.from(args || []))]);
  }

  getSize(...args) {
    return size(this._cache[this.lookup(...Array.from(args || []))]) || 0;
  }

  reset(...args) {
    delete this._cache[this.lookup(...Array.from(args || []))];
    return true;
  }
}


// the combination of these should be unique
const ROUTE_UNIQUES = ['subject', 'action'];

// options will be stored by hash of ROUTE_UNIQUES
//
// routesSchema = [{
//   subject: 'exercises'
//   topic: '*' // optional, default
//   pattern: ''
//   method: 'GET'
//   action: 'fetch' // optional, defaults to method
//   baseUrl: // optional, will override API class default
//   onSuccess: -> // optional
//   onFail: -> // optional
//   headers: // optional
//   withCredentials: // option
// }]
const METHODS_TO_ACTIONS = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete',
};

const makeRoute = function(options = {}) {
  // TODO throw errors
  // TODO look for validator lib, maybe even use React.PropTypes base/would be nice to
  //   validate that method is valid for example and not just exists.
  if (!validateOptions('subject', 'pattern', 'method')(options)) { return options; }

  const DEFAULT_ROUTE_OPTIONS =
    { topic: '*' };

  const route = merge({}, DEFAULT_ROUTE_OPTIONS, options);
  if (route.action == null) { route.action = METHODS_TO_ACTIONS[route.method]; }
  if (route.errorHandlers) { if (route.handledErrors == null) { route.handledErrors = keys(route.errorHandlers); } }

  return route;
};

class Routes extends Collection {
  constructor(routes = [], uniqueProperties = ROUTE_UNIQUES) {
    const hashRoute = makeHashWith(...Array.from(uniqueProperties || []));
    const lookup = flow(makeRoute, hashRoute);

    super(makeRoute, lookup);
    this.load(routes);
    this;
  }
}

const simplifyRequestConfig = function(requestConfig) {
  const simpleRequest = pick(requestConfig, 'method', 'data', 'url', 'params');
  if (requestConfig.baseURL) { simpleRequest.url = simpleRequest.url.replace(requestConfig.baseURL, ''); }
  simpleRequest.url = trim(simpleRequest.url, '/');

  if (isString(simpleRequest.data)) {
    try {
      simpleRequest.data = JSON.parse(simpleRequest.data);
    } catch (e) {} // eslint-disable-line no-empty
  }

  if (isEmpty(simpleRequest.data)) {
    delete simpleRequest.data;
  }

  if (simpleRequest.data) {
    simpleRequest.data = omitBy(simpleRequest.data, isUndefined);
  }
  return simpleRequest;
};

class XHRRecords {
  constructor() {
    this.queRequest = this.queRequest.bind(this);
    this.recordResponse = this.recordResponse.bind(this);
    this.isPending = this.isPending.bind(this);
    this.getResponseTime = this.getResponseTime.bind(this);
    const hashRequestConfig = flow(simplifyRequestConfig, hashWithArrays);
    const makeTime = () => moment();

    this._requests = new CollectionCached(makeTime, hashRequestConfig);
    this._responses = new CollectionCached(makeTime, hashRequestConfig);
    this;
  }

  queRequest(requestConfig) {
    return this._requests.update(requestConfig);
  }

  recordResponse({ config }) {
    return this._responses.update(config);
  }

  isPending(requestConfig) {
    if (requestConfig) {
      return this._requests.getSize(requestConfig) > this._responses.getSize(requestConfig);
    } else {
      return some(this._requests._cache, (cachedRequests, requestKey) => {
        return size(cachedRequests) > size(this._responses._cache[requestKey]);
      });
    }
  }

  getResponseTime(requestConfig) {
    return this._requests.get(requestConfig).diff(this._responses.get(requestConfig));
  }
}


const utils = { validateOptions, hashWithArrays, makeHashWith, constructCollection, makeRoute, simplifyRequestConfig };

export { Collection, CollectionCached, Routes, XHRRecords, utils, METHODS_TO_ACTIONS };
