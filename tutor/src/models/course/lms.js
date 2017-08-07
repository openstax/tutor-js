import {
  computed, action,
} from 'mobx'

import {
  BaseModel, identifiedBy, session, identifier, observable,
} from '../base';

@identifiedBy('course/lms')
export default class CourseLMS extends BaseModel {
  @identifier id;

  @observable course;

  @session url    = '';
  @session xml    = '';
  @session key    = '';
  @session name   = '';
  @session secret = '';

  constructor(course) {
    super();
    this.course = course;
  }

  fetch() {
    return { courseId: this.course.id };
  }

  onLoaded({ data }) {
    this.update(data)
  }
}
