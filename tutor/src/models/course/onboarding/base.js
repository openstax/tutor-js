import {
  observable,
} from 'mobx';

export default class BasicCourseOnboarding {

  @observable course;

  constructor(course) {
    this.course = course;
  }


}
