import { observable, computed, action, toJS } from 'mobx';
import { isArray, isObject } from 'lodash';
import ModelApi from './api';
import lazyGetter from '../helpers/lazy-getter.js';

export default class Map {

  keyType = Number

  _map = observable.map()

  constructor(data, options = {}) {
    Object.assign(this, options);
    if (isArray(data)) {
      this.mergeModelData(data);
    } else if (isObject(data)) {
      this._map.merge(data);
    }
  }

  @computed get array() {
    return this.values();
  }

  toJS() {
    return toJS(this._map);
  }

  keys() {
    return Array.from(this._map.keys());
  }

  values() {
    return Array.from(this._map.values());
  }

  get(key) {
    return this._map.get(this.keyType(key));
  }

  set(key, value) {
    this._map.set(this.keyType(key), value);
  }

  where(condition) {
    const map = new this.constructor(this.chainedValues, { keyType: this.keyType });
    this._map.forEach(c => {
      if(condition(c)) { map.set(c.id, c); }
    });
    return map;
  }

  get chainedValues() {
    return {};
  }

  @computed get size() {
    return this._map.size;
  }

  @computed get isEmpty() {
    return this._map.size === 0;
  }

  @computed get any() {
    return ! this.isEmpty;
  }

  @lazyGetter api = new ModelApi();

  @action mergeModelData(data) {
    data.forEach((modelData) => {
      const model = this.get(modelData.id);
      model ? model.update(modelData) : this.set(modelData.id, new this.constructor.Model(modelData, this));
    });
  }
}

['map', 'replace', 'clear'].forEach(prop => {
  Map.prototype[prop] = function(...args) {
    return this._map[prop](...args);
  };
});
