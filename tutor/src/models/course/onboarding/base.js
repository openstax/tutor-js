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
  @observable isDismissed;

  static set spyMode(v) {
    SPY_MODE.set(v);
  }

  constructor(course, tourContext) {
    this.course = course;
    this.tourContext = tourContext;
    this.isDismissed = false;
  }

  // overridden by subclasses
  @computed get nagComponent() { return null; }

  // terms are allowed to interrupt nags
  @computed get ready() {
    return !this.isDismissed && !User.terms_signatures_needed && this.nagComponent;
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
