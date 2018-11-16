import {
  observable,
  computed,
} from 'mobx';
import moment from 'moment';
import User from '../../user';
import Time from '../../time';

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

  @computed get courseIsNaggable() {
    return SPY_MODE.get() || (
      this.course.isActive && moment(Time.now).isAfter(
        moment(this.course.primaryRole.joined_at).add(4, 'hours')
      )
    );
  }

  mount() { }
  close() { }
}
