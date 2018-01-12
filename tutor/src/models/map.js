import { ObservableMap, computed, action } from 'mobx';
import { isArray } from 'lodash';
import ModelApi from './api';
import lazyGetter from '../helpers/lazy-getter.js';

export default class Map extends ObservableMap {

  constructor(data) {
    super();
    if (isArray(data)) {
      this.mergeModelData(data);
    }
  }

  @computed get array() {
    return this.values();
  }

  where(condition) {
    const map = new this.constructor(this.chainedValues);
    this.forEach(c => {
      if(condition(c)) { map.set(c.id, c); }
    });
    return map;
  }

  get chainedValues() {
    return {};
  }

  @computed get isEmpty() {
    return this.size === 0;
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
