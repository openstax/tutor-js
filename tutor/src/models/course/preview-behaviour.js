import {
  computed, observable,
} from 'mobx';

import { TeacherTaskPlanStore as TaskPlans } from '../flux/teacher-task-plan';

export default class CoursePreviewBehaviour {

  @observable course;

  constructor(course) {
    this.course = course;
  }

  // @computed shouldWarnPreviewOnly() {
  //   TaskPlans.getActiveCoursePlans
  // }

  @computed get tourAudienceTags() {
    return []
  }

}
