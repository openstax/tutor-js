import {
  computed, observable,
} from 'mobx';

import { filter } from 'lodash';

import TeacherTaskPlans from '../teacher-task-plans';

export default class CoursePreviewBehaviour {

  @observable course;

  constructor(course) {
    this.course = course;
  }

  @computed get shouldWarnPreviewOnly() {
    const plans = TeacherTaskPlans.forCourseId(this.course.id).active;
    const demoPlans = filter(plans, { is_demo: true });
    return (plans.length - demoPlans.length == 3);
  }

  @computed get tourAudienceTags() {
    const tags = [];
    if (this.shouldWarnPreviewOnly) {
      tags.push('preview-warning');
    }
    return tags;
  }

}
