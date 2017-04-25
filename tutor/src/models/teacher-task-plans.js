import { ObservableMap, computed } from 'mobx';

export default class TeacherTaskPlans extends ObservableMap {

  @computed get array() {
    return this.values();
  }

}
