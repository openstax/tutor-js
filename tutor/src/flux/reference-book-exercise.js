/* eslint-disable */
import { CrudConfig, makeSimpleStore, extendConfig } from './helpers';
import _ from 'underscore';

const LOADING = 'loading';
const QUERY_START_STRING = '?q=';

const combineQueries = function(multipleUrls) {
  const params = {};
  const tags = _.map(multipleUrls, function(url) {
    const queryString = decodeURIComponent(url.split(QUERY_START_STRING)[1]);
    let [param, value] = Array.from(queryString.split(':'));
    // trim individual tag of double quotes
    value = value.replace(/^"(.+(?="$))"$/, '$1');
    if (params[param] == null) { params[param] = []; }
    params[param].push(value);

    if (param === 'tag') { return value; }
  });
  const urlsAndTags = _.object(multipleUrls, tags);
  const queryStrings = _.map(params, (values, paramKey) =>
    // join values and wrap all values with a single pair of double quotes
    `${paramKey}:\"${values.join(',')}\"`
  );
  const queryString = queryStrings.join(' ');

  return { queryString, urlsAndTags };
};

const getMultipleUrl = function(multipleUrls, baseUrl) {
  const { queryString } = combineQueries(multipleUrls);

  return `${baseUrl}?q=${queryString}`;
};

const ReferenceBookExerciseConfig = {
  _toSeparate: {},

  loadMultiple(multipleUrls) {
    const baseUrl = _.first(multipleUrls).split(QUERY_START_STRING)[0];
    const { queryString, urlsAndTags } = combineQueries(multipleUrls, baseUrl);
    const url = `${baseUrl}?q=${queryString}`;

    return this._toSeparate[url] = urlsAndTags;
  },

  _loaded(obj, id) {
    if (this._toSeparate[id] != null) {
      _.each(this._toSeparate[id], (tag, url) => {
        const exercise = _.find(obj.items, item => item.tags.indexOf(tag) > -1);
        const exerciseObj =
          { items: [exercise] };
        return this.loaded(exerciseObj, url);
      });

      delete this._toSeparate[id];
      this.emit('loaded.multiple');
    } else {
      this.emit(`loaded.${id}`);
    }

    return obj;
  },

  exports: {
    isQueued(id) {
      return _.chain(this._toSeparate)
        .find(urlsAndTags => urlsAndTags[id] != null)
        .isObject()
        .value();
    },
  },
};

extendConfig(ReferenceBookExerciseConfig, new CrudConfig());
const { actions, store } = makeSimpleStore(ReferenceBookExerciseConfig);
export { actions as ReferenceBookExerciseActions, store as ReferenceBookExerciseStore };
