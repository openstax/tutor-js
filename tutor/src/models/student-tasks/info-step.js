import { observable } from 'mobx';
import { readonly } from 'core-decorators';

export default
class StudentTaskInfoStep {

  constructor(info) {
    Object.assign(this, info);
  }
  @observable wasViewed = false;
  @observable type;
  @readonly is_completed = true;
  @readonly needsFetched = false;
  @readonly isInfo = true;
  fetchIfNeeded() { }
  markViewed() {}

  get preview() {
    'Blah'
  }
}
