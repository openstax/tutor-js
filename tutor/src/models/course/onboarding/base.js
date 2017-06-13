import {
  observable,
  computed,
} from 'mobx';

import User from '../../user';

export default class BasicCourseOnboarding {

  @observable course;
  @observable tourContext;

  constructor(course, tourContext) {
    this.course = course;
    this.tourContext = tourContext;
  }

  // don't display while either User terms or a Tour is being shown
  @computed get otherModalsAreDisplaying() {
    return !!(User.terms_signatures_needed || this.tourContext.tour);
  }
}
