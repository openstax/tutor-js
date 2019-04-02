import { readonly } from 'core-decorators';

export default
class StudentTaskInfoStep {

  constructor(info) {
    Object.assign(this, info);
  }

  @readonly needsFetched = false;
  fetchIfNeeded() { }
  markViewed() {}
}
