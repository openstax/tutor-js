import { observable, computed, action } from 'mobx';
import { isArray, isObject } from 'lodash';
import ModelApi from './api';
import lazyGetter from '../helpers/lazy-getter.js';

export default class Map {

  static toObject(map) {
    const obj = {};
    for(let prop of map){
      obj[prop[0]] = prop[1];
    }
    return obj;
  }

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

  @action ensureLoaded() {
    if (!this.api.isPending && !this.api.hasBeenFetched) {
      return this.fetch();
    }
    return Promise.resolve();
  }

  @computed get array() {
    return this.values();
  }

  get toObject() {
    return Map.toObject(this._map);
  }

  keys() {
    return Array.from(this._map.keys());
  }

  values() {
    return Array.from(this._map.values());
  }

  has(key) {
    return this._map.has(this.keyType(key));
  }

  get(key) {
    return this._map.get(this.keyType(key));
  }

  set(key, value) {
    return this._map.set(this.keyType(key), value);
  }

  delete(key) {
    return this._map.delete(this.keyType(key));
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

  @action merge(obj) {
    return this._map.merge(obj);
  }

  @lazyGetter api = new ModelApi();

  @action mergeModelData(data) {
    data.forEach((modelData) => {
      const model = this.get(modelData.id);
      model ? model.update(modelData) : this.set(modelData.id, new this.constructor.Model(modelData, this));
    });
  }

  @action reset() {
    this.clear();
    this.api.reset();
  }
}

['forEach', 'replace', 'clear'].forEach(prop => {
  Map.prototype[prop] = function(...args) {
    return this._map[prop](...args);
  };
});
