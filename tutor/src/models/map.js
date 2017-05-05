import { ObservableMap, computed } from 'mobx';

export default class Map extends ObservableMap {

  @computed get array() {
    return this.values();
  }

}
