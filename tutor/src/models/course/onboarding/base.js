import {
  observable,
  computed,
  action,
} from 'mobx';

import moment from 'moment';

import User from '../../user';
import { TimeStore } from '../../../flux/time';

const SPY_MODE = observable.box(false);

export default class BasicCourseOnboarding {

  @observable course;
  @observable tourContext;

  static set spyMode(v) {
    SPY_MODE.set(v);
  }

  constructor(course, tourContext) {
    this.course = course;
    this.tourContext = tourContext;
  }

  // don't display while either User terms or a Tour is being shown
  @computed get otherModalsAreDisplaying() {
    return !!(User.terms_signatures_needed || this.tourContext.tour);
  }

  @computed get courseIsWellAged() {
    return SPY_MODE.get() || moment(TimeStore.getNow()).isAfter(
      moment(this.course.primaryRole.joined_at).add(4, 'hours')
    );
  }


}
