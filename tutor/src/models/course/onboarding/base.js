import {
  observable,
  computed,
} from 'mobx';

import moment from 'moment';

import User from '../../user';
import { TimeStore } from '../../../flux/time';

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

  @computed get courseIsWellAged() {
    return moment(TimeStore.getNow()).isAfter(
      moment(this.course.primaryRole.joined_at).add(4, 'hours')
    );
  }


}
