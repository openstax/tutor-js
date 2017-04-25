import {
  computed, observable,
} from 'mobx';

import { filter } from 'lodash';

import { TeacherTaskPlanStore as TaskPlans } from '../../flux/teacher-task-plan';

export default class CoursePreviewBehaviour {

  @observable course;

  constructor(course) {
    this.course = course;
  }


  get shouldWarnPreviewOnly() {
    const tasks = TaskPlans.getActiveCoursePlans(this.course.id);
    const demoTasks = filter(tasks, { is_demo: true });
    return (tasks.length - demoTasks.length == 3);
  }

  @computed get tourAudienceTags() {
    const tags = [];
    if (this.shouldWarnPreviewOnly) {
      tags.push('preview-warning');
    }
    return tags;
  }

}
