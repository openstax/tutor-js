import { computed, observable } from 'mobx';
import Map from './map';
import TaskPlan from './task-plan/teacher';
import { TaskPlanStore } from '../flux/task-plan';

let TaskPlans;

const DELETED = observable.map();

TaskPlanStore.on('deleting', (planId) => {
  DELETED.set(planId, true);
});

class CourseTaskPlans extends Map {

  get courseId() { return this._courseId; }

  constructor(courseId) {
    super();
    this._courseId = courseId;
  }

  withPlanId(planId) {
    let plan = this.get(planId);
    if (!plan) {
      plan = new TaskPlan({ id: planId });
      this.set(planId, plan);
    }
    return plan;
  }

  onPlanSave(oldId, planAttrs) {
    let tp = this.get(oldId);
    if (tp) {
      tp.update(planAttrs);
    } else {
      tp = new TaskPlan(planAttrs);
    }
    this.set(planAttrs.id, tp);
    if (oldId != tp.id) {
      this.delete(oldId);
    }
  }

  addClone(planAttrs) {
    this.set(planAttrs.id, new TaskPlan(planAttrs));
  }

  @computed get active() {
    return this.where(plan => !DELETED.has(plan.id) && !plan.is_deleting);
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
      plan => {
        const tp = map.get(plan.id);
        tp ? tp.update(plan) : map.set(plan.id, new TaskPlan(plan));
      }
    );
  }

  clear() {
    super.clear();
    DELETED.clear();
  }

}

TaskPlans = new TeacherTaskPlans();
export default TaskPlans;
