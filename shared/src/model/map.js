import { observable, computed, action } from 'mobx';
import { isArray, isObject } from 'lodash';
import ModelApi from './api';
import lazyGetter from '../helpers/lazy-getter.js';

export default class Map {

  _map = observable.map()

  constructor(data) {
    if (isArray(data)) {
      this.mergeModelData(data);
    } else if (isObject(data)) {
      this._map.merge(data);
    }
  }

  @computed get array() {
    return this.values;
  }

  @computed values() {
    return Array.from(this._map.values());
  }

  get(key) {
    return this._map.get(key);
  }

  set(key, value) {
    this._map.set(key, value);
  }

  where(condition) {
    const map = new this.constructor(this.chainedValues);
    this._map.forEach(c => {
      if(condition(c)) { map.set(c.id, c); }
    });
    return map;
  }

  get chainedValues() {
    return {};
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
