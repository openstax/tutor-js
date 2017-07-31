import { computed } from 'mobx';
import { filter } from 'lodash';

import Map from './map';
import TaskPlan from './teacher-task-plan';
import moment from 'moment';
import { TaskPlanStore } from '../flux/task-plan';

let TaskPlans;

TaskPlanStore.on('deleted', (planId) => {
  TaskPlans.forEach((plans) => plans.delete(planId));
});

class CourseTaskPlans extends Map {

  get courseId() { return this._courseId; }

  constructor(courseId) {
    super();
    this._courseId = courseId;
  }

  clearPendingClones() {
    for(const plan of this.array) {
      if (plan.isClone && plan.isNew) {
        this.delete(plan.id);
      }
    }
  }

  addPublishingPlan(planAttrs) {
    this.set(planAttrs.id, new TaskPlan(planAttrs));
  }

  addClone(planAttrs) {
    this.clearPendingClones();
    this.set(planAttrs.id, new TaskPlan(planAttrs));
  }

  @computed get active() {
    return this.where(plan => plan.is_deleting !== true);
  }

  @computed get isPublishing() {
    return this.where(plan => plan.is_publishing);
  }

  @computed get hasPublishing() {
    return this.isPublishing.any;
  }

  @computed get reading() {
    return this.where(plan => plan.type === 'reading');
  }

  @computed get homework() {
    return this.where(plan => plan.type === 'homework');
  }
}


class TeacherTaskPlans extends Map {

  forCourseId(courseId) {
    let courseMap = this.get(courseId);
    if (!courseMap) {
      courseMap = new CourseTaskPlans(courseId);
      this.set(courseId, courseMap);
    }
    return courseMap;
  }

  // note: the response also contains course, tasks and role but they're currently unused
  onLoaded({ data: { plans } }, [{ courseId }] ) {
    const map = this.forCourseId(courseId);
    plans.forEach(
      plan => map.set(plan.id, new TaskPlan(plan))
    );
  }


}

TaskPlans = new TeacherTaskPlans();
export default TaskPlans;
