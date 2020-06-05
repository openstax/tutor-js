import { observable, computed } from 'mobx';
import { readonly } from 'core-decorators';

const TITLES = {
  'individual-review-intro':  'Your individual review',
  'personalized-intro': 'Your individual review',
  'two-step-intro':    'Two step problems',
  'spaced-practice-intro': 'About spaced practice',
};

export default
class StudentTaskInfoStep {

  constructor(info) {
    Object.assign(this, info);
  }
  @observable wasViewed = false;
  @observable type;
  @readonly is_completed = true;
  @readonly needsFetched = false;
  @readonly isPlaceHolder = false;
  @readonly isInfo = true;
  fetchIfNeeded() { }
  markViewed() {}

  @computed get id() {
    return this.type;
  }

  get preview() {
    return 'end' == this.type ? `${this.task.title} Completed` : TITLES[this.type];
  }
}
