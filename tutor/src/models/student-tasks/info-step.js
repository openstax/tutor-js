import { readonly } from 'core-decorators';

export default
class StudentTaskInfoStep {

  constructor(info) {
    Object.assign(this, info);
  }
  @readonly is_completed = true;
  @readonly needsFetched = false;
  @readonly isInfo = true;
  fetchIfNeeded() { }
  markViewed() {}
}
