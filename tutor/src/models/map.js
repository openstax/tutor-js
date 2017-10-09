import { ObservableMap, computed } from 'mobx';
import ModelApi from './api';
import lazyGetter from '../helpers/lazy-getter.js';

export default class Map extends ObservableMap {

  @computed get array() {
    return this.values();
  }

  where(condition) {
    const map = new this.constructor();
    this.forEach(c => {
      if(condition(c)) { map.set(c.id, c); }
    });
    return map;
  }

  @computed get isEmpty() {
    return this.size === 0;
  }

  @computed get any() {
    return ! this.isEmpty;
  }

  @lazyGetter api = new ModelApi();

}
