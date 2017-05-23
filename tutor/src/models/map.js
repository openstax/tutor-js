import { ObservableMap, computed, observable } from 'mobx';
import { nonenumerable } from 'core-decorators';

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

  @nonenumerable
  apiRequestsInProgress = observable.map();

  @computed get hasApiRequestPending() {
    return !!this.apiRequestsInProgress.size;
  }

}
