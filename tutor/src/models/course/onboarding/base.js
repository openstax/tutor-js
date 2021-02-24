import {
    observable,
    computed,
} from 'mobx';
import moment from 'moment';
import Time from '../../time';

const SPY_MODE = observable.box(false);

export default class BasicCourseOnboarding {

  @observable course;
  @observable tourContext;
  @observable isDismissed;

  priority = 3;

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

  @computed get isReady() {
      return !this.isDismissed && this.nagComponent;
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
